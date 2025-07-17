import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../stylesFolder/ExamRoom.css';

const ExamRoom = () => {
  const { examCode } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const timerRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState();

  // Mock exam data - in a real app, this would come from an API
  const examData = {
    exam1: {
      title: "JavaScript Fundamentals Exam",
      duration: 60, // minutes
      questions: [
        {
          id: 1,
          text: "What is the correct way to declare a variable in JavaScript?",
          type: "multiple_choice",
          options: [
            { id: 1, text: "var x = 5;" },
            { id: 2, text: "variable x = 5;" },
            { id: 3, text: "x := 5;" },
            { id: 4, text: "int x = 5;" }
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          text: "Which method adds new elements to the end of an array?",
          type: "multiple_choice",
          options: [
            { id: 1, text: "push()" },
            { id: 2, text: "pop()" },
            { id: 3, text: "shift()" },
            { id: 4, text: "unshift()" }
          ],
          correctAnswer: 1
        },
         {
          id: 3,
          text: "Which method adds new elements to the end of an array?",
          type: "multiple_choice",
          options: [
            { id: 1, text: "push()" },
            { id: 2, text: "pop()" },
            { id: 3, text: "shift()" },
            { id: 4, text: "unshift()" }
          ],
          correctAnswer: 1
        },
        {
          id: 4,
          text: "Explain the concept of closures in JavaScript.",
          type: "essay",
          maxLength: 500
        }
      ]
    }
  };
  // Load exam data when component mounts
  useEffect(() => {
    // In a real app, you would fetch exam data from an API using the examCode
    const exam = examData.exam1;
    // if (!exam) {
    //   alert("Invalid exam code. Redirecting to home page.");
    //   navigate('/');
    //   return;
    // }

    setExamDetails(exam);
    // setTimeLeft(exam.duration * 60); // Convert to seconds

    // Initialize timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on unmount
    return () => clearInterval(timerRef.current);
  }, [examCode, navigate]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examDetails.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    clearInterval(timerRef.current);
    setIsSubmitted(true);
    // In a real app, you would submit answers to a backend
    console.log("Submitted answers:", answers);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!examDetails) {
    return <div className="exam-loading">Loading exam...</div>;
  }

  if (!isSubmitted) {
    return (
      <div className="exam-submitted">
        <h2>Exam Submitted Successfully!</h2>
        <p>Thank you for completing the {examDetails.title}.</p>
        <p>Your results will be available soon.</p>
        <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
      </div>
    );
  }

  const currentQuestion = examDetails.questions[currentQuestionIndex];

  return (
    <div className="exam-room">
      <div className="exam-header">
        <h2>{examDetails.title}</h2>
        <div className="exam-timer">
          Time Remaining: <span className="time">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="exam-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{
              width: `${((currentQuestionIndex + 1) / examDetails.questions.length) * 100}%`
            }}
          ></div>
        </div>
        <div className="progress-text">
          Question {currentQuestionIndex + 1} of {examDetails.questions.length}
        </div>
      </div>

      <div className="exam-question">
        <div className="question-text">
          <h3>{currentQuestion.text}</h3>
        </div>

        {currentQuestion.type === 'multiple_choice' ? (
          <div className="multiple-choice-options">
            {currentQuestion.options.map(option => (
              <div key={option.id} className="option">
                <input
                  type="radio"
                  id={`option-${currentQuestion.id}-${option.id}`}
                  name={`question-${currentQuestion.id}`}
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
                />
                <label htmlFor={`option-${currentQuestion.id}-${option.id}`}>
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="essay-answer">
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              maxLength={currentQuestion.maxLength}
            />
            <div className="char-count">
              {answers[currentQuestion.id]?.length || 0}/{currentQuestion.maxLength} characters
            </div>
          </div>
        )}
      </div>

      <div className="exam-navigation">
        <button 
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        
        {currentQuestionIndex < examDetails.questions.length - 1 ? (
          <button onClick={handleNextQuestion}>Next</button>
        ) : (
          <button 
            className="submit-exam"
            onClick={handleSubmitExam}
          >
            Submit Exam
          </button>
        )}
      </div>

      <div className="question-list">
        {examDetails.questions.map((question, index) => (
          <button
            key={question.id}
            className={`question-nav-btn ${currentQuestionIndex === index ? 'active' : ''} ${answers[question.id] ? 'answered' : ''}`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamRoom;