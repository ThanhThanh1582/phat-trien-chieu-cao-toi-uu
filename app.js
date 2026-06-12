document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // STATE & VARIABLES
  // ==========================================================================
  let currentSlideIndex = 0; // 0-indexed (0 to 19)
  const slides = document.querySelectorAll('.slide-panel');
  const totalSlides = slides.length;
  
  const prevBtn = document.getElementById('prev-slide-btn');
  const nextBtn = document.getElementById('next-slide-btn');
  const slideIndexDisplay = document.getElementById('slide-index-display');
  const slideStageDisplay = document.getElementById('slide-stage-display');
  const progressDotsContainer = document.getElementById('progress-dots-container');
  const toggleFullscreenBtn = document.getElementById('toggle-fullscreen-btn');
  const toggleThemeBtn = document.getElementById('toggle-theme-btn');
  const startBtn = document.getElementById('start-btn');
  const restartBtn = document.getElementById('restart-btn');

  // ==========================================================================
  // SLIDE NAV ENGINE
  // ==========================================================================
  
  // Create progress dots dynamically (20 dots)
  function initProgressDots() {
    progressDotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('progress-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('title', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
      });
      progressDotsContainer.appendChild(dot);
    }
  }

  // Navigate to specific slide
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    // Deactivate current slide
    slides[currentSlideIndex].classList.remove('active');
    
    // Pause any active timers when switching slides
    pauseAllTimers();
    
    // Update index
    currentSlideIndex = index;
    
    // Activate new slide
    slides[currentSlideIndex].classList.add('active');
    
    // Update UI elements
    updateSlideControlsUI();
  }

  // Update dots and buttons state
  function updateSlideControlsUI() {
    // Disable prev/next if out of bounds
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === totalSlides - 1;
    
    // Update progress dots
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
      if (idx === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Update counter text
    slideIndexDisplay.textContent = `Slide ${currentSlideIndex + 1} / ${totalSlides}`;
    
    // Update stage name in control bar
    const stageName = slides[currentSlideIndex].getAttribute('data-stage') || 'Bài học';
    slideStageDisplay.textContent = stageName;
    
    // Update stage name in header
    const currentStageDisplay = document.getElementById('current-stage-display');
    if (currentSlideIndex === 0) {
      currentStageDisplay.textContent = "TIẾT 1: BÁC SĨ KHÁM BỆNH";
    } else if (currentSlideIndex === totalSlides - 1) {
      currentStageDisplay.textContent = "HOÀN THÀNH CA LÂM SÀNG";
    } else {
      currentStageDisplay.textContent = `BÁC SĨ TẬP SỰ: ${stageName.toUpperCase()}`;
    }
  }

  // Keyboard navigation bindings
  document.addEventListener('keydown', (e) => {
    // Ignore key presses if typing in inputs or textareas
    if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
      return;
    }
    
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      goToSlide(currentSlideIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      goToSlide(currentSlideIndex - 1);
    } else if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }
  });

  // Action buttons events
  prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));
  startBtn.addEventListener('click', () => goToSlide(1));
  restartBtn.addEventListener('click', () => {
    if (confirm("Bạn có chắc chắn muốn làm mới toàn bộ bài học từ đầu?")) {
      resetLectureData();
      goToSlide(0);
    }
  });

  // Reset lecture state
  function resetLectureData() {
    // Clear storage keys
    localStorage.removeItem('reflection-v-q1');
    localStorage.removeItem('reflection-v-q2');
    localStorage.removeItem('reflection-v-q3');
    localStorage.removeItem('sig-name');
    localStorage.removeItem('report-patient');
    localStorage.removeItem('report-habit');
    localStorage.removeItem('report-pillar');
    localStorage.removeItem('report-diag');
    
    // Reset inputs slide 10
    document.getElementById('report-patient-select').selectedIndex = 0;
    document.getElementById('report-bad-habit').value = '';
    document.getElementById('report-pillar-select').selectedIndex = 0;
    document.getElementById('report-diagnosis').value = '';
    
    // Reset slide 19 virtual notebook
    document.getElementById('v-ref-q1').value = '';
    document.getElementById('v-ref-q2').value = '';
    document.getElementById('v-ref-q3').value = '';
    document.getElementById('v-commit-sleep').checked = false;
    document.getElementById('v-commit-milk').checked = false;
    document.getElementById('v-commit-ex').checked = false;
    document.getElementById('v-sig-display').textContent = "Bác Sĩ Tập Sự";
    
    // Reset Slide 20 Cert Inputs
    const certInput = document.getElementById('cert-student-name');
    const certPreviewName = document.getElementById('cert-preview-name');
    const certPrintName = document.getElementById('cert-print-name');
    if (certInput) certInput.value = '';
    if (certPreviewName) certPreviewName.textContent = "[ Họ và tên học sinh ]";
    if (certPrintName) certPrintName.textContent = "[ Họ và tên học sinh ]";
    
    updateVirtualCommitmentProgress();
    resetMatchingGame();
    resetAllTimers();
    
    // Reset flip cards
    const flippedCards = document.querySelectorAll('.flip-card.flipped');
    flippedCards.forEach(c => c.classList.remove('flipped'));
  }

  // ==========================================================================
  // COUNTDOWN TIMERS CONTROLLERS
  // ==========================================================================
  const timerStates = {
    'timer-hd1': { duration: 8 * 60, current: 8 * 60, interval: null, default: 8 * 60 },
    'timer-hd2': { duration: 15 * 60, current: 15 * 60, interval: null, default: 15 * 60 },
    'timer-hd3': { duration: 12 * 60, current: 12 * 60, interval: null, default: 12 * 60 },
    'timer-hd4': { duration: 8 * 60, current: 8 * 60, interval: null, default: 8 * 60 }
  };

  function setupTimers() {
    Object.keys(timerStates).forEach(id => {
      const widget = document.getElementById(id);
      if (!widget) return;
      
      const playBtn = widget.querySelector('.play-btn');
      const pauseBtn = widget.querySelector('.pause-btn');
      const resetBtn = widget.querySelector('.reset-btn');
      
      playBtn.addEventListener('click', () => startTimer(id));
      pauseBtn.addEventListener('click', () => pauseTimer(id));
      resetBtn.addEventListener('click', () => resetTimer(id));
      
      // Update display initially
      updateTimerDisplay(id);
    });
  }

  function startTimer(id) {
    const state = timerStates[id];
    const widget = document.getElementById(id);
    if (!state || state.interval) return;
    
    widget.classList.add('running');
    widget.classList.remove('expired');
    widget.querySelector('.play-btn').classList.add('hidden');
    widget.querySelector('.pause-btn').classList.remove('hidden');
    
    state.interval = setInterval(() => {
      if (state.current > 0) {
        state.current--;
        updateTimerDisplay(id);
      } else {
        clearInterval(state.interval);
        state.interval = null;
        widget.classList.remove('running');
        widget.classList.add('expired');
        widget.querySelector('.pause-btn').classList.add('hidden');
        widget.querySelector('.play-btn').classList.remove('hidden');
        playBeepSound();
      }
    }, 1000);
  }

  function pauseTimer(id) {
    const state = timerStates[id];
    const widget = document.getElementById(id);
    if (!state || !state.interval) return;
    
    clearInterval(state.interval);
    state.interval = null;
    widget.classList.remove('running');
    widget.querySelector('.pause-btn').classList.add('hidden');
    widget.querySelector('.play-btn').classList.remove('hidden');
  }

  function resetTimer(id) {
    const state = timerStates[id];
    const widget = document.getElementById(id);
    if (!state) return;
    
    clearInterval(state.interval);
    state.interval = null;
    state.current = state.default;
    
    widget.classList.remove('running', 'expired');
    widget.querySelector('.pause-btn').classList.add('hidden');
    widget.querySelector('.play-btn').classList.remove('hidden');
    updateTimerDisplay(id);
  }

  function updateTimerDisplay(id) {
    const state = timerStates[id];
    const widget = document.getElementById(id);
    if (!state || !widget) return;
    
    const minutes = Math.floor(state.current / 60);
    const seconds = state.current % 60;
    
    const displayStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    widget.querySelector('.timer-display').textContent = displayStr;
  }

  function pauseAllTimers() {
    Object.keys(timerStates).forEach(id => {
      pauseTimer(id);
    });
  }

  function resetAllTimers() {
    Object.keys(timerStates).forEach(id => {
      resetTimer(id);
    });
  }

  // Visual/Audio beep effect when time is up
  function playBeepSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.value = 587.33; // D5 Note
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (err) {
      console.warn("Audio Context beep not supported by browser security policy without interaction.");
    }
  }

  // ==========================================================================
  // SLIDE 4: INTERACTIVE MATCHING GAME
  // ==========================================================================
  let selectedProfile = null;
  const profileItems = document.querySelectorAll('#profiles-column .match-item');
  const targetItems = document.querySelectorAll('#targets-column .match-target');
  
  profileItems.forEach(profile => {
    profile.addEventListener('click', () => {
      if (profile.classList.contains('connected')) return;
      
      if (selectedProfile === profile) {
        selectedProfile.classList.remove('selected');
        selectedProfile = null;
      } else {
        if (selectedProfile) selectedProfile.classList.remove('selected');
        selectedProfile = profile;
        selectedProfile.classList.add('selected');
      }
    });
  });

  targetItems.forEach(target => {
    target.addEventListener('click', () => {
      if (target.classList.contains('matched') || !selectedProfile) return;
      
      const selectedId = selectedProfile.getAttribute('data-id');
      const targetMatchId = target.getAttribute('data-match');
      
      if (selectedId === targetMatchId) {
        target.classList.add('matched');
        selectedProfile.classList.add('connected');
        selectedProfile.classList.remove('selected');
        
        const badge = target.querySelector('.match-status-badge');
        badge.textContent = "Đã khớp 🤝";
        
        selectedProfile = null;
        checkMatchingGameFinished();
      } else {
        target.classList.add('target-selected');
        selectedProfile.classList.add('selected');
        
        target.style.animation = 'shakeCard 0.4s ease';
        setTimeout(() => {
          target.style.animation = '';
          target.classList.remove('target-selected');
        }, 400);
      }
    });
  });

  function checkMatchingGameFinished() {
    const totalMatched = document.querySelectorAll('#targets-column .match-target.matched').length;
    if (totalMatched === 3) {
      const instruction = document.querySelector('.game-instruction');
      instruction.innerHTML = `<span style="color: var(--accent-mint); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Hoàn thành chẩn đoán ban đầu!</span> Thói quen lỗi đã khớp với từng ca bệnh. Hãy bấm mũi tên tiếp tục ca trực.`;
    }
  }

  function resetMatchingGame() {
    profileItems.forEach(p => {
      p.classList.remove('connected', 'selected');
    });
    targetItems.forEach(t => {
      t.classList.remove('matched', 'target-selected');
      const badge = t.querySelector('.match-status-badge');
      badge.textContent = "Chưa nối";
    });
    selectedProfile = null;
    const instruction = document.querySelector('.game-instruction');
    if (instruction) {
      instruction.innerHTML = `<i class="fa-solid fa-gamepad"></i> <strong>Ghép hồ sơ bác sĩ:</strong> Click chọn <strong>Bệnh nhân</strong> ở cột trái, rồi click vào <strong>Thói quen tương ứng</strong> ở cột phải để ghép nối!`;
    }
  }

  // ==========================================================================
  // SLIDE 10: REPORT SCRIPT INPUTS & SYNC PRESERVATION
  // ==========================================================================
  const reportPatient = document.getElementById('report-patient-select');
  const reportHabit = document.getElementById('report-bad-habit');
  const reportPillar = document.getElementById('report-pillar-select');
  const reportDiag = document.getElementById('report-diagnosis');

  // Load saved report values
  if (reportPatient) reportPatient.value = localStorage.getItem('report-patient') || 'Linh Anh';
  if (reportHabit) reportHabit.value = localStorage.getItem('report-habit') || '';
  if (reportPillar) reportPillar.value = localStorage.getItem('report-pillar') || 'Dinh dưỡng';
  if (reportDiag) reportDiag.value = localStorage.getItem('report-diag') || '';

  // Listen to inputs
  function saveReportInputs() {
    localStorage.setItem('report-patient', reportPatient.value);
    localStorage.setItem('report-habit', reportHabit.value);
    localStorage.setItem('report-pillar', reportPillar.value);
    localStorage.setItem('report-diag', reportDiag.value);
  }

  [reportPatient, reportHabit, reportPillar, reportDiag].forEach(el => {
    if (el) el.addEventListener('input', saveReportInputs);
  });

  // ==========================================================================
  // SLIDE 11: 3D CARD FLIPS
  // ==========================================================================
  const flipCards = document.querySelectorAll('.flip-card');
  
  flipCards.forEach(card => {
    const btns = card.querySelectorAll('.flip-btn, .flip-back-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('flipped');
      });
    });
    
    // Front and back cards click fallback
    card.querySelector('.flip-card-front').addEventListener('click', () => {
      card.classList.add('flipped');
    });
    card.querySelector('.flip-card-back').addEventListener('click', () => {
      card.classList.remove('flipped');
    });
  });

  // ==========================================================================
  // SLIDE 19: VIRTUAL NOTEBOOK (REFLECTION & COMMITMENTS)
  // ==========================================================================
  const vQ1 = document.getElementById('v-ref-q1');
  const vQ2 = document.getElementById('v-ref-q2');
  const vQ3 = document.getElementById('v-ref-q3');
  const vSave = document.getElementById('v-save-status');
  const vSigDisplay = document.getElementById('v-sig-display');

  // Load saved reflection page data
  if (vQ1) vQ1.value = localStorage.getItem('reflection-v-q1') || '';
  if (vQ2) vQ2.value = localStorage.getItem('reflection-v-q2') || '';
  if (vQ3) vQ3.value = localStorage.getItem('reflection-v-q3') || '';
  if (vSigDisplay) vSigDisplay.textContent = localStorage.getItem('sig-name') || 'Bác Sĩ Tập Sự';

  function saveVirtualReflection() {
    localStorage.setItem('reflection-v-q1', vQ1.value);
    localStorage.setItem('reflection-v-q2', vQ2.value);
    localStorage.setItem('reflection-v-q3', vQ3.value);
    
    vSave.innerHTML = `<span style="color: var(--accent-mint); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Đã tự động lưu nhật ký.</span>`;
    setTimeout(() => {
      vSave.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Tự động sao lưu nhật ký y khoa của bác sĩ.`;
    }, 2000);
  }

  [vQ1, vQ2, vQ3].forEach(textarea => {
    if (textarea) textarea.addEventListener('input', debounce(saveVirtualReflection, 800));
  });

  // Signature editing trigger
  if (vSigDisplay) {
    vSigDisplay.addEventListener('click', () => {
      const currentName = vSigDisplay.textContent === "Bác Sĩ Tập Sự" ? "" : vSigDisplay.textContent;
      const userName = prompt("Nhập tên Bác sĩ nhí ký tên cam kết:", currentName);
      if (userName !== null) {
        const signatureText = userName.trim() ? userName.trim() : "Bác Sĩ Tập Sự";
        vSigDisplay.textContent = signatureText;
        localStorage.setItem('sig-name', signatureText);
      }
    });
  }

  // Commitment checkboxes on right page
  const vCommits = document.querySelectorAll('.v-commit-cb');
  const vProgressFill = document.getElementById('v-commit-progress-fill');
  const vCommitPct = document.getElementById('v-commit-pct');

  vCommits.forEach(cb => {
    cb.addEventListener('change', updateVirtualCommitmentProgress);
  });

  function updateVirtualCommitmentProgress() {
    const checkedCount = document.querySelectorAll('.v-commit-cb:checked').length;
    const totalCount = vCommits.length;
    const percentage = Math.round((checkedCount / totalCount) * 100);
    
    if (vProgressFill) vProgressFill.style.width = `${percentage}%`;
    if (vCommitPct) vCommitPct.textContent = `${percentage}%`;
  }

  // Debouncer utility
  function debounce(func, delay) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  // ==========================================================================
  // SLIDE 20: CERTIFICATE GENERATOR
  // ==========================================================================
  const certInput = document.getElementById('cert-student-name');
  const certPreviewName = document.getElementById('cert-preview-name');
  const certPrintName = document.getElementById('cert-print-name');
  const btnGenerateCert = document.getElementById('btn-generate-cert');

  // Input listener to update certificate in real-time
  if (certInput) {
    certInput.addEventListener('input', () => {
      const val = certInput.value.trim() ? certInput.value.trim() : "[ Họ và tên học sinh ]";
      if (certPreviewName) certPreviewName.textContent = val;
      if (certPrintName) certPrintName.textContent = val;
    });
  }

  // Pre-populate cert name from Slide 19 signature if available
  function checkAndPrepopulateCertName() {
    const savedName = localStorage.getItem('sig-name');
    if (savedName && savedName !== "Bác Sĩ Tập Sự" && certInput) {
      certInput.value = savedName;
      if (certPreviewName) certPreviewName.textContent = savedName;
      if (certPrintName) certPrintName.textContent = savedName;
    }
  }

  // Generate Cert and Print
  if (btnGenerateCert) {
    btnGenerateCert.addEventListener('click', () => {
      const studentName = certInput ? certInput.value.trim() : '';
      if (!studentName || studentName === "[ Họ và tên học sinh ]") {
        alert("Vui lòng điền tên học sinh trước khi cấp chứng nhận!");
        return;
      }
      window.print();
    });
  }

  // ==========================================================================
  // INITIALIZATION RUN
  // ==========================================================================
  initProgressDots();
  setupTimers();
  updateSlideControlsUI();
  
  // Check and pre-populate cert name on load
  checkAndPrepopulateCertName();

  // Also pre-populate cert name whenever we navigate to Slide 20
  const originalGoToSlide = goToSlide;
  goToSlide = function(index) {
    originalGoToSlide(index);
    if (index === 19) {
      checkAndPrepopulateCertName();
    }
  };
});
