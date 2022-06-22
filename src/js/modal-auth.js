import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import authMarkup from '../templates/auth.hbs';
// import { onEscPress } from './film-modal';
import { regUser, loginUser } from './firebase/firebase-cnfg';

const authorizationBtn = document.querySelector('.btn-author-modal-open');

authorizationBtn.addEventListener('click', onBtnModalFormClick);

function onBtnModalFormClick(event) {
  event.preventDefault();
  instance.show();
}

const instance = basicLightbox.create(authMarkup(), {
  onShow: instance => {
    window.addEventListener('keydown', onEscPress);
    document.body.classList.toggle('no-scroll');
    instance.element().querySelector('#modal-auth-close').onclick = instance.close;

    const regForm = instance.element().querySelector('#regForm');
    const loginForm = instance.element().querySelector('#loginForm');

    addEventListenerForRegForm(regForm);
    addEventListenerForLoginForm(loginForm);
  },
  onClose: instance => {
    document.body.classList.toggle('no-scroll');
    window.removeEventListener('keydown', onEscPress);
  },
});

function addEventListenerForRegForm(form) {
  form.addEventListener('submit', regUserWithEmailPass);
}

function addEventListenerForLoginForm(form) {
  form.addEventListener('submit', loginUserWithEmailPass);
}

function regUserWithEmailPass(e) {
  e.preventDefault();

  const {
    elements: { email, pswd },
  } = e.currentTarget;

  const regMail = email.value;
  const regPass = pswd.value;

  regUser(regMail, regPass);
}

function loginUserWithEmailPass(e) {
  e.preventDefault();

  const {
    elements: { email, pswd },
  } = e.currentTarget;

  const loginMail = email.value;
  const loginPass = pswd.value;

  loginUser(loginMail, loginPass);
}

function onEscPress(event) {
  const ESC_KEY = 'Escape';
  if (event.code === ESC_KEY) {
    instance.close();
  }
}