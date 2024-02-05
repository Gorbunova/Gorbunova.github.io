import { initQuestionnaire, questionnaireStates } from "./main.js";

$(document).ready(function () {
    initQuestionnaire(questionnaireStates.ACCEPTED);
})