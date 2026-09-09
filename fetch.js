import { initializeApp } from "https://gstatic.com";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://gstatic.com";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://gstatic.com";

// إعدادات الـ Firebase الحقيقية لتطبيق Trenda World المستخرجة من ملفك
const firebaseConfig = {
    apiKey: "AIzaSyDGUcw247021A8HxGg3s1kbo2ZGNTARGNQ",
    authDomain: "://firebaseapp.com",
    projectId: "tawasol-8853b",
    storageBucket: "tawasol-8853b.firebasestorage.app",
    messagingSenderId: "629728672142",
    appId: "1:629728672142:android:ef9d6a717e27bc11514cdf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const authContainer = document.getElementById('auth-container');
const trendsContainer = document.getElementById('trends-container');
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnPrimary = document.getElementById('btn-primary');
const btnToggle = document.getElementById('btn-toggle');
const toggleText = document.getElementById('toggle-text');
const authTitle = document.getElementById('auth-title');
const btnLogout = document.getElementById('btn-logout');
const trendsList = document.getElementById('trends-list');

let isSignUpMode = false;

btnToggle.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    if (isSignUpMode) {
        authTitle.innerText = "إنشاء حساب جديد";
        btnPrimary.innerText = "تسجيل الحساب";
        toggleText.innerText = "لديك حساب بالفعل؟";
        btnToggle.innerText = "تسجيل الدخول";
    } else {
        authTitle.innerText = "Trenda World";
        btnPrimary.innerText = "دخول";
        toggleText.innerText = "ليس لديك حساب؟";
        btnToggle.innerText = "إنشاء حساب جديد";
    }
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        if (isSignUpMode) {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('تم إنشاء الحساب بنجاح في Trenda World!');
        } else {
            await signInWithEmailAndPassword(auth, email, password);
        }
    } catch (error) {
        alert('خطأ في العملية: ' + error.message);
    }
});

btnLogout.addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, (user) => {
    if (user) {
        authContainer.classList.add('hidden');
        trendsContainer.classList.remove('hidden');
        loadTrends();
    } else {
        authContainer.classList.remove('hidden');
        trendsContainer.classList.add('hidden');
        trendsList.innerHTML = '';
    }
});

function loadTrends() {
    const q = query(collection(db, "trends"), orderBy("timestamp", "desc"));
    
    onSnapshot(q, (snapshot) => {
        trendsList.innerHTML = '';
        if (snapshot.empty) {
            trendsList.innerHTML = '<p class="text-gray-400 col-span-2 text-center py-8">لا توجد ترندات متوفرة في قاعدة البيانات حالياً.</p>';
            return;
        }
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = "bg-gray-700 p-4 rounded-xl border border-gray-600 flex justify-between items-center";
            card.innerHTML = `
                <div>
                    <span class="text-xs text-indigo-400 font-bold"># ${data.rank || '-'}</span>
                    <h3 class="text-lg font-bold mt-1">${data.title}</h3>
                </div>
                <div class="text-left">
                    <span class="bg-gray-800 text-xs px-2.5 py-1 rounded-full text-gray-300">${data.volume || 'نشط عالي'}</span>
                </div>
            `;
            trendsList.appendChild(card);
        });
    });
}
