import { useState, useEffect } from 'react';
import { subscribeEmail } from '../api';
import './SubscribeModal.css';

const SubscribeModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('IDLE'); // IDLE, CAPTCHA, LOADING, SUCCESS, ERROR
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Captcha state
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  useEffect(() => {
    if (isOpen && step === 'IDLE') {
      setStep('IDLE');
      setEmail('');
      setErrorMsg('');
      setCaptchaAnswer('');
    }
  }, [isOpen]);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubscribeClick = () => {
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setStep('CAPTCHA');
  };

  const handleCaptchaSubmit = async () => {
    if (parseInt(captchaAnswer) !== num1 + num2) {
      setErrorMsg('Incorrect answer. Please try again.');
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setCaptchaAnswer('');
      return;
    }

    setStep('LOADING');
    setErrorMsg('');
    try {
      await subscribeEmail(email);
      setStep('SUCCESS');
    } catch (err) {
      setStep('ERROR');
      setErrorMsg(err.message || 'Something went wrong.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        {step === 'IDLE' && (
          <div className="modal-body fade-in">
            <h2>Join the Newsletter</h2>
            <p>Get the latest updates directly in your inbox.</p>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="modal-input"
            />
            {errorMsg && <p className="modal-error">{errorMsg}</p>}
            <button className="modal-btn" onClick={handleSubscribeClick}>Subscribe</button>
          </div>
        )}

        {step === 'CAPTCHA' && (
          <div className="modal-body fade-in">
            <h2>Human Verification</h2>
            <p>To prevent spam, please solve this simple math problem:</p>
            <p className="captcha-question">What is {num1} + {num2}?</p>
            <input 
              type="number" 
              placeholder="Your answer" 
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              className="modal-input"
            />
            {errorMsg && <p className="modal-error">{errorMsg}</p>}
            <button className="modal-btn" onClick={handleCaptchaSubmit}>Verify</button>
          </div>
        )}

        {step === 'LOADING' && (
          <div className="modal-body fade-in">
            <h2>Subscribing...</h2>
            <div className="loader"></div>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="modal-body fade-in">
            <h2>Success! 🎉</h2>
            <p>You have been successfully subscribed to the newsletter.</p>
            <button className="modal-btn" onClick={onClose}>Close</button>
          </div>
        )}

        {step === 'ERROR' && (
          <div className="modal-body fade-in">
            <h2>Subscription Failed</h2>
            <p className="modal-error">{errorMsg}</p>
            <button className="modal-btn" onClick={() => setStep('IDLE')}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribeModal;
