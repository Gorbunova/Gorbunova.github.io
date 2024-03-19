import ConsultationBtn from "./consultation-btn.js";
import ConsultationFields from "./consultation-fields.js";

export const initConsultation = (isModal = false) => {
    const btns = document.querySelectorAll('.consultation__btn');

    btns.forEach(btn => {
        if (isModal && btn.parentElement.getAttribute('id') !== 'modal-form') return;
        new ConsultationBtn(btn);
        new ConsultationFields(btn);
    });
}
