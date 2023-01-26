"use strict"

// MOBILE MENU
document.addEventListener("click", documentActions);

function documentActions(e) {
   const targetElement = e.target;
   
   if (targetElement.closest('.icon-menu')) {
      document.documentElement.classList.toggle('menu-open');
   }

   if (targetElement.closest('[data-goto]')) {
      document.documentElement.classList.contains('menu-open') ? 
         document.documentElement.classList.remove('menu-open') : null;
      const goTo = targetElement.closest('[data-goto]').dataset.goto;
      const goToElement = document.querySelector(goTo);
      const headerHeight = document.querySelector('.header').offsetHeight;

      if (goToElement) {
         window.scrollTo ({
            top: goToElement.offsetTop - (headerHeight + 15),
            behavior: "smooth"
         });
      }
      e.preventDefault();
   }
}
// ---------------------------------------------------------------------

// POP-UP
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
   for (let index = 0; index < popupLinks.length; index++) {
      const popupLink = popupLinks[index];
      popupLink.addEventListener('click', function (e) {
         const popupName = popupLink.getAttribute('href').replace('#', '');
         const curentPopup = document.getElementById(popupName);
         popupOpen(curentPopup);
         e.preventDefault();
      });
   }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
   for (let index = 0; index < popupCloseIcon.length; index++) {
      const el = popupCloseIcon[index];
      el.addEventListener('click', function(e) {
         popupClose(el.closest('.popup'));
         e.preventDefault();
      });
   }
}

function popupOpen(curentPopup) {
   if (curentPopup && unlock) {
      const popupActive = document.querySelector('.popup.open');
      if(popupActive) {
         popupClose(popupActive, false);
      } else {
         bodyLock();
      }
      curentPopup.classList.add('open');
      curentPopup.addEventListener('click', function(e) {
         if (!e.target.closest('.popup__content')) {
            popupClose(e.target.closest('.popup'));
         }
      });
   }
}

function popupClose(popupActive, doUnlock = true) {
   if (unlock) {
      popupActive.classList.remove('open');
      if (doUnlock) {
         bodyUnLock();
      }
   }
}

function bodyLock() {
   const lockPaddingValue = window.innerWidth - document.querySelector('.container').offsetWidth + 'px';

   if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
         const el = lockPadding[index];
         el.style.paddingRight = lockPaddingValue;
      }
   }
   body.style.paddingRight = lockPaddingValue;
   body.classList.add('lock');

   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

function bodyUnLock() {
   setTimeout(function () {
      if (lockPadding.length > 0) {
         for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = '0px';
         }
      }
      body.style.paddingRight = '0px';
      body.classList.remove('lock');
   }, timeout);

   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

// Закрытие по ESC
document.addEventListener('keydown', function (e) {
   if (e.which === 27) {
      const popupActive = document.querySelector('.popup.open');
      popupClose(popupActive);
   }
});
// --------------------------------------------------------------------------

// Tabs
// document.addEventListener("click", function (e) {
//    const tabsPreview = document.querySelectorAll('tabs__item');

//    if (tabsPreview ) {
      
//       tabsPreview.classList.add('t-open');
//    }
// });

// Form 
document.addEventListener('DOMContentLoaded', function () {
   const form = document.getElementById('form');
   form.addEventListener('submit', formSend);

   // Инициализация отправки
   async function formSend(e) {
      e.preventDefault();

      let error = formValidate(form);

      let formData = new formData(form);
      formData.append('image', formImage.file[0]);

      if (error === 0) {
         form.classList.add('_sending');
         let response = await fetch('sendmail.php', {
            method: 'POST',
            body: formData
         });
         if (response.ok) {
            let result = await response.json();
            alert(result.message);
            formPreview.innerHTML = '';
            form.reset();
            form.classList.remove('_sending');
         } else {
            alert('Error!');
            form.classList.remove('_sending');
         }
      } else {
         alert('Заполните обязательные поля!')
      }
   }

   // Функция валидации
   function formValidate(form) {
      let error = 0;
      let formReq = document.querySelectorAll('._req');

      for (let index = 0; index < formReq.length; index++) {
         const input = formReq[index];
         formRemoveError(input);

         if (input.classList.contains('_email')) {
            if (emailTest(input)) {
               formAddError(input);
               error++;
            }
         }else if(input.getAttribute('type') === 'checkbox' && input.checked === false) {
            formAddError(input);
            error++;
         } else {
            if (input.value === '') {
               formAddError(input);
               error++;
            }
         }
      }
      return error;
   }

   function formAddError(input) {
      input.parentElement.classList.add('_error');
      input.classList.add('_error');
   }
   function formRemoveError(input) {
      input.parentElement.classList.remove('_error');
      input.classList.remove('_error');
   }
   // Функция теста емаил
   function emailTest (input) {
      return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
   }

   const formImage = document.getElementById('formImage');
   const formPreview = document.getElementById('formPreview');

   formImage.addEventListener('change', () => {
      uploadFile(formImage.files[0]);
   });

   function uploadFile (file) {
      // Проверяем тип файла
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
         alert('Разрешены только изображения.');
         formImage.value = '';
         return;
      }
      // Проверяем размер файла
      if (file.size > 2 * 1024 * 1024) {
         alert('Файл должен быть менее 2 МБ.');
         return;
      }

      // Добавление превью картинки
      var reader = new FileReader();
      reader.onload = function (e) {
         formPreview.innerHTML = `<img src="${e.target.result}" alt="img">`;
      };
      reader.onerror = function (e) {
         alert('Ошибка');
      };
      reader.readAsDataURL(file);
   }
});
// --------------------------------------------------------------------