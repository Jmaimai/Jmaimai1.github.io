document.addEventListener('DOMContentLoaded', function() {
    // ตัวแปรสำหรับเก็บข้อมูล
    let currentStep = 1;
    const formData = {
        personalInfo: {},
        skills: ['HTML', 'CSS'], // เริ่มต้นด้วยทักษะตัวอย่างจาก HTML
        preferences: {}
    };

    // ฟังก์ชันเริ่มต้น
    function init() {
        setupEventListeners();
        updateStepUI();
        renderSkillTags();
    }

    // ตั้งค่า Event Listeners
    function setupEventListeners() {
        // ปุ่มใน Hero Section
        document.getElementById('startAssessmentBtn').addEventListener('click', goToAssessment);
        document.getElementById('browseJobsBtn').addEventListener('click', browseAllJobs);

        // ปุ่ม Navigation ในฟอร์ม
        document.getElementById('step1NextBtn').addEventListener('click', nextStep);
        document.getElementById('step2BackBtn').addEventListener('click', prevStep);
        document.getElementById('step2NextBtn').addEventListener('click', nextStep);
        document.getElementById('step3BackBtn').addEventListener('click', prevStep);
        document.getElementById('step3SubmitBtn').addEventListener('click', submitAssessment);

        // การจัดการทักษะ
        document.getElementById('newSkill').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addSkill();
        });
        document.querySelector('.add-skill-btn').addEventListener('click', addSkill);
    }

    // ฟังก์ชันสำหรับการนำทาง
    function goToAssessment() {
        document.getElementById('assessment').scrollIntoView({ behavior: 'smooth' });
    }

    function browseAllJobs() {
        alert('กำลังนำคุณไปยังหน้ารายการงานทั้งหมด');
        // ในทางปฏิบัติควรเปลี่ยนเส้นทางไปยังหน้าค้นหางาน
    }

    function nextStep() {
        if (validateStep(currentStep)) {
            saveStepData(currentStep);
            currentStep++;
            updateStepUI();
        }
    }

    function prevStep() {
        currentStep--;
        updateStepUI();
    }

    // อัพเดท UI ตามขั้นตอนปัจจุบัน
    function updateStepUI() {
        // ซ่อนทุกขั้นตอน
        document.querySelectorAll('.step-content').forEach(el => {
            el.style.display = 'none';
        });

        // แสดงขั้นตอนปัจจุบัน
        document.getElementById(`step${currentStep}Content`).style.display = 'block';

        // อัพเดทสถานะขั้นตอน
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else if (index + 1 < currentStep) {
                step.classList.add('completed');
            }
        });

        // อัพเดท Progress Bar
        const progressPercentage = ((currentStep - 1) / 2) * 100;
        document.getElementById('stepProgress').style.width = `${progressPercentage}%`;
    }

    // ตรวจสอบความถูกต้องของข้อมูลในขั้นตอนปัจจุบัน
    function validateStep(step) {
        if (step === 1) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const education = document.getElementById('education').value;

            if (!name) {
                alert('กรุณากรอกชื่อ-นามสกุล');
                return false;
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('กรุณากรอกอีเมลให้ถูกต้อง');
                return false;
            }

            if (!education) {
                alert('กรุณาเลือกระดับการศึกษา');
                return false;
            }

            return true;
        }

        if (step === 3) {
            const interest = document.getElementById('interest').value;
            const personality = document.getElementById('personality').value;

            if (!interest) {
                alert('กรุณาเลือกประเภทงานที่สนใจ');
                return false;
            }

            if (!personality) {
                alert('กรุณาเลือกลักษณะบุคลิกภาพ');
                return false;
            }

            return true;
        }

        return true;
    }

    // บันทึกข้อมูลจากขั้นตอนปัจจุบัน
    function saveStepData(step) {
        if (step === 1) {
            formData.personalInfo = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                education: document.getElementById('education').value,
                experience: document.getElementById('experience').value
            };
        } else if (step === 2) {
            formData.currentJob = document.getElementById('currentJob').value.trim();
            formData.jobDescription = document.getElementById('jobDescription').value.trim();
        } else if (step === 3) {
            formData.preferences = {
                interest: document.getElementById('interest').value,
                personality: document.getElementById('personality').value,
                salary: document.getElementById('salary').value
            };
        }
    }

    // การจัดการทักษะ
    function renderSkillTags() {
        const container = document.getElementById('skillTags');
        container.innerHTML = '';
        
        formData.skills.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                <span>${skill}</span>
                <i class="fas fa-times skill-tag-remove"></i>
            `;
            tag.querySelector('.skill-tag-remove').addEventListener('click', () => removeSkill(skill));
            container.appendChild(tag);
        });
    }

    function addSkill() {
        const input = document.getElementById('newSkill');
        const skill = input.value.trim();
        
        if (skill && !formData.skills.includes(skill)) {
            formData.skills.push(skill);
            input.value = '';
            renderSkillTags();
        }
    }

    function removeSkill(skill) {
        formData.skills = formData.skills.filter(s => s !== skill);
        renderSkillTags();
    }

    // ส่งแบบประเมิน
    function submitAssessment() {
        if (validateStep(3)) {
            saveStepData(3);
            showMatchingResults();
        }
    }

    // แสดงผลลัพธ์การจับคู่
    function showMatchingResults() {
        // ในทางปฏิบัติควรเรียก API เพื่อรับข้อมูลจริง
        const mockResults = [
            {
                title: "Frontend Developer (React)",
                company: "บริษัท เทคโนโลยีชั้นนำ จำกัด (มหาชน)",
                location: "กรุงเทพมหานคร (แบบไฮบริด)",
                salary: "40,000 - 60,000 บาท",
                match: 92
            },
            {
                title: "UI/UX Designer",
                company: "บริษัท สตาร์ทอัพด้านการออกแบบ",
                location: "กรุงเทพมหานคร (ทำงานจากที่บ้านได้)",
                salary: "35,000 - 50,000 บาท",
                match: 85
            },
            {
                title: "Backend Developer (Node.js)",
                company: "บริษัท เทคโนโลยีชั้นนำ จำกัด (มหาชน)",
                location: "กรุงเทพมหานคร (ทำงานจากที่บ้านได้)",
                salary: "50,000 - 70,000 บาท",
                match: 88
            },
            {
                title: "Data Analyst",
                company: "บริษัท ข้อมูลและการวิเคราะห์ จำกัด",
                location: "กรุงเทพมหานคร (ทำงานจากที่บ้านได้)",
                salary: "45,000 - 65,000 บาท",
                match: 90
            }
        ];

        const container = document.getElementById('matchingResultsContainer');
        
        // เก็บส่วนหัวไว้
        const header = container.querySelector('.preview-header');
        container.innerHTML = '';
        container.appendChild(header);

        // เพิ่มผลลัพธ์
        mockResults.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <div class="job-header">
                    <div>
                        <h4 class="job-title">${job.title}</h4>
                        <p class="job-company">${job.company}</p>
                    </div>
                    <div class="match-percentage">${job.match}%</div>
                </div>
                <div class="job-meta">
                    <div class="job-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${job.location}</span>
                    </div>
                    <div class="job-meta-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>เงินเดือน ${job.salary}</span>
                    </div>
                </div>
                <div class="job-actions">
                    <button class="save-job">บันทึก</button>
                    <button class="apply-job">สมัครงาน</button>
                </div>
            `;
            
            // เพิ่ม Event Listeners ให้ปุ่มในการ์ด
            jobCard.querySelector('.save-job').addEventListener('click', () => {
                alert(`บันทึกงาน "${job.title}" เรียบร้อยแล้ว`);
            });
            
            jobCard.querySelector('.apply-job').addEventListener('click', () => {
                alert(`กำลังนำคุณไปยังหน้าสมัครงาน "${job.title}"`);
            });
            
            container.appendChild(jobCard);
        });

        // เลื่อนไปยังส่วนผลลัพธ์
        document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
    }

    // เริ่มต้นแอปพลิเคชัน
    init();
});
