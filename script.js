document.addEventListener('DOMContentLoaded', function(){
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput =document.getElementById('phone');
    const previewName = document.getElementById('previewName');
    const previewEmail = document.getElementById('previewEmail');
    const previewPhone = document.getElementById('previewPhone');
    
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