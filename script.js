let refresh = () => {};

function initApp(){

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const previewName = document.getElementById('previewName');
    const previewEmail = document.getElementById('previewEmail');
    const previewPhone = document.getElementById('previewPhone');

    const pdfName = document.getElementById('pdfName');
    const pdfEmail = document.getElementById('pdf-email');
    const pdfPhone = document.getElementById('pdf-phone');

    const previewEducation = document.getElementById('previewEducation');
    const previewExperience = document.getElementById('previewExperience')
    const previewSkills = document.getElementById('previewSkills');

    const pdfEducation = document.getElementById('pdfEducation');
    const pdfExperience = document.getElementById('pdfExperience');
    const pdfSkills = document.getElementById('pdfSkills');

    const exportPdfButton = document.getElementById('exportPdfButton');
    const pdfPreview = document.getElementById('pdfPreview');

    educationList = document.getElementById('education-list');
    addEducation = document.getElementById('addEducation');
    experienceList = document.getElementById('experience-list');
    addExperience = document.getElementById('addExperience');
    skillsList = document.getElementById('skills-list');
    addSkill = document.getElementById('addSkill');

    function syncHeader(){
        const name = nameInput.value.trim() || 'Your name';
        const email = emailInput.value.trim() || 'example@example.com';
        const phone = phoneInput.value.trim() || '123-456-7890';

        previewName.textContent = name;
        previewEmail.textContent = email;
        previewPhone.textContent = phone;

        pdfName.textContent = name;
        pdfEmail.textContent = email;
        pdfPhone.textContent = phone;
    } 

    nameInput.addEventListener('input', syncHeader);
    emailInput.addEventListener('input', syncHeader);
    phoneInput.addEventListener('input', syncHeader);

    refresh = () => {
        updatePreviewSections(
            {educations, experiences, skills},
            {previewEducation,
                previewExperience,
                previewSkills,
                pdfEducation,
                pdfExperience,
                pdfSkills
            }
        )
        saveState();
    }

    addEducation.addEventListener('click', ()=>{
        educations.push({school:'', degree:'', year:''});
        renderEducation();
        refresh();
    });

    addExperience.addEventListener('click', ()=>{
        experiences.push({role:'', company:'', location:'', start: '', end: '', bullets: ['']});
        renderExperience();
        refresh();
    });

    addSkill.addEventListener('click', ()=>{
        skills.push({skill:''});
        renderSkills();
        refresh();
    });

    exportPdfButton.addEventListener('click', async () => {
        syncHeader();
        refresh();

        const clone = pdfPreview.cloneNode(true);
        clone.id = 'pdfPreview-export-clone';

        Object.assign(clone.style, {
            position: 'fixed',
            left: '0',
            top: '0',
            width: '8.5in',
            height: '11in',
            padding: '24px',
            boxSizing: 'border-box',
            background: 'white',
            zIndex: '9999',
            opacity: '1',
            visibility: 'visible',
            overflow: 'hidden'
        });

        document.body.appendChild(clone);
        await new Promise(requestAnimationFrame);

        const canvas = await html2canvas(clone, {scale: 2, backgroundColor: 'white'})
        const imageData = canvas.toDataURL("image/jpeg", 0.98)

        const {jsPDF} = window.jspdf;
        const pdf = new jsPDF({
            unit: 'in',
            format: 'letter',
            orientation: 'portrait'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imageProps = pdf.getImageProperties(imageData);
        const imageWidth = pageWidth;
        const imageHeight = (imageProps.height*imageWidth)/imageProps.width;

        pdf.addImage(imageData, 'JPEG', 0, 0, imageWidth, Math.min(imageHeight, pageHeight));
        pdf.save('resume.pdf');

        clone.remove();
    });

    const clearButton = document.getElementById('clearResume');
    clearButton.addEventListener('click', handleClearResume);

    function handleClearResume(){
        educations = [];
        experiences = [];
        skills = [];
        nameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        localStorage.removeItem(STORAGEKEY);
        renderEducation();
        renderExperience();
        renderSkills();
        syncHeader();
        refresh();
    }

    syncHeader();

    loadState();
    renderEducation();
    renderExperience();
    renderSkills();
    refresh();
}

const STORAGEKEY = 'resumed';

function saveState(){
    const data = {educations, experiences, skills};
    localStorage.setItem(STORAGEKEY, JSON.stringify(data));
}

function loadState(){
    const raw = localStorage.getItem(STORAGEKEY);
    if (!raw) return;
    try{
        const data = JSON.parse(raw);
        educations = Array.isArray(data.educations) ? data.educations : [];
        experiences = Array.isArray(data.experiences) ? data.experiences : [];
        skills = Array.isArray(data.skills) ? data.skills : [];
    } catch(e){

    }
}

let educationList, addEducation, experienceList, addExperience, skillsList, addSkill;

let educations = [];
let experiences = [];
let skills = [];

function renderEducation(){
    educationList.innerHTML = '';
    educations.forEach((ed, idx)=>{
        const div = document.createElement('div');
        div.innerHTML =`
        <input placeholder="School" value="${ed.school||''}">
        <input placeholder="Degree" value="${ed.degree||''}">
        <input placeholder="Year" value="${ed.year||''}">
        <button type="button" class="sectionButton" data-index="${idx}" data-type="education-delete">Delete</button>
        `;
        const inputs = div.querySelectorAll('input');
        inputs[0].addEventListener('input', e => {
            educations[idx].school = e.target.value; refresh();
        });
        inputs[1].addEventListener('input', e=>{
            educations[idx].degree = e.target.value; refresh();
        });
        inputs[2].addEventListener('input', e=>{
            educations[idx].year = e.target.value; refresh();
        });
        div.querySelector('[data-type="education-delete"]').onclick = ()=>{
            educations.splice(idx, 1); renderEducation(); refresh();
        }
        educationList.appendChild(div);
    });
}



function updatePreviewSections(state, els){
    const {educations, experiences, skills} = state;
    const{
        previewEducation,
        previewExperience,
        previewSkills,
        pdfEducation,
        pdfExperience,
        pdfSkills
    } = els;
    if (educations.length>0){
        previewEducation.innerHTML =
            '<h3 class="preview-heading">Education</h3><ul>' +
            educations
                .filter(e => e.school || e.degree || e.year)
                .map(e => `
                <li>
                  <div style="font-weight:bold;">
                    ${e.school || ''}${e.year ? ` <span style='color:#917bdf;font-weight:400'>(${e.year})</span>` : ''}
                  </div>
                  <div style="color:#4d4c63;margin-left:3px;">
                    ${e.degree || ''}
                  </div>
                </li>
            `)
                .join('') +
            '</ul>'
    } else{
        previewEducation.innerHTML = '';
    }
    if (experiences.length>0){
        previewExperience.innerHTML =
            `<h3 class="preview-heading">Experiences</h3><ul>`+experiences
                .filter(e=>e.role||e.company|| e.location || e.start || e.end || (e.bullets || []).some(Boolean))       
                .map(e => {
                    const meta = [
                        e.company ? e.company : '',
                        e.location ? e.location: '',
                        (e.start || e.end) ? `${e.start || ''}${e.end ? ` - ${e.end}` : ''}` : ''
                    ].filter(Boolean).join(', ');

                    const bullets = (e.bullets || []).filter(Boolean);
                    return `
                        <li>
                            <div style="font-weight: bold;">
                                ${e.role || ''}${e.company ? `@ ${e.company}` : ''}
                            </div>
                            ${meta ? `<div style="color: #6e55b1; margin-left: 3px;">${meta}</div>`: ''}
                            <div style="color: #444e81; margin-left: 3px;">
                                ${(e.bullets || []).filter(Boolean).map(b=> `<div>${b}</div>`).join('')}
                            </div>
                        </li>
                    `
                }
            )
                .join('') + 
                '</ul>'
    } 
    if (skills.length>0){
        let sk = skills
        .filter(s=>s.skill)
        .map(s=>`
                <span class="skill">${s.skill}</span>
            `)
        .join('')
        previewSkills.innerHTML = '<h3 class="preview-heading">Skills</h3><div>'+sk+'</div>';
        
    }
    else{
        previewSkills.innerHTML = '';
    }

    
    pdfEducation.innerHTML = '';
    pdfExperience.innerHTML = '';
    pdfSkills.innerHTML = '';

if (educations.some(e=> e.school || e.degree || e.year)){
    pdfEducation.innerHTML = 
    `<div class="pdf-sectionTitle">Education</div>
    <ul class="pdf-list">
        ${educations
            .filter(e => e.school || e.degree || e.year)
            .map(e=> `<li class="pdf-item"><strong>${e.school || ''}</strong>${e.degree ? ` - ${e.degree}`:''}${e.year ? ` (${e.year})`: ''}</li>`)
            .join('')}
            </ul>`
}

if (experiences.some(e=>e.role || e.company || (e.bullets || []).some(Boolean))){
    pdfExperience.innerHTML = 
    `<div class="pdf-sectionTitle">Experience</div>
    <div>
        ${experiences
            .filter(e => e.role || e.company || (e.bullets || []).some(Boolean))
            .map(e =>{
                const meta = [
                    e.company ? e.company : '',
                    e.location ? e.location : '',
                    (e.start || e.end) ? `${e.start || ''}${e.end ? ` - ${e.end}`:''}`: ''
                ].filter(Boolean).join(', ');

                const bullets = (e.bullets || []).filter(Boolean);
                return `
                    <div class="pdf-item">
                        <div><strong>${e.role || ''}</strong>${meta ? `- ${meta}`:''}</div>
                        ${bullets.length ? `
                            <ul class="pdf-bullets">
                                ${bullets.map(b=> `<li>${b}</li>`).join('')}
                            </ul>
                            `: ''}
                    </div>
                `;
            })
            .join('')}
    </div>`
}

if (skills.some(s=>s.skill)){
    pdfSkills.innerHTML =
    `<div class="pdf-sectionTitle">Skills</div>
    <div>${skills.filter(s=>s.skill)
        .map(s=>s.skill)
        .join(', ')}</div>`
}
}





function renderExperience(){
    experienceList.innerHTML = '';
    experiences.forEach((ex, idx)=>{
        const div = document.createElement('div');
        div.innerHTML =`
            <input placeholder="Role" value="${ex.role||''}">
            <input placeholder="Company" value="${ex.company||''}">
            <input placeholder="Location" value="${ex.location||''}">
            <div style="display:flex; gap:10px;">
                <input placeholder="start" value="${ex.start||''}">
                <input placeholder="end" value="${ex.end||''}">
            </div>
            <div class="bullets" data-bullets="${idx}"></div>
            <button type="button" class="sectionButton" data-action="add-bullet">Add Point</button>
            <button type="button" class="sectionButton" data-index="${idx}" data-type="experience-delete">Delete</button>

        `
        const inputs = div.querySelectorAll('input');

        inputs[0].addEventListener('input', e=>{
            experiences[idx].role = e.target.value; refresh();
        });

        inputs[1].addEventListener('input', e=>{
            experiences[idx].company = e.target.value; refresh();
        });

        inputs[2].addEventListener('input', e=>{
            experiences[idx].location = e.target.value; refresh();
        });

        inputs[3].addEventListener('input', e=>{
            experiences[idx].start = e.target.value; refresh();
        });

        inputs[4].addEventListener('input', e=>{
            experiences[idx].end = e.target.value; refresh();
        });

        div.querySelector('[data-type="experience-delete"]').onclick =()=>{
            experiences.splice(idx, 1)
            renderExperience()
            refresh();
        }
        const bulletsContainer = div.querySelector('.bullets');
    const addBulletButton = div.querySelector('[data-action="add-bullet"]');

        function renderBullets(){
        bulletsContainer.innerHTML = '';
        (experiences[idx].bullets || []).forEach((bullet, bidx) =>{
            const row = document.createElement('div');
            row.innerHTML = `
                <input placeholder="Bullet" value="${bullet}">
                <button type="button" class="sectionButton">Delete</button>
            `;
            const bulletInput = row.querySelector('input');
            const del = row.querySelector('button');

            bulletInput.addEventListener('input', (e)=>{
                experiences[idx].bullets[bidx] = e.target.value;
                refresh();
            });
            del.addEventListener('click', ()=>{
                experiences[idx].bullets.splice(bidx, 1);
                renderBullets();
                refresh();
            });

            bulletsContainer.appendChild(row);

        }
    )};

    addBulletButton.addEventListener('click', ()=>{
        experiences[idx].bullets.push('');
        renderBullets();
        refresh();
    });

    renderBullets();
        experienceList.appendChild(div)
    });
}

function renderSkills(){
    skillsList.innerHTML = '';
    skills.forEach((sk, idx)=>{
        const div = document.createElement('div');
        div.innerHTML = `
            <input placeholder="Skill" value="${sk.skill|| ''}">
            <button type="button" class="sectionButton" data-index="${idx}" data-type="skill-delete">Delete</button>
        `
        div.querySelector('input').addEventListener('input', e=>{
            skills[idx].skill = e.target.value;
            refresh();
        });
        div.querySelector('[data-type="skill-delete"]').onclick = () =>{
            skills.splice(idx, 1)
            renderSkills()
            refresh();
        }
        skillsList.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', initApp);