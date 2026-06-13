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
  const toggleThemeBtn = document.getElementById('toggle-theme-btn');
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
      prep: "Màn hình chiếu sẵn sàng, giáo án, nhạc nền trang trọng.",
      steps: [
        "GV ổn định lớp học và giới thiệu vai trò mới: Chuyên gia tuyên truyền sức khỏe.",
        "GV: <strong>Chào mừng các Chuyên gia!</strong> Hôm nay chúng ta sẽ bắt đầu chiến dịch tuyên truyền thực địa báo cáo kết quả và nghiệm thu.",
        "Đọc to câu hỏi lớn (Big Question) và dẫn dắt học sinh."
      ],
      notes: "Tạo không khí chuyên nghiệp, kích thích sự hứng thú kết thúc lộ trình học tập."
    },
    // Slide 2 (Tên HĐ1)
    {
      duration: "1 phút",
      prep: "Mở slide giới thiệu hoạt động 1.",
      steps: [
        "GV giới thiệu tên hoạt động 1: <strong>GAME: AI LÀ CHUYÊN GIA THẬT?</strong>.",
        "GV giải thích nhiệm vụ: Tranh biện y khoa để phát hiện các tin tức sức khỏe sai lệch."
      ],
      notes: "Giúp học sinh hào hứng bước vào cuộc đua tranh biện."
    },
    // Slide 3 (Chuẩn bị HĐ1)
    {
      duration: "1 phút",
      prep: "Chuẩn bị sẵn thẻ Đúng ✅ và Sai ❌ trên bàn học.",
      steps: [
        "GV yêu cầu học sinh kiểm tra học liệu chuẩn bị sẵn.",
        "Xác nhận hình thức hoạt động: Cá nhân phản xạ nhanh."
      ],
      notes: "Đảm bảo học sinh sẵn sàng giơ thẻ trả lời nhanh."
    },
    // Slide 4 (Luật chơi HĐ1)
    {
      duration: "1 - 2 phút",
      prep: "Slide mô tả luật chơi.",
      steps: [
        "GV giải thích luật chơi: Đọc phát biểu -> Giơ thẻ Đúng/Sai -> Lắng nghe khoa học giải thích.",
        "Khởi động <strong>Đồng hồ đếm ngược 8:00</strong>."
      ],
      notes: "Kêu gọi tinh thần tranh biện thẳng thắn, phản biện khoa học."
    },
    // Slide 5 (Game tương tác HĐ1)
    {
      duration: "4 - 5 phút",
      prep: "Khung câu hỏi tương tác Đúng/Sai.",
      steps: [
        "GV điều phối trò chơi: Lần lượt đọc to 5 phát biểu trên slide.",
        "Yêu cầu HS giơ thẻ bình chọn Đúng/Sai. Gõ hoặc click đáp án để hiện lý giải y học chuẩn xác.",
        "Bấm nút 'Câu tiếp theo' để chuyển lần lượt qua các câu hỏi."
      ],
      notes: "Các phát biểu xoay quanh canxi, giấc ngủ sâu, hormone GH, sụn đầu xương giúp ôn tập trọn vẹn kiến thức."
    },
    // Slide 6 (Tổng kết HĐ1)
    {
      duration: "1 phút",
      prep: "Slide tổng kết vai trò chuyên gia.",
      steps: [
        "GV chốt: Mọi thông điệp truyền thông y tế phải dựa trên nền tảng khoa học y học thực chứng chuẩn xác.",
        "Dẫn dắt sang hoạt động 2: Diễn tập tuyên truyền nhóm."
      ],
      notes: "Khen ngợi học sinh đã tranh biện xuất sắc."
    },
    // Slide 7 (Tên HĐ2)
    {
      duration: "1 phút",
      prep: "Mở slide giới thiệu hoạt động 2.",
      steps: [
        "GV giới thiệu hoạt động 2: <strong>DIỄN TẬP TUYÊN TRUYỀN</strong>.",
        "GV giải thích nhiệm vụ: Các nhóm thống nhất nội dung, phân vai và luyện tập thuyết trình trước khi ra báo cáo thực địa."
      ],
      notes: "Tập trung tinh thần làm việc nhóm nghiêm túc của chuyên gia thẩm định."
    },
    // Slide 8 (Chuẩn bị HĐ2)
    {
      duration: "1 phút",
      prep: "Nhóm 4 học sinh, chuẩn bị Poster đã vẽ ở Tiết 2 lên bàn.",
      steps: [
        "GV điều phối các nhóm ổn định vị trí nhóm, chuẩn bị sẵn poster đã vẽ và duyệt ở Tiết 2.",
        "Nhóm trưởng phân chia nhiệm vụ diễn tập."
      ],
      notes: "Tránh gây mất trật tự khi ổn định nhóm."
    },
    // Slide 9 (Hướng dẫn HĐ2)
    {
      duration: "1 - 2 phút",
      prep: "Slide các bước diễn tập thuyết trình nhóm.",
      steps: [
        "GV giải thích các bước diễn tập trên slide: Thống nhất nội dung ➔ Phân vai ➔ Luyện tập.",
        "GV khởi động <strong>Đồng hồ đếm ngược 15:00</strong> trên màn hình."
      ],
      notes: "Học sinh hiểu cách tự rà soát chéo tiêu chí trước khi ra báo cáo thực địa."
    },
    // Slide 10 (Hộp kiểm Đánh giá HĐ2 - USER REQUEST)
    {
      duration: "3 - 4 phút",
      prep: "Khung diễn tập và bảng kiểm 4 tiêu chí sẵn sàng xuất quân.",
      steps: [
        "GV hướng dẫn các nhóm tự đánh giá chéo mức độ sẵn sàng thuyết trình.",
        "Tích chọn đủ 4 tiêu chí checklist để kích hoạt con dấu đỏ 'SẴN SÀNG' của Nova Hospital xuất hiện bảo chứng cho nhóm xuất quân."
      ],
      notes: "Đây là phần rào chắn kỹ thuật. Tích đủ 4 hộp kiểm sẽ làm con dấu đỏ hiện rõ."
    },
    // Slide 11 (Thảo luận kỹ năng thuyết trình y khoa)
    {
      duration: "3 phút",
      prep: "Slide thảo luận kỹ năng trình bày khoa học.",
      steps: [
        "GV đặt câu hỏi thảo luận về kỹ năng thuyết trình y tế hiệu quả.",
        "Click chọn từng câu hỏi để hiển thị gợi ý khoa học của Bệnh viện."
      ],
      notes: "Rèn luyện tư duy phân tích y khoa, tránh các thông điệp chung chung không định lượng."
    },
    // Slide 12 (Chứng nhận sẵn sàng chiến dịch)
    {
      duration: "2 phút",
      prep: "Slide con dấu đỏ sẵn sàng chiến dịch của Bệnh viện.",
      steps: [
        "GV giới thiệu Lệnh xuất quân và ý nghĩa việc bảo chứng chuyên nghiệp của Nova Hospital.",
        "GV chính thức tuyên bố các nhóm được lệnh xuất quân ra tuyên truyền."
      ],
      notes: "Tạo sự hứng khởi khi học sinh thấy nhóm mình đã được bảo chứng chất lượng chuyên môn y khoa."
    },
    // Slide 13 (Tổng kết HĐ2)
    {
      duration: "1 phút",
      prep: "Slide tổng kết quy trình diễn tập.",
      steps: [
        "GV chốt: Diễn tập chu đáo là chìa khóa để truyền tải thông điệp y tế chính xác và tạo niềm tin cho cộng đồng.",
        "Chuyển sang hoạt động 3: Thuyết trình chiến dịch thực địa."
      ],
      notes: "Dẫn dắt các nhóm chuẩn bị tinh thần thuyết trình."
    },
    // Slide 14 (Tên HĐ3)
    {
      duration: "1 phút",
      prep: "Mở slide giới thiệu hoạt động 3.",
      steps: [
        "GV giới thiệu hoạt động 3: <strong>CHIẾN DỊCH SỨC KHỎE NOVASTARS & VINH DANH</strong>.",
        "GV: Đã đến giờ thuyết trình thực địa và trao giải vinh danh nhóm xuất sắc nhất."
      ],
      notes: "Đẩy cao tinh thần thi đua sôi nổi của các nhóm."
    },
    // Slide 15 (Chuẩn bị HĐ3)
    {
      duration: "1 phút",
      prep: "Nhóm thuyết trình chuẩn bị, các nhóm nghe chuẩn bị phiếu phản hồi chéo.",
      steps: [
        "GV yêu cầu các nhóm chuẩn bị sẵn phiếu phản hồi chéo 👍 / ❓ / 💡 trên bàn."
      ],
      notes: "Đảm bảo 100% học sinh đều có nhiệm vụ phản hồi khi nhóm bạn thuyết trình."
    },
    // Slide 16 (Hướng dẫn thuyết trình HĐ3)
    {
      duration: "2 phút",
      prep: "Slide quy trình thuyết trình và phản hồi chéo.",
      steps: [
        "GV giải thích kỹ công thức phản hồi chéo: 1 điểm hay (👍) | 1 câu hỏi chất vấn (❓) | 1 góp ý (💡).",
        "GV bắt đầu chạy <strong>Đồng hồ đếm ngược 12:00</strong> để điều phối các nhóm thuyết trình."
      ],
      notes: "Giám sát thời gian thuyết trình nghiêm túc, khuyên học sinh phản hồi lịch sự, khoa học."
    },
    // Slide 17 (Bục vinh quang 3D)
    {
      duration: "3 - 4 phút",
      prep: "Khung bục vinh quang 3D.",
      steps: [
        "GV công bố các nhóm đạt giải Cúp Vàng, Cúp Bạc, Cúp Đồng của chiến dịch.",
        "Nhập tên các nhóm đạt giải tương ứng vào ô input để hiển thị tên nhóm trực tiếp lên bục vinh quang tương ứng."
      ],
      notes: "Rào chắn kỹ thuật vinh danh. Gõ tên nhóm sẽ cập nhật tên nhóm hiển thị trên bục, tạo không khí vinh danh hoành tráng."
    },
    // Slide 18 (Tổng kết HĐ3)
    {
      duration: "1 phút",
      prep: "Slide tổng kết chiến dịch báo cáo thực địa.",
      steps: [
        "GV chúc mừng toàn bộ các nhóm đã nghiệm thu chiến dịch xuất sắc.",
        "Chuyển sang hoạt động 4: Tuyên thệ cam kết cá nhân cuối khóa."
      ],
      notes: "Dẫn dắt các học sinh chuyển về trạng thái làm việc cá nhân."
    },
    // Slide 19 (Tên HĐ4)
    {
      duration: "1 phút",
      prep: "Mở slide giới thiệu hoạt động 4.",
      steps: [
        "GV giới thiệu hoạt động 4: <strong>NHẬT KÝ TUYÊN THỆ & THỬ THÁCH BÁC SĨ NHÍ</strong>."
      ],
      notes: "Tạo bầu không khí trang trọng cho nghi thức cam kết lâu dài."
    },
    // Slide 20 (Chuẩn bị HĐ4)
    {
      duration: "1 phút",
      prep: "Học sinh chuẩn bị sổ tay mini viết nhật ký trang cuối.",
      steps: [
        "GV yêu cầu học sinh mở trang cuối cuốn sổ tay mini cá nhân."
      ],
      notes: "Đảm bảo học sinh có sẵn sổ để viết tuyên thệ."
    },
    // Slide 21 (Hướng dẫn HĐ4)
    {
      duration: "2 - 3 phút",
      prep: "Slide hướng dẫn thử thách 21 ngày và cam kết.",
      steps: [
        "GV giải thích thử thách 21 ngày hành động để tạo thói quen tốt.",
        "GV chạy <strong>Đồng hồ đếm ngược 08:00</strong>.",
        "Yêu cầu học sinh viết Lời thề danh dự bác sĩ nhí vào sổ tay cá nhân."
      ],
      notes: "GV đi hỗ trợ, quan sát học sinh viết cam kết."
    },
    // Slide 22 (Lời thề danh dự bác sĩ)
    {
      duration: "2 phút",
      prep: "Slide lời thề danh dự bác sĩ nhí.",
      steps: [
        "GV yêu cầu toàn lớp đứng dậy, đặt tay lên ngực và đọc vang Lời thề danh dự bác sĩ nhí.",
        "GV hướng dẫn ký tên cam kết lâu dài."
      ],
      notes: "Đây là nghi thức quan trọng tạo cảm xúc thiêng liêng và động lực hành động thực tế lâu dài cho học sinh."
    },
    // Slide 23 (Tốt nghiệp)
    {
      duration: "2 phút",
      prep: "Slide chúc mừng tốt nghiệp chương trình Bác sĩ nhí.",
      steps: [
        "GV gửi lời chúc mừng chân thành đến toàn bộ học sinh tốt nghiệp khóa học lâm sàng.",
        "Nhắc nhở học sinh duy trì thói quen tốt hàng ngày.",
        "GV click nút Khởi động lại nếu muốn thực hiện lại khóa học từ đầu."
      ],
      notes: "Tôn vinh nỗ lực của học sinh và bế mạc lớp học y khoa Nova Hospital."
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
      currentStageDisplay.textContent = "TIẾT 3: LAN TỎA SỨC KHỎE";
    } else if (currentSlideIndex === totalSlides - 1) {
      currentStageDisplay.textContent = "HOÀN THÀNH KHÓA ĐÀO TẠO";
    } else {
      currentStageDisplay.textContent = `CHUYÊN GIA TUYÊN TRUYỀN: ${stageName.toUpperCase()}`;
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
      goToSlide(currentSlideIndex + 1);
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
    // Reset checklists (4 items - USER REQUEST)
    document.getElementById('audit-check-1').checked = false;
    document.getElementById('audit-check-2').checked = false;
    document.getElementById('audit-check-3').checked = false;
    document.getElementById('audit-check-4').checked = false;
    document.getElementById('approved-stamp-badge').style.opacity = '0.15';
    document.getElementById('approved-stamp-badge').classList.remove('stamped');
    
    // Reset podium inputs
    document.getElementById('podium-input-1').value = '';
    document.getElementById('podium-input-2').value = '';
    document.getElementById('podium-input-3').value = '';
    document.getElementById('display-name-1').textContent = 'CÚP VÀNG';
    document.getElementById('display-name-2').textContent = 'CÚP BẠC';
    document.getElementById('display-name-3').textContent = 'CÚP ĐỒNG';
    
    // Hide diagnostic discussion answers
    document.querySelectorAll('.diag-answer').forEach(ans => ans.classList.add('hidden'));
    
    resetQuizGame();
    const certInput = document.getElementById('cert-student-name');
    const certPreviewName = document.getElementById('cert-preview-name');
    if (certInput) certInput.value = '';
    if (certPreviewName) certPreviewName.textContent = "[ Họ và tên học sinh ]";
    resetAllTimers();
  }

  // ==========================================================================
  // FULLSCREEN & THEME CONTROLS
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

  toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = toggleThemeBtn.querySelector('i');
    if (document.body.classList.contains('light-mode')) {
      icon.className = 'fa-solid fa-sun';
      document.body.classList.remove('dark-mode');
    } else {
      icon.className = 'fa-solid fa-moon';
      document.body.classList.add('dark-mode');
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
  // HĐ1 QUIZ GAME LOGIC (Đúng / Sai)
  // ==========================================================================
  const quizData = [
    {
      q: '"Uống sữa giúp xương dài ra, còn nước ngọt có ga không ảnh hưởng gì cả."',
      ans: false,
      exp: "Lý giải: Sai. Nước ngọt có ga chứa nhiều axit phốt phoric, làm tăng đào thải canxi qua thận, cản trở sự cứng cáp cốt hóa của xương."
    },
    {
      q: '"Hormone tăng trưởng GH tiết ra nhiều nhất khi trẻ ngủ thật sâu từ 22h đêm đến 2h sáng hôm sau."',
      ans: true,
      exp: "Lý giải: Đúng. Đi ngủ trước 22h00 là điều kiện vàng để tuyến yên giải phóng tối đa hormone tăng trưởng GH kích thích sụn tiếp hợp phân bào."
    },
    {
      q: '"Chỉ cần ăn uống thật nhiều thịt cá và sữa là đủ cao, không cần phải chạy nhảy hay chơi thể thao."',
      ans: false,
      exp: "Lý giải: Sai. Luyện tập thể thao co kéo cơ xương tạo lực nén cơ học tuần hoàn kích thích sụn tiếp hợp ở đầu xương phân chia tế bào mới."
    },
    {
      q: '"Bỏ bữa sáng là thói quen xấu làm cơ thể thiếu năng lượng và dinh dưỡng trầm trọng, ảnh hưởng đến chiều cao."',
      ans: true,
      exp: "Lý giải: Đúng. Nhịn ăn sáng làm cơ thể thiếu năng lượng tổng hợp mô dẻo dai và thiếu hụt nguyên liệu canxi cốt hóa khung xương."
    },
    {
      q: '"Trẻ em 8-12 tuổi cần ngủ đủ từ 8 đến 10 tiếng mỗi ngày và nên đi ngủ trước 22h tối."',
      ans: true,
      exp: "Lý giải: Đúng. Giúp hồi phục sức khỏe toàn diện và giải phóng lượng hormone tăng trưởng dồi dào nhất từ tuyến yên."
    }
  ];

  let currentQuestionIndex = 0;

  function setupQuizGame() {
    const choiceButtons = document.querySelectorAll('.quiz-choice-btn');
    const nextQBtn = document.getElementById('next-question-btn');
    const questionText = document.getElementById('quiz-question-text');
    const expText = document.getElementById('quiz-explanation-text');
    
    choiceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-choice') === 'true';
        const currentQ = quizData[currentQuestionIndex];
        
        expText.classList.remove('hidden');
        expText.textContent = currentQ.exp;
        
        if (choice === currentQ.ans) {
          expText.style.borderColor = '#38a169';
          expText.style.background = '#f0fff4';
          expText.style.color = '#22543d';
          expText.innerHTML = `<h4 style="color: #276749; font-weight: 800; margin-bottom: 6px;"><i class="fa-solid fa-circle-check"></i> CHÍNH XÁC! ✅</h4>${currentQ.exp}`;
        } else {
          expText.style.borderColor = '#e53e3e';
          expText.style.background = '#fff5f5';
          expText.style.color = '#742a2a';
          expText.innerHTML = `<h4 style="color: #c53030; font-weight: 800; margin-bottom: 6px;"><i class="fa-solid fa-circle-xmark"></i> CHƯA ĐÚNG! ❌</h4>${currentQ.exp}`;
        }
        
        choiceButtons.forEach(b => b.classList.add('hidden'));
        nextQBtn.classList.remove('hidden');
        
        if (currentQuestionIndex === quizData.length - 1) {
          nextQBtn.innerHTML = 'Kết thúc trò chơi <i class="fa-solid fa-circle-check"></i>';
        }
      });
    });
    
    nextQBtn.addEventListener('click', () => {
      currentQuestionIndex++;
      
      if (currentQuestionIndex >= quizData.length) {
        showCustomAlert("Chúc mừng! Chuyên gia đã hoàn thành xuất sắc trò chơi tranh biện y sinh!", "🎉", "Hoàn thành thử thách");
        goToSlide(5);
        return;
      }
      
      const currentQ = quizData[currentQuestionIndex];
      questionText.textContent = currentQ.q;
      expText.classList.add('hidden');
      
      choiceButtons.forEach(b => b.classList.remove('hidden'));
      nextQBtn.classList.add('hidden');
      
      const dots = document.querySelectorAll('.quiz-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentQuestionIndex) {
          dot.classList.add('active');
          dot.style.background = 'var(--accent-mint)';
          dot.style.borderColor = 'var(--accent-mint)';
        } else if (idx < currentQuestionIndex) {
          dot.classList.remove('active');
          dot.style.background = 'rgba(49, 151, 149, 0.4)';
          dot.style.borderColor = 'rgba(49, 151, 149, 0.4)';
        } else {
          dot.classList.remove('active');
          dot.style.background = '';
          dot.style.borderColor = '';
        }
      });
    });
  }

  function resetQuizGame() {
    currentQuestionIndex = 0;
    
    const choiceButtons = document.querySelectorAll('.quiz-choice-btn');
    const nextQBtn = document.getElementById('next-question-btn');
    const questionText = document.getElementById('quiz-question-text');
    const expText = document.getElementById('quiz-explanation-text');
    
    if (questionText) questionText.textContent = quizData[0].q;
    if (expText) expText.classList.add('hidden');
    
    choiceButtons.forEach(b => b.classList.remove('hidden'));
    if (nextQBtn) {
      nextQBtn.classList.add('hidden');
      nextQBtn.innerHTML = 'Câu tiếp theo <i class="fa-solid fa-arrow-right"></i>';
    }
    
    const dots = document.querySelectorAll('.quiz-dot');
    dots.forEach((dot, idx) => {
      if (idx === 0) {
        dot.classList.add('active');
        dot.style.background = 'var(--accent-mint)';
        dot.style.borderColor = 'var(--accent-mint)';
      } else {
        dot.classList.remove('active');
        dot.style.background = '';
        dot.style.borderColor = '';
      }
    });
  }

  // ==========================================================================
  // HĐ2 AUDIT REHEARSAL CHECKLIST LOGIC (4 items - USER REQUEST)
  // ==========================================================================
  function setupAuditChecklist() {
    const checks = [
      document.getElementById('audit-check-1'),
      document.getElementById('audit-check-2'),
      document.getElementById('audit-check-3'),
      document.getElementById('audit-check-4')
    ];
    
    const stamp = document.getElementById('approved-stamp-badge');
    
    const updateStamp = () => {
      let allChecked = true;
      checks.forEach(c => {
        if (!c.checked) allChecked = false;
      });
      
      if (allChecked) {
        stamp.style.opacity = '1';
        stamp.classList.add('stamped');
        stamp.style.color = '#e53e3e';
        stamp.style.borderColor = '#e53e3e';
      } else {
        stamp.style.opacity = '0.15';
        stamp.classList.remove('stamped');
      }
    };
    
    checks.forEach(c => {
      if (c) c.addEventListener('change', updateStamp);
    });
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
  // HĐ3 PODIUM VINH DANH LOGIC
  // ==========================================================================
  function setupPodiumLogic() {
    const input1 = document.getElementById('podium-input-1');
    const input2 = document.getElementById('podium-input-2');
    const input3 = document.getElementById('podium-input-3');
    
    const display1 = document.getElementById('display-name-1');
    const display2 = document.getElementById('display-name-2');
    const display3 = document.getElementById('display-name-3');
    
    input1.addEventListener('input', () => {
      display1.textContent = input1.value.trim() || 'CÚP VÀNG';
    });
    
    input2.addEventListener('input', () => {
      display2.textContent = input2.value.trim() || 'CÚP BẠC';
    });
    
    input3.addEventListener('input', () => {
      display3.textContent = input3.value.trim() || 'CÚP ĐỒNG';
    });
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  function setupCertificate() {
    const certInput = document.getElementById('cert-student-name');
    const certPreviewName = document.getElementById('cert-preview-name');
    const printBtn = document.getElementById('print-cert-btn');
    
    if (certInput && certPreviewName) {
      certInput.addEventListener('input', () => {
        const val = certInput.value.trim();
        certPreviewName.textContent = val || "[ Họ và tên học sinh ]";
      });
    }
    
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        const val = certInput ? certInput.value.trim() : '';
        if (!val) {
          showCustomAlert("Vui lòng đăng ký họ và tên học sinh trước khi in chứng chỉ tốt nghiệp!", "⚠️", "Thiếu họ tên");
          return;
        }
        window.print();
      });
    }
  }

  initProgressDots();
  setupTimers();
  setupQuizGame();
  setupAuditChecklist();
  setupDiscussionCards();
  setupPodiumLogic();
  setupCertificate();
  
  updateTeacherGuideContent(0);
});