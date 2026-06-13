document.addEventListener('DOMContentLoaded', () => {
  // Custom Alert Helper
  window.showCustomAlert = function(message, icon = '🎉', title = 'Thông báo y khoa') {
    const modal = document.getElementById('custom-alert-modal');
    const msgEl = document.getElementById('custom-alert-message');
    const iconEl = document.getElementById('custom-alert-icon');
    const titleEl = document.getElementById('custom-alert-title');
    const closeBtn = document.getElementById('custom-alert-close-btn');
    
    if (!modal || !msgEl) return;
    
    msgEl.innerHTML = message;
    if (iconEl) iconEl.textContent = icon;
    if (titleEl) titleEl.textContent = title;
    
    modal.classList.remove('hidden');
    
    const closeHandler = () => {
      modal.classList.add('hidden');
      closeBtn.removeEventListener('click', closeHandler);
    };
    closeBtn.addEventListener('click', closeHandler);
  };
  
  // ==========================================================================
  // STATE & VARIABLES
  // ==========================================================================
  let currentSlideIndex = 0; // 0-indexed (0 to 22)
  const slides = document.querySelectorAll('.slide-panel');
  const totalSlides = slides.length;
  
  const prevBtn = document.getElementById('prev-slide-btn');
  const nextBtn = document.getElementById('next-slide-btn');
  const slideIndexDisplay = document.getElementById('slide-index-display');
  const slideStageDisplay = document.getElementById('slide-stage-display');
  const progressDotsContainer = document.getElementById('progress-dots-container');
  const toggleFullscreenBtn = document.getElementById('toggle-fullscreen-btn');
  const toggleGuideBtn = document.getElementById('toggle-guide-btn');
  const closeGuideBtn = document.getElementById('close-guide-btn');
  const startBtn = document.getElementById('start-btn');
  const restartBtn = document.getElementById('restart-btn');

  // ==========================================================================
  // TEACHER GUIDE DATA (23 Slides)
  // ==========================================================================
  const teacherGuideData = [
    // Slide 1 (Bìa)
    {
      duration: "1 - 2 phút",
      prep: "Màn hình trình chiếu sẵn sàng, giáo án, bút ký tên y khoa.",
      steps: [
        "GV ổn định lớp học và giới thiệu tổng quan lộ trình của dự án.",
        "GV dẫn dắt: <strong>Chào mừng các Bác sĩ tập sự!</strong> Hôm nay các em sẽ chính thức gia nhập bệnh viện nhi khoa Nova Hospital.",
        "Đọc to câu hỏi lớn (Big Question) để học sinh nắm vững vấn đề."
      ],
      notes: "Tạo bầu không khí trang trọng của bệnh viện thực tế, khích lệ tinh thần trách nhiệm y học."
    },
    // Slide 2 (Intro HĐ1)
    {
      duration: "1 phút",
      prep: "Slide giới thiệu hoạt động 1.",
      steps: [
        "GV giới thiệu tên hoạt động 1: <strong>GAME: GHÉP HỒ SƠ BỆNH ÁN</strong>.",
        "GV nhấn mạnh đây là bước khám ban đầu để nhận diện bệnh án."
      ],
      notes: "Tập trung sự chú ý của HS bằng cách giới thiệu game."
    },
    // Slide 3 (Chuẩn bị HĐ1)
    {
      duration: "1 phút",
      prep: "Phân phát Phiếu ghép hồ sơ bệnh án cho các cặp đôi.",
      steps: [
        "GV hướng dẫn HS kiểm tra đồ dùng trên bàn học theo phiếu chuẩn bị trên slide.",
        "Nhấn mạnh hình thức làm việc: <strong>Cặp đôi hoặc cá nhân</strong>."
      ],
      notes: "Đảm bảo 100% học sinh đều có đủ học liệu."
    },
    // Slide 4 (Luật chơi HĐ1 + Timer)
    {
      duration: "3 - 4 phút",
      prep: "Slide hướng dẫn luật chơi game.",
      steps: [
        "GV giải thích luật chơi: Nối tên bệnh nhân tương ứng với thói quen xấu của họ.",
        "Bắt đầu khởi động <strong>Đồng hồ đếm ngược 8:00</strong>.",
        "HS thực hiện click nối các cặp bệnh nhân và thói quen trên slide."
      ],
      notes: "Kết nối đường nối y khoa vẽ đường chỉ dẫn kết nối trực tiếp trên màn hình."
    },
    // Slide 5 (Đáp án HĐ1)
    {
      duration: "2 phút",
      prep: "Slide chốt đáp án phân tích.",
      steps: [
        "GV chốt đáp án: Linh Anh ➔ Dinh dưỡng lỗi; Bạn Kem ➔ Thiếu ngủ sâu; Nam Anh ➔ Thiếu vận động.",
        "GV giải thích ngắn gọn nguyên lý sinh học tại sao thói quen đó lại có hại."
      ],
      notes: "Khuyên học sinh ghi nhanh đáp án vào phiếu làm bài."
    },
    // Slide 6 (Tổng kết HĐ1)
    {
      duration: "1 phút",
      prep: "Mở slide tổng kết 3 trụ cột chiều cao.",
      steps: [
        "GV chốt: Di truyền chỉ chiếm 23% chiều cao, lối sống chiếm phần lớn.",
        "GV giải thích 3 yếu tố cốt lõi: Dinh dưỡng - Giấc ngủ - Luyện tập."
      ],
      notes: "Giúp HS ghi nhớ sâu bộ ba lá chắn sức khỏe."
    },
    // Slide 7 (Intro HĐ2)
    {
      duration: "1 phút",
      prep: "Slide giới thiệu hoạt động 2.",
      steps: [
        "GV giới thiệu tên hoạt động 2: <strong>KHÁM BỆNH & HỘI CHẨN</strong>.",
        "GV: Đây là hoạt động chuyên môn nhóm chính để tìm ra nguyên nhân bệnh lý."
      ],
      notes: "GV chuyển giọng sang phong thái bác sĩ chuyên khoa nghiêm túc."
    },
    // Slide 8 (Chuẩn bị HĐ2)
    {
      duration: "1 phút",
      prep: "Chia nhóm 4 học sinh (Hội đồng bác sĩ), phát 5 phiếu hồ sơ chi tiết.",
      steps: [
        "GV yêu cầu các nhóm ổn định vị trí, cử ra nhóm trưởng.",
        "Nhóm trưởng kiểm tra phiếu hồ sơ bệnh nhân và sổ tay ghi chép."
      ],
      notes: "Thao tác nhanh gọn, trật tự."
    },
    // Slide 9 (Hướng dẫn HĐ2 + Timer)
    {
      duration: "2 phút",
      prep: "Slide các bước làm việc nhóm.",
      steps: [
        "GV hướng dẫn các bước hội chẩn nhóm: đọc hồ sơ -> tìm thói quen xấu -> chẩn đoán hậu quả.",
        "GV bấm bắt đầu <strong>Đồng hồ đếm ngược 15:00</strong>."
      ],
      notes: "GV quan sát và trợ giúp các nhóm đọc hiểu thuật ngữ y sinh."
    },
    // Slide 10 (Hồ sơ 5 bệnh án chi tiết)
    {
      duration: "4 - 5 phút",
      prep: "Bảng tab 5 hồ sơ bệnh nhân chi tiết.",
      steps: [
        "GV yêu cầu các nhóm đọc to hồ sơ bệnh nhân.",
        "Sử dụng phím <strong>Spacebar</strong> hoặc click nút để kích hoạt tô nền vàng rực chỉ diện thói quen cản trở chiều cao của từng ca bệnh trên màn hình."
      ],
      notes: "Đây là rào chắn kỹ thuật bắt buộc để HS nhận thức trực quan lỗi hành vi của bệnh nhân."
    },
    // Slide 11 (Thảo luận câu hỏi NẾU DUY TRÌ THÓI QUEN NÀY THÌ SAO?)
    {
      duration: "3 phút",
      prep: "Slide câu hỏi thảo luận y sinh.",
      steps: [
        "GV hỏi HS: <strong>Nếu duy trì thói quen cản trở này kéo dài thì sao?</strong>",
        "Click chọn từng câu hỏi để hiển thị đáp án lý giải y học thực tế của bệnh viện."
      ],
      notes: "Hướng dẫn học sinh trả lời bằng các cụm từ chuyên môn (hormone GH, đĩa sụn, xốp xương)."
    },
    // Slide 12 (Bảng chẩn đoán lâm sàng - Đáp án HĐ2)
    {
      duration: "3 phút",
      prep: "Bảng chẩn đoán lâm sàng chi tiết dạng Table.",
      steps: [
        "GV chiếu Bảng đối chiếu chẩn đoán chính thức.",
        "HS đối chiếu với phiếu nhóm của mình để sửa đổi, bổ sung thông tin chính xác."
      ],
      notes: "Chốt cơ chế hormone tăng trưởng GH, đào thải canxi của nước ngọt và chây lì đĩa sụn khớp."
    },
    // Slide 13 (Consolidation HĐ2 - Đĩa sụn tăng trưởng)
    {
      duration: "2 phút",
      prep: "Slide cơ chế sinh học sụn đĩa tiếp hợp.",
      steps: [
        "GV giải thích chi tiết vị trí đĩa sụn tiếp hợp ở đầu xương chày và xương đùi.",
        "Giải thích lực co kéo cơ học giúp đánh thức sụn sinh trưởng nhân đôi tế bào."
      ],
      notes: "Khắc sâu kiến thức sinh học cốt lõi quyết định sự dài ra của xương."
    },
    // Slide 14 (Intro HĐ3)
    {
      duration: "1 phút",
      prep: "Slide giới thiệu hoạt động 3.",
      steps: [
        "GV giới thiệu tên hoạt động 3: <strong>KÊ ĐƠN THUỐC & PHÁC ĐỒ ĐIỀU TRỊ</strong>.",
        "GV giải thích vai trò kê đơn phục hồi hành vi."
      ],
      notes: "HS tập trung chuẩn bị hoạt động thực hành tiếp theo."
    },
    // Slide 15 (Chuẩn bị HĐ3)
    {
      duration: "1 phút",
      prep: "Phát Phiếu đơn thuốc Novastars cho các nhóm.",
      steps: [
        "GV yêu cầu các nhóm chuẩn bị bút ký và phiếu đơn thuốc.",
        "Hình thức làm việc: Hội đồng bác sĩ nhí nhóm 4 người."
      ],
      notes: "Đảm bảo tính trật tự của lớp học."
    },
    // Slide 16 (Hướng dẫn HĐ3 + Timer)
    {
      duration: "2 phút",
      prep: "Slide các bước kê đơn thuốc.",
      steps: [
        "GV hướng dẫn HS các bước ghi phác đồ phục hồi: xác định lỗi -> định lượng canxi, thể thao, ngủ sớm -> nhóm trưởng ký tên.",
        "Bắt đầu khởi động <strong>Đồng hồ đếm ngược 12:00</strong>."
      ],
      notes: "GV quan sát, nhắc nhở học sinh kê đúng định lượng vàng y tế."
    },
    // Slide 17 (Đơn thuốc mẫu Novastars - Đáp án HĐ3)
    {
      duration: "3 phút",
      prep: "Khung đơn thuốc phác đồ điều trị đạt chuẩn.",
      steps: [
        "GV công bố đơn thuốc mẫu đạt chuẩn y khoa của Nova Hospital.",
        "Chỉ ra các định lượng: 500ml sữa, ngủ trước 22h, tập thể thao > 45 phút."
      ],
      notes: "Nhấn mạnh chữ ký bác sĩ thể hiện y đức của người kê đơn điều trị."
    },
    // Slide 18 (Tổng kết HĐ3)
    {
      duration: "1 phút",
      prep: "Slide tổng kết hoạt động kê đơn.",
      steps: [
        "GV chốt ý: Đơn thuốc chỉ hiệu quả khi bệnh nhân cam kết nghiêm túc tuân thủ phác đồ.",
        "Dẫn dắt sang hoạt động 4: Tự thiết kế Sổ tay mini cá nhân."
      ],
      notes: "Chuẩn bị học sinh chuyển sang hoạt động cá nhân tĩnh."
    },
    // Slide 19 (Intro HĐ4)
    {
      duration: "1 phút",
      prep: "Slide giới thiệu hoạt động 4.",
      steps: [
        "GV giới thiệu tên hoạt động 4: <strong>SỔ TAY MINI BÁC SĨ</strong>.",
        "GV giải thích nhiệm vụ tự làm sổ tay ghi chép sức khỏe cá nhân."
      ],
      notes: "Kích thích khả năng thủ công sáng tạo của học sinh."
    },
    // Slide 20 (Chuẩn bị HĐ4)
    {
      duration: "1 phút",
      prep: "Phát tờ A4 thiết kế sẵn, kéo thủ công, bút màu.",
      steps: [
        "GV yêu cầu học sinh chuẩn bị kéo và dụng cụ vẽ.",
        "Xác nhận hình thức hoạt động: Cá nhân độc lập."
      ],
      notes: "Cảnh báo học sinh cẩn thận khi sử dụng kéo thủ công."
    },
    // Slide 21 (Hướng dẫn làm sổ tay + Timer)
    {
      duration: "2 - 3 phút",
      prep: "Slide sơ đồ gấp sổ tay mini.",
      steps: [
        "GV hướng dẫn gấp giấy A4 làm đôi, làm tư, cắt một đường ở giữa để tạo thành cuốn sổ tay 8 trang.",
        "Hướng dẫn ghi nội dung trang bìa, nhật ký và đơn thuốc.",
        "Bấm bắt đầu <strong>Đồng hồ đếm ngược 08:00</strong>."
      ],
      notes: "GV đi xung quanh hỗ trợ những học sinh gặp khó khăn khi gấp giấy."
    },
    // Slide 22 (Bản cam kết hành động)
    {
      duration: "2 phút",
      prep: "Slide bản cam kết hành động cá nhân.",
      steps: [
        "GV hướng dẫn học sinh đọc to và tự tích chọn 4 cam kết vàng vào sổ tay và trên slide.",
        "Ký tên xác nhận vai trò Bác sĩ tập sự."
      ],
      notes: "Giúp học sinh có ý thức tự giác tuân thủ phác đồ của bản thân."
    },
    // Slide 23 (Tổng kết Tiết 1)
    {
      duration: "2 phút",
      prep: "Slide chúc mừng hoàn thành ca trực lâm sàng.",
      steps: [
        "GV chúc mừng toàn lớp đã xuất sắc vượt qua ca trực lâm sàng đầu tiên.",
        "Nhắc nhở cất giữ cẩn thận Sổ tay mini để sẵn sàng làm việc ở Tiết 2."
      ],
      notes: "Tôn vinh nỗ lực của học sinh và tạo sự mong đợi cho tiết học tiếp theo."
    }
  ];

  // ==========================================================================
  // SLIDE NAV ENGINE
  // ==========================================================================
  
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

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    slides[currentSlideIndex].classList.remove('active');
    pauseAllTimers();
    
    currentSlideIndex = index;
    slides[currentSlideIndex].classList.add('active');
    
    updateSlideControlsUI();
    updateTeacherGuideContent(currentSlideIndex);
  }

  function updateSlideControlsUI() {
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === totalSlides - 1;
    
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
      if (idx === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    slideIndexDisplay.textContent = `Slide ${currentSlideIndex + 1} / ${totalSlides}`;
    
    const stageName = slides[currentSlideIndex].getAttribute('data-stage') || 'Bài học';
    slideStageDisplay.textContent = stageName;
    
    const currentStageDisplay = document.getElementById('current-stage-display');
    if (currentSlideIndex === 0) {
      currentStageDisplay.textContent = "TIẾT 1: BÁC SĨ KHÁM BỆNH";
    } else if (currentSlideIndex === totalSlides - 1) {
      currentStageDisplay.textContent = "HOÀN THÀNH CA TRỰC";
    } else {
      currentStageDisplay.textContent = `BÁC SĨ KHÁM BỆNH: ${stageName.toUpperCase()}`;
    }
  }

  function updateTeacherGuideContent(slideIndex) {
    const data = teacherGuideData[slideIndex];
    if (!data) return;
    
    document.getElementById('g-act-name').textContent = slides[slideIndex].getAttribute('data-stage') || 'Bài học';
    document.getElementById('g-act-time').textContent = data.duration;
    document.getElementById('g-prep-details').textContent = data.prep;
    document.getElementById('g-notes-details').innerHTML = data.notes;
    
    const stepsContainer = document.getElementById('g-steps-container');
    stepsContainer.innerHTML = '';
    data.steps.forEach((step, idx) => {
      const stepItem = document.createElement('div');
      stepItem.classList.add('g-step-item');
      stepItem.innerHTML = `<span class="step-num">${idx + 1}</span><p class="step-p">${step}</p>`;
      stepsContainer.appendChild(stepItem);
    });
  }

  // Keyboard navigation bindings
  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
      return;
    }
    
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      if (e.key === ' ' && currentSlideIndex === 9) {
        e.preventDefault();
        toggleBadHabitHighlights();
      } else {
        goToSlide(currentSlideIndex + 1);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      goToSlide(currentSlideIndex - 1);
    } else if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    } else if (e.key.toLowerCase() === 'g') {
      toggleTeacherGuide();
    }
  });

  prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));
  startBtn.addEventListener('click', () => goToSlide(1));
  
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      if (confirm("Bạn có chắc chắn muốn làm mới toàn bộ bài học từ đầu?")) {
        resetLectureData();
        goToSlide(0);
      }
    });
  }

  function resetLectureData() {
    // Reset commitments
    document.getElementById('v-commit-meal').checked = false;
    document.getElementById('v-commit-milk').checked = false;
    document.getElementById('v-commit-sleep').checked = false;
    document.getElementById('v-commit-ex').checked = false;
    document.getElementById('v-sig-display').textContent = "Bác Sĩ Tập Sự";
    
    // Hide diagnostic discussion answers
    document.querySelectorAll('.diag-answer').forEach(ans => ans.classList.add('hidden'));
    
    resetMatchingGame();
    resetAllTimers();
  }

  // ==========================================================================
  // FULLSCREEN CONTROLS
  // ==========================================================================
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error entering fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  toggleFullscreenBtn.addEventListener('click', toggleFullscreen);
  
  document.addEventListener('fullscreenchange', () => {
    const icon = toggleFullscreenBtn.querySelector('i');
    if (document.fullscreenElement) {
      icon.className = 'fa-solid fa-compress';
    } else {
      icon.className = 'fa-solid fa-expand';
    }
  });

  function toggleTeacherGuide() {
    const panel = document.getElementById('teacher-guide-panel');
    panel.classList.toggle('active');
    toggleGuideBtn.classList.toggle('active');
  }

  toggleGuideBtn.addEventListener('click', toggleTeacherGuide);
  closeGuideBtn.addEventListener('click', toggleTeacherGuide);

  // ==========================================================================
  // COUNTDOWN TIMERS CONTROLLERS (4 Timers)
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
      state.current--;
      updateTimerDisplay(id);
      
      if (state.current <= 0) {
        clearInterval(state.interval);
        state.interval = null;
        widget.classList.remove('running');
        widget.classList.add('expired');
        widget.querySelector('.play-btn').classList.remove('hidden');
        widget.querySelector('.pause-btn').classList.add('hidden');
        playAlarmGlow();
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
    widget.querySelector('.play-btn').classList.remove('hidden');
    widget.querySelector('.pause-btn').classList.add('hidden');
  }

  function resetTimer(id) {
    const state = timerStates[id];
    const widget = document.getElementById(id);
    if (!state) return;
    
    pauseTimer(id);
    state.current = state.default;
    widget.classList.remove('expired');
    widget.classList.remove('running');
    updateTimerDisplay(id);
  }

  function updateTimerDisplay(id) {
    const state = timerStates[id];
    const widget = document.getElementById(id);
    if (!state || !widget) return;
    
    const minutes = Math.floor(state.current / 60);
    const seconds = state.current % 60;
    widget.querySelector('.timer-display').textContent = 
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function pauseAllTimers() {
    Object.keys(timerStates).forEach(id => pauseTimer(id));
  }

  function resetAllTimers() {
    Object.keys(timerStates).forEach(id => resetTimer(id));
  }

  function playAlarmGlow() {
    const header = document.querySelector('.app-header');
    header.style.boxShadow = '0 0 25px rgba(229, 62, 62, 0.6)';
    setTimeout(() => {
      header.style.boxShadow = '';
    }, 2000);
  }

  // ==========================================================================
  // HĐ1 MATCHING GAME WITH CONNECTION LINES - USER REQUEST
  // ==========================================================================
  let selectedProfile = null;
  let activeMatches = []; // Store matched pairs
  
  function setupMatchingGame() {
    const items = document.querySelectorAll('#profiles-column .match-item');
    const targets = document.querySelectorAll('#targets-column .match-target');
    
    items.forEach(item => {
      item.addEventListener('click', () => {
        if (item.classList.contains('matched')) return;
        
        items.forEach(p => p.classList.remove('selected'));
        selectedProfile = item;
        item.classList.add('selected');
      });
    });
    
    targets.forEach(target => {
      target.addEventListener('click', () => {
        if (target.classList.contains('matched') || !selectedProfile) return;
        
        const profileId = selectedProfile.getAttribute('data-id');
        const targetMatch = target.getAttribute('data-match');
        
        if (profileId === targetMatch) {
          // Correct match!
          target.classList.add('matched');
          selectedProfile.classList.add('matched');
          selectedProfile.classList.remove('selected');
          
          target.style.borderColor = 'var(--accent-mint)';
          target.style.background = 'rgba(0,128,128,0.1)';
          target.querySelector('.match-status-badge').textContent = 'Đúng ✅';
          target.querySelector('.match-status-badge').style.color = 'var(--accent-mint)';
          
          selectedProfile.style.borderColor = 'var(--accent-mint)';
          selectedProfile.style.background = 'rgba(0,128,128,0.06)';
          
          // Draw connection line
          drawConnectionLine(selectedProfile, target);
          activeMatches.push({ fromId: selectedProfile.id, toId: target.id });
          
          selectedProfile = null;
        } else {
          // Incorrect match
          target.style.borderColor = 'var(--accent-red)';
          target.style.background = 'rgba(229,62,62,0.1)';
          target.querySelector('.match-status-badge').textContent = 'Sai ❌';
          target.querySelector('.match-status-badge').style.color = 'var(--accent-red)';
          
          setTimeout(() => {
            if (!target.classList.contains('matched')) {
              target.style.borderColor = '';
              target.style.background = '';
              target.querySelector('.match-status-badge').textContent = 'Chưa nối';
              target.querySelector('.match-status-badge').style.color = '';
            }
          }, 1200);
        }
      });
    });
    
    window.addEventListener('resize', redrawAllLines);
  }

  function drawConnectionLine(fromEl, toEl) {
    const container = document.querySelector('.matching-container');
    const svg = document.getElementById('matching-svg');
    if (!container || !svg) return;
    
    const containerRect = container.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    
    // Calculate relative coordinates
    const x1 = fromRect.right - containerRect.left;
    const y1 = (fromRect.top + fromRect.bottom) / 2 - containerRect.top;
    const x2 = toRect.left - containerRect.left;
    const y2 = (toRect.top + toRect.bottom) / 2 - containerRect.top;
    
    // Create SVG line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#008080'); // Mint/Teal stroke
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-dasharray', '8 4');
    line.style.animation = 'dash 1.2s linear infinite';
    line.setAttribute('id', `line-${fromEl.id}-${toEl.id}`);
    
    svg.appendChild(line);
  }

  function redrawAllLines() {
    const svg = document.getElementById('matching-svg');
    if (!svg) return;
    svg.innerHTML = '';
    
    activeMatches.forEach(m => {
      const fromEl = document.getElementById(m.fromId);
      const toEl = document.getElementById(m.toId);
      if (fromEl && toEl) {
        drawConnectionLine(fromEl, toEl);
      }
    });
  }

  function resetMatchingGame() {
    const items = document.querySelectorAll('#profiles-column .match-item');
    const targets = document.querySelectorAll('#targets-column .match-target');
    
    items.forEach(item => {
      item.className = 'match-item card-item';
      item.style.borderColor = '';
      item.style.background = '';
    });
    
    targets.forEach(target => {
      target.className = 'match-target';
      target.style.borderColor = '';
      target.style.background = '';
      target.querySelector('.match-status-badge').textContent = 'Chưa nối';
      target.querySelector('.match-status-badge').style.color = '';
    });
    
    const svg = document.getElementById('matching-svg');
    if (svg) svg.innerHTML = '';
    
    selectedProfile = null;
    activeMatches = [];
  }

  // ==========================================================================
  // HĐ2 TABS & DYNAMIC HIGHLIGHT LOGIC
  // ==========================================================================
  function setupPatientTabs() {
    const tabs = document.querySelectorAll('.patient-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const patientName = tab.getAttribute('data-patient');
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.patient-record-content').forEach(content => {
          if (content.id === `record-${patientName}`) {
            content.classList.remove('hidden');
          } else {
            content.classList.add('hidden');
          }
        });
      });
    });

    const triggerBtn = document.getElementById('trigger-highlight-btn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', toggleBadHabitHighlights);
    }
  }

  function toggleBadHabitHighlights() {
    const activeContent = document.querySelector('.patient-record-content:not(.hidden)');
    if (!activeContent) return;
    
    const spans = activeContent.querySelectorAll('.bad-habit-span');
    spans.forEach(span => {
      span.classList.toggle('highlighted');
    });
    
    const triggerBtn = document.getElementById('trigger-highlight-btn');
    if (triggerBtn) {
      const anyHighlighted = activeContent.querySelector('.bad-habit-span.highlighted');
      if (anyHighlighted) {
        triggerBtn.style.background = '#ecc94b';
        triggerBtn.style.color = '#1a202c';
        triggerBtn.innerHTML = '<i class="fa-solid fa-eraser"></i> Xóa highlight';
      } else {
        triggerBtn.style.background = 'var(--accent-red)';
        triggerBtn.style.color = 'white';
        triggerBtn.innerHTML = '<i class="fa-solid fa-highlighter"></i> Chỉ diện thói quen xấu';
      }
    }
  }

  function setupDiscussionCards() {
    const cards = document.querySelectorAll('.discussion-question-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const answer = card.querySelector('.diag-answer');
        answer.classList.toggle('hidden');
      });
    });
  }

  // ==========================================================================
  // HĐ4 CAM KẾT
  // ==========================================================================
  function setupCommitmentBoxes() {
    const cMeal = document.getElementById('v-commit-meal');
    const cMilk = document.getElementById('v-commit-milk');
    const cSleep = document.getElementById('v-commit-sleep');
    const cEx = document.getElementById('v-commit-ex');
    const sigDisplay = document.getElementById('v-sig-display');
    
    const updateSig = () => {
      let checkedCount = 0;
      if (cMeal.checked) checkedCount++;
      if (cMilk.checked) checkedCount++;
      if (cSleep.checked) checkedCount++;
      if (cEx.checked) checkedCount++;
      
      if (checkedCount >= 4) {
        sigDisplay.textContent = "Bác Sĩ Tập Sự Trách Nhiệm";
        sigDisplay.style.color = 'var(--accent-teal)';
      } else {
        sigDisplay.textContent = "Bác Sĩ Tập Sự";
        sigDisplay.style.color = '';
      }
    };
    
    cMeal.addEventListener('change', updateSig);
    cMilk.addEventListener('change', updateSig);
    cSleep.addEventListener('change', updateSig);
    cEx.addEventListener('change', updateSig);
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  initProgressDots();
  setupTimers();
  setupMatchingGame();
  setupPatientTabs();
  setupDiscussionCards();
  setupCommitmentBoxes();
  
  updateTeacherGuideContent(0);
});