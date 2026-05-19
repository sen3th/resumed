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

    function syncHeader(){
        const name = nameInput.value.trim() || 'Your name';
        const email = emailInput.value.trim() || 'hi@seneth.me';
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

    syncHeader();
    
}

document.addEventListener('DOMContentLoaded', initApp);

let previewEducation, previewExperience, previewSkills;
let pdfPreview, pdfEducation, pdfExperience, pdfSkills;
let pdfName, pdfEmail, pdfPhone;

document.addEventListener('DOMContentLoaded', function(){
    previewEducation = document.getElementById('previewEducation');
    previewExperience = document.getElementById('previewExperience');
    previewSkills = document.getElementById('previewSkills');

    pdfPreview = document.getElementById('pdfPreview');
    pdfEducation = document.getElementById('pdfEducation');
    pdfExperience = document.getElementById('pdfExperience');
    pdfSkills = document.getElementById('pdfSkills');

    pdfName = document.getElementById('pdfName');
    pdfEmail = document.getElementById('pdf-email');
    pdfPhone = document.getElementById('pdf-phone');

    educationList = document.getElementById('education-list');
    addEducation = document.getElementById('addEducation');
    experienceList = document.getElementById('experience-list');
    addExperience = document.getElementById('addExperience');
    skillsList = document.getElementById('skills-list');
    addSkill = document.getElementById('addSkill');

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput =document.getElementById('phone');
    const previewName = document.getElementById('previewName');
    const previewEmail = document.getElementById('previewEmail');
    const previewPhone = document.getElementById('previewPhone');
    const exportPdfButton = document.getElementById('exportPdfButton');
    const resumePreview = document.getElementById('resumePreview');

    pdfName.textContent = nameInput.value || 'Your name';
    pdfEmail.textContent = emailInput.value || 'hi@seneth.me';
    pdfPhone.textContent = phoneInput.value || '123-456-7890';

    exportPdfButton.addEventListener('click', ()=>{
        updatePreviewSections();
        const opt = {
            margin: [0.4, 0.4, 0.4, 0.4],
            filename: 'resume.pdf',
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {scale: 2, useCORS: true},
            jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        }
        html2pdf().set(opt).from(pdfPreview).save()
    }) 

    nameInput.addEventListener( 'input', ()=>{
        previewName.textContent = nameInput.value || 'Your name';
        pdfName.textContent = nameInput.value || 'Your name';
    })
    emailInput.addEventListener('input', ()=>{
        previewEmail.textContent = emailInput.value || 'hi@seneth.me';
        pdfEmail.textContent = emailInput.value || 'hi@seneth.me';
    })
    phoneInput.addEventListener('input',()=>{
        previewPhone.textContent = phoneInput.value || '123-456-7890';
        pdfPhone.textContent = phoneInput.value || '123-456-7890';
    })

addEducation.onclick = ()=>{
    educations.push({
        school:'',
        degree:'',
        year:''
    })
    renderEducation();
    updatePreviewSections();
}

addExperience.onclick = ()=>{
    experiences.push({
        role: '',
        company: '',
        description: ''
    })
    renderExperience();
    updatePreviewSections()
}

addSkill.onclick =()=>{
    skills.push({skill:''})
    renderSkills()
    updatePreviewSections()
}

    renderEducation();
    renderExperience();
    renderSkills();
    updatePreviewSections()
})

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
            educations[idx].school = e.target.value; updatePreviewSections();
        })
        inputs[1].addEventListener('input', e=>{
            educations[idx].degree = e.target.value; updatePreviewSections();
        })
        inputs[2].addEventListener('input', e=>{
            educations[idx].year = e.target.value; updatePreviewSections();
        })
        div.querySelector('[data-type="education-delete"]').onclick = ()=>{
            educations.splice(idx, 1); renderEducation(); updatePreviewSections();
        }
        educationList.appendChild(div);
    })
}



function updatePreviewSections(){
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
                .filter(e=>e.role||e.company|| e.description)
                .map(e => `
                <li>
                  <div style="font-weight:bold;">
                    ${e.role || ''}${(e.company ? ` <span style="font-weight:normal; color:#bba5fe;">@ ${e.company}</span>` : '')}
                  </div>
                  <div style="color:#444e81; margin-left: 3px;">
                    ${e.description || ''}
                  </div>
                </li>
            `)
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

if (experiences.some(e=>e.role || e.company || e.description)){
    pdfExperience.innerHTML = 
    `<div class="pdf-sectionTitle">Experience</div>
    <ul class="pdf-list">
        ${experiences
            .filter(e => e.role || e.company || e.description)
            .map(e=> `<li class="pdf-item"><strong>${e.role || ''}</strong>${e.company ? ` - ${e.company}`: ''}${e.description ? `: ${e.description}`: ''}</li>`)
            .join('')}
    </ul>`
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
            <textarea placeholder="description" rows="2">${ex.description||''}</textarea>
            <button type="button" class="sectionButton" data-index="${idx}" data-type="experience-delete">Delete</button>

        `
        const inputs = div.querySelectorAll('input, textarea');

        inputs[0].addEventListener('input', e=>{
            experiences[idx].role = e.target.value; updatePreviewSections();
        })
        inputs[1].addEventListener('input', e=>{
            experiences[idx].company = e.target.value; updatePreviewSections()
        })
        inputs[2].addEventListener('input', e=>{
            experiences[idx].description = e.target.value; updatePreviewSections();
        })
        div.querySelector('[data-type="experience-delete"]').onclick =()=>{
            experiences.splice(idx, 1)
            renderExperience()
            updatePreviewSections();
        }
        experienceList.appendChild(div)
    })
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
            updatePreviewSections()
        })
        div.querySelector('[data-type="skill-delete"]').onclick = () =>{
            skills.splice(idx, 1)
            renderSkills()
            updatePreviewSections();
        }
        skillsList.appendChild(div);
    })
}