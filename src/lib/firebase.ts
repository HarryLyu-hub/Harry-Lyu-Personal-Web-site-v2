import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, writeBatch } from "firebase/firestore";

let db: any = null;
let isFirebaseActive = false;

export interface StudentProfile {
  email: string;
  name: string;
  org: string;
  phone: string;
  role: "admin" | "assistant" | "trainee";
  selectedPlan?: "24h" | "1mo" | "3mo" | "1yr";
  status: "pending_approval" | "active" | "expired";
  expiryDate?: number;
  createdAt: number;
  password?: string;
}

/**
 * Dynamically loads and initializes Firebase from the environment config file
 */
export async function initFirebase() {
  if (db) return { db, isFirebaseActive };
  try {
    const response = await fetch("/firebase-applet-config.json");
    if (response.ok) {
      const config = await response.json();
      if (config && config.apiKey && config.projectId) {
        const app = getApps().length === 0 ? initializeApp(config) : getApp();
        db = getFirestore(app);
        isFirebaseActive = true;
        console.log("🔥 Firebase initialized successfully. Cloud sync is active!");
      }
    }
  } catch (e) {
    console.log("Firebase config file not available or not yet accepted. Running in high-fidelity local mode.");
  }
  return { db, isFirebaseActive };
}

/**
 * Asynchronously pulls and merges student data from Firestore into local storage
 */
export async function syncFromCloud(onSyncSuccess: (mergedStudents: StudentProfile[]) => void) {
  try {
    const { db, isFirebaseActive } = await initFirebase();
    if (!isFirebaseActive || !db) return;

    const querySnapshot = await getDocs(collection(db, "students"));
    const cloudStudents: StudentProfile[] = [];
    querySnapshot.forEach((doc) => {
      cloudStudents.push(doc.data() as StudentProfile);
    });

    if (cloudStudents.length > 0) {
      // Merge cloud profiles with local profiles
      const localStr = localStorage.getItem("HARRY_REGISTERED_STUDENTS");
      let localStudents: StudentProfile[] = localStr ? JSON.parse(localStr) : [];

      const mergedMap = new Map<string, StudentProfile>();
      // Load local ones first
      localStudents.forEach(s => mergedMap.set(s.email.toLowerCase(), s));
      // Overwrite or add cloud ones (cloud is source of truth for durable storage)
      cloudStudents.forEach(s => mergedMap.set(s.email.toLowerCase(), s));

      const merged = Array.from(mergedMap.values());
      localStorage.setItem("HARRY_REGISTERED_STUDENTS", JSON.stringify(merged));
      onSyncSuccess(merged);
      console.log(`Synced ${cloudStudents.length} profiles from Cloud Firestore.`);
    }
  } catch (err) {
    console.error("Cloud synchronization error:", err);
  }
}

/**
 * Saves or updates a student profile to Cloud Firestore
 */
export async function saveToCloud(student: StudentProfile) {
  try {
    const { db, isFirebaseActive } = await initFirebase();
    if (!isFirebaseActive || !db) return;

    // Use clean lowercased email as document ID
    const docId = student.email.trim().toLowerCase();
    const docRef = doc(db, "students", docId);
    await setDoc(docRef, student, { merge: true });
    console.log(`Successfully persisted profile for ${student.name} (${student.email}) to Firestore.`);
  } catch (err) {
    console.error("Failed to write to Cloud Firestore:", err);
  }
}
