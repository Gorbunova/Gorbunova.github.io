import { initQuestionnaire, questionnaireStates } from "./main.js";

$(document).ready(function () {
    const state = localStorage.getItem('questionnaire_state') === questionnaireStates.FILLING
        ? questionnaireStates.FILLING : localStorage.getItem('questionnaire_state') === questionnaireStates.CONSIDERATION
        ? questionnaireStates.CONSIDERATION : null;
    initQuestionnaire(state);
})