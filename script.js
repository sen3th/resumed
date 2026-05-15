document.addEventListener('DOMContentLoaded', function(){
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput =document.getElementById('phone');
    const previewName = document.getElementById('previewName');
    const previewEmail = document.getElementById('previewEmail');
    const previewPhone = document.getElementById('previewPhone');
    const previewEducation = document.getElementById('previewEducation');
    const previewExperience = document.getElementById('previewExperience');
    const previewSkills = document.getElementById('previewSkills');

    nameInput.addEventListener( 'input', ()=>{
        previewName.textContent = nameInput.value || 'Your name';
    })
    emailInput.addEventListener('input', ()=>{
        previewEmail.textContent = emailInput.value || 'hi@seneth.me';
    })
    phoneInput.addEventListener('input',()=>{
        previewPhone.textContent = phoneInput.value || '123-456-7890';
    })
})

const educationList = document.getElementById('education-list');
const addEducation = document.getElementById('addEducation');
const experienceList = document.getElementById('experience-list');
const addExperience = document.getElementById('addExperience');
const skillsList = document.getElementById('skills-list');
const addSkill = document.getElementById('addSkill');

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
        <button type="button" class="sectionButton" data-index="${idx}" data-type="education-delete">Delete<button>
        `;
        const inputs = div.querySelectorAll('input');
        inputs[0].addEventListener('input', e => {
            educations[idx].school = e.target.value; updatePreviewSelections();
        })
        inputs[1].addEventListener('input', e=>{
            educations[idx].degree = e.target.value; updatePreviewSelections();
        })
        inputs[2].addEventListener('input', e=>{
            educations[idx].year = e.target.value; updatePreviewSelections();
        })
        div.querySelector('[data-type="education-delete"]').onclick = ()=>{
            educations.splice(idx, 1); renderEducation(); updatePreviewSections();
        }
        educationList.appendChild(div);
    })
}

addEducation.onclick = ()=>{
    educations.push({
        school:'',
        degree:'',
        year:''
    })
    renderEducation();
    updatePreviewSections();
}

function updatePreviewSections(){
    if (educations.length>0){
        previewEducation.innerHTML =
            '<h3 class="preview-heading">Education</h3><ul>' +
            educations
                .filter(e => e.school || e.degree || e.year)
                .map(
                    e =>
                    `<li style="margin-bottom: 10px;"><strong>${e.school || ''}</strong>`+
                    (e.degree ? "|" + e.degree : '') +
                    (e.year ? "("+e.year+")": '')+
                    `</li>`
                )
                .join('') +
            '</ul>'
    } else{
        previewEducation.innerHTML = '';
    }
    if (experiences.length>0){
        previewExperience.innerHTML =
            `<h3 class="preview-heading">Experiences</h3><ul>`+experiences
                .filter(e=>e.role||e.company|| e.description)
                .map(e=> `<li><strong>${e.role || ''}</strong> @ ${e.company || ''}<br><span>${e.description||''}<span></li>`)
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