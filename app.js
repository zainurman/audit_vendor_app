// Struktur Data sesuai Excel Anda
const auditData = [
    {
        id: 1,
        title: "Area 1: Legalitas & Profil Perusahaan",
        isCritical: true,
        items: [
            "Apakah vendor memiliki dokumen legalitas perusahaan yang lengkap & masih berlaku?",
            "Apakah vendor memiliki struktur organisasi yang jelas?",
            "Apakah vendor memiliki perizinan khusus terkait penyediaan tenaga kerja?",
            "Apakah vendor memiliki profil perusahaan (Company Profile) yang update?"
        ]
    },
    {
        id: 2,
        title: "Area 2: Sistem Manajemen SDM",
        isCritical: false,
        items: [
            "Apakah vendor memiliki kebijakan tertulis terkait manajemen SDM?",
            "Apakah ada SOP untuk pengelolaan gaji dan tunjangan?",
            "Apakah ada sistem untuk menangani keluhan karyawan?",
            "Apakah ada evaluasi kinerja karyawan secara berkala?"
        ]
    }
    // Tambahkan Area 3 sampai 10 di sini mengikuti pola di atas.
    // Pastikan Area 4, 6, 9, 10 diberi nilai isCritical: true
];

const subCriteria = ["Prosedur (SOP)", "Implementasi", "Kontrol", "Evaluasi"];

// Fungsi untuk membuat form secara dinamis
function renderForm() {
    const container = document.getElementById("questionsContainer");
    let html = "";

    auditData.forEach((area, areaIndex) => {
        let criticalBadge = area.isCritical ? '<span class="critical-tag">★ AREA KRITIS</span>' : '';
        html += `<div class="area-section">
                    <div class="area-title">${area.title} ${criticalBadge}</div>`;
        
        area.items.forEach((item, itemIndex) => {
            html += `<div class="question-item">
                        <div class="question-text">${itemIndex + 1}. ${item}</div>
                        <div class="checkbox-group">`;
            
            subCriteria.forEach((sub, subIndex) => {
                html += `<label>
                            <input type="checkbox" class="chk-area-${areaIndex}" data-area="${areaIndex}" data-item="${itemIndex}">
                            ${sub}
                         </label>`;
            });
            
            html += `</div></div>`;
        });
        html += `</div>`;
    });

    container.innerHTML = html;
}

// Fungsi menghitung skor
function calculateScore() {
    let totalScore = 0;
    let criticalZeroFound = false;

    auditData.forEach((area, areaIndex) => {
        let areaTotalPoint = 0;

        area.items.forEach((item, itemIndex) => {
            // Hitung jumlah centang pada item ini
            const checkboxes = document.querySelectorAll(`input.chk-area-${areaIndex}[data-item="${itemIndex}"]:checked`);
            const checkCount = checkboxes.length;
            
            let point = 0;
            // Konversi Poin sesuai file "Panduan Penilaian.csv"
            if (checkCount === 4) point = 5;
            else if (checkCount === 3) point = 4;
            else if (checkCount === 2) point = 3;
            else if (checkCount === 1) point = 2;
            else if (checkCount === 0) point = 0;

            areaTotalPoint += point;

            // Cek kondisi Area Kritis
            if (area.isCritical && point === 0) {
                criticalZeroFound = true;
            }
        });

        // Score Area = Rata-rata point dari 4 item
        let areaScore = areaTotalPoint / area.items.length;
        totalScore += areaScore;
    });

    // Tampilkan Score
    document.getElementById("totalScore").innerText = totalScore.toFixed(2);

    // Tentukan Grade
    let finalStatus = "";
    const warningEl = document.getElementById("criticalWarning");

    if (totalScore >= 46 && !criticalZeroFound) {
        finalStatus = "✅ GRADE A — PASS";
        warningEl.style.display = "none";
        document.getElementById("finalStatus").style.color = "green";
    } else if (totalScore >= 40 && totalScore <= 45 && !criticalZeroFound) {
        finalStatus = "⚠️ GRADE B — CONDITIONAL";
        warningEl.style.display = "none";
        document.getElementById("finalStatus").style.color = "orange";
    } else {
        finalStatus = "❌ GRADE C — NOT PASS";
        document.getElementById("finalStatus").style.color = "red";
        if (criticalZeroFound) {
            warningEl.style.display = "block";
        } else {
            warningEl.style.display = "none";
        }
    }

    document.getElementById("finalStatus").innerText = finalStatus;
}

// Jalankan saat halaman dimuat
window.onload = renderForm;