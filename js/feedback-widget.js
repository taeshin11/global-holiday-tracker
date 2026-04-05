// feedback-widget.js - Floating feedback widget
(function () {
  const PROJECT_NAME = 'Global Holiday Tracker';
  const FEEDBACK_EMAIL = 'taeshinkim11@gmail.com';

  const feedbackTranslations = {
    EN: { title: 'Send Feedback', placeholder: 'Your message...', submit: 'Send', close: 'Close', tooltip: 'Feedback' },
    KO: { title: '피드백 보내기', placeholder: '메시지를 입력하세요...', submit: '보내기', close: '닫기', tooltip: '피드백' },
    JA: { title: 'フィードバックを送る', placeholder: 'メッセージを入力...', submit: '送信', close: '閉じる', tooltip: 'フィードバック' },
    ZH: { title: '发送反馈', placeholder: '请输入您的留言...', submit: '发送', close: '关闭', tooltip: '反馈' },
    ES: { title: 'Enviar Comentarios', placeholder: 'Tu mensaje...', submit: 'Enviar', close: 'Cerrar', tooltip: 'Comentarios' },
    DE: { title: 'Feedback Senden', placeholder: 'Ihre Nachricht...', submit: 'Senden', close: 'Schließen', tooltip: 'Feedback' },
    FR: { title: 'Envoyer un Commentaire', placeholder: 'Votre message...', submit: 'Envoyer', close: 'Fermer', tooltip: 'Commentaires' },
    PT: { title: 'Enviar Feedback', placeholder: 'Sua mensagem...', submit: 'Enviar', close: 'Fechar', tooltip: 'Feedback' }
  };

  function getLang() {
    if (typeof I18N !== 'undefined' && I18N.currentLang) return I18N.currentLang;
    return 'EN';
  }

  function tr(key) {
    const lang = getLang();
    return (feedbackTranslations[lang] && feedbackTranslations[lang][key]) ||
           (feedbackTranslations['EN'][key]) || key;
  }

  function createWidget() {
    const style = document.createElement('style');
    style.textContent = `
      #fw-btn {
        position: fixed; bottom: 24px; right: 24px; z-index: 9999;
        width: 50px; height: 50px; border-radius: 50%;
        background: #7C3AED; color: #fff; border: none; cursor: pointer;
        box-shadow: 0 4px 12px rgba(124,58,237,0.4);
        font-size: 22px; display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      #fw-btn:hover { transform: scale(1.1); box-shadow: 0 6px 16px rgba(124,58,237,0.5); }
      #fw-overlay {
        display: none; position: fixed; inset: 0; z-index: 9998;
        background: rgba(0,0,0,0.35); align-items: flex-end; justify-content: flex-end;
        padding: 80px 24px;
      }
      #fw-overlay.open { display: flex; }
      #fw-modal {
        background: #fff; border-radius: 16px; padding: 20px;
        width: 300px; box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        position: relative; animation: fw-slide-in 0.2s ease-out;
      }
      @keyframes fw-slide-in { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      #fw-modal h3 { margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #1c1c1c; padding-right: 24px; }
      #fw-textarea {
        width: 100%; box-sizing: border-box; border: 1px solid #e2e8f0; border-radius: 8px;
        padding: 10px; font-size: 13px; resize: vertical; min-height: 90px; outline: none;
        font-family: inherit; color: #1c1c1c;
      }
      #fw-textarea:focus { border-color: #7C3AED; box-shadow: 0 0 0 2px rgba(124,58,237,0.2); }
      #fw-submit {
        margin-top: 10px; width: 100%; padding: 10px; border: none; border-radius: 8px;
        background: #7C3AED; color: #fff; font-size: 14px; font-weight: 600;
        cursor: pointer; transition: background 0.2s;
      }
      #fw-submit:hover { background: #6D28D9; }
      #fw-close {
        position: absolute; top: 12px; right: 12px; background: none; border: none;
        font-size: 18px; cursor: pointer; color: #6b7280; line-height: 1;
        padding: 2px 6px; border-radius: 4px;
      }
      #fw-close:hover { background: #f3f4f6; }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'fw-btn';
    btn.title = tr('tooltip');
    btn.innerHTML = '&#x1F4AC;';
    document.body.appendChild(btn);

    const overlay = document.createElement('div');
    overlay.id = 'fw-overlay';
    overlay.innerHTML = `
      <div id="fw-modal" role="dialog" aria-modal="true" aria-labelledby="fw-title">
        <button id="fw-close" aria-label="${tr('close')}">&#x2715;</button>
        <h3 id="fw-title">${tr('title')}</h3>
        <textarea id="fw-textarea" placeholder="${tr('placeholder')}" rows="4"></textarea>
        <button id="fw-submit">${tr('submit')}</button>
      </div>
    `;
    document.body.appendChild(overlay);

    btn.addEventListener('click', () => overlay.classList.toggle('open'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
    document.getElementById('fw-close').addEventListener('click', () => overlay.classList.remove('open'));

    document.getElementById('fw-submit').addEventListener('click', () => {
      const msg = document.getElementById('fw-textarea').value.trim();
      const subject = encodeURIComponent(`[${PROJECT_NAME}] Feedback`);
      const body = encodeURIComponent(msg || '(no message)');
      window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
      overlay.classList.remove('open');
    });

    // Update widget text when language changes
    document.addEventListener('languageChanged', () => {
      btn.title = tr('tooltip');
      const titleEl = document.getElementById('fw-title');
      const textareaEl = document.getElementById('fw-textarea');
      const submitEl = document.getElementById('fw-submit');
      const closeEl = document.getElementById('fw-close');
      if (titleEl) titleEl.textContent = tr('title');
      if (textareaEl) textareaEl.placeholder = tr('placeholder');
      if (submitEl) submitEl.textContent = tr('submit');
      if (closeEl) closeEl.setAttribute('aria-label', tr('close'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
