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
      prep: "Màn hình chiếu sẵn sàng, giáo án, nhạc nền y khoa nhẹ nhàng.",
      steps: [
        "GV ổn định lớp học và giới thiệu vai trò mới của ngày hôm nay.",
        "GV: <strong>Chào mừng các Bác sĩ cộng đồng!</strong> Ở Tiết 1 chúng ta đã khám bệnh cho cá nhân. Hôm nay chúng ta giúp thay đổi cho cả cộng đồng.",
        "Đọc to câu hỏi lớn (Big Question) và đặt vấn đề cho bài học."
      ],
      notes: "Tạo không khí trang trọng, kích thích sự hứng thú nhập vai bác sĩ cộng đồng."
    },
    // Slide 2 (Tên HĐ1)
    {
      duration: "1 phút",
      prep: "Mở slide có hình ảnh nhân vật cảnh báo.",
      steps: [
        "GV giới thiệu tên hoạt động 1: <strong>GAME: GIẢI CỨU CHIỀU CAO</strong>.",
        "GV chỉ vào nhân vật có nguy cơ thấp còi trên màn hình và giải thích nhiệm vụ."
      ],
      notes: "Sử dụng giọng điệu khẩn trương của bác sĩ cứu người để thu hút chú ý."
    },
    // Slide 3 (Chuẩn bị HĐ1)
    {
      duration: "1 - 2 phút",
      prep: "Mỗi học sinh chuẩn bị sẵn 1 Thẻ xanh 🟢 và 1 Thẻ đỏ 🔴 trên bàn.",
      steps: [
        "GV yêu cầu học sinh kiểm tra đồ dùng trên bàn học.",
        "GV xác nhận hình thức hoạt động: <strong>Cá nhân</strong>."
      ],
      notes: "Đảm bảo 100% học sinh đều có đủ thẻ trước khi bắt đầu chơi game."
    },
    // Slide 4 (Luật chơi HĐ1)
    {
      duration: "1 - 2 phút",
      prep: "Slide mô tả luật chơi.",
      steps: [
        "GV giải thích ngắn gọn luật chơi 3 bước: Nhìn tình huống -> Giơ nhanh thẻ màu -> Sẵn sàng giải thích.",
        "Bắt đầu khởi động <strong>Đồng hồ đếm ngược 8:00</strong>."
      ],
      notes: "Nhấn mạnh phần giải thích để củng cố kiến thức y học cốt lõi từ Tiết 1."
    },
    // Slide 5 (Game tương tác HĐ1)
    {
      duration: "3 - 4 phút",
      prep: "Bảng phân loại thói quen kéo thả hoặc click chọn.",
      steps: [
        "GV điều phối trò chơi: Lần lượt đọc to các thói quen.",
        "Yêu cầu HS giơ thẻ phản xạ. Click hoặc kéo các thẻ vào đúng cột Có lợi (🟢) hoặc Cản trở (🔴) để chốt đáp án.",
        "Đáp án: Sữa và Thể thao ➔ 🟢; Snack, Thức khuya và Lười vận động ➔ 🔴."
      ],
      notes: "Khen ngợi các lập luận y khoa chính xác (như hormone GH, canxi sụn) từ học sinh."
    },
    // Slide 6 (Tổng kết HĐ1)
    {
      duration: "1 phút",
      prep: "Hiển thị thông điệp tổng kết khởi động.",
      steps: [
        "GV đọc to thông điệp tổng kết y khoa.",
        "Chốt vấn đề: Thói quen xấu xung quanh rất phổ biến, hôm nay các bác sĩ cộng đồng sẽ giúp thay đổi điều này."
      ],
      notes: "Chuyển tiếp nhịp nhàng sang hoạt động 2 bằng cách dẫn dắt vào nhiệm vụ cộng đồng."
    },
    // Slide 7 (Tên HĐ2)
    {
      duration: "1 phút",
      prep: "Mở slide giới thiệu hoạt động 2.",
      steps: [
        "GV giới thiệu hoạt động 2: <strong>KHẢO SÁT THỰC TRẠNG & PHÂN TÍCH NGUY CƠ</strong>.",
        "GV: Các bác sĩ cộng đồng hãy nhận nhiệm vụ phân tích thực trạng thói quen xấu của cộng đồng."
      ],
      notes: "Tăng tính chân thực, dẫn dắt học sinh vào hoạt động nhóm khảo sát y tế."
    },
    // Slide 8 (Chuẩn bị HĐ2)
    {
      duration: "1 phút",
      prep: "Chia nhóm 4 học sinh, chuẩn bị Phiếu khảo sát và hồ sơ Tiết 1.",
      steps: [
        "GV điều phối học sinh nhanh chóng ổn định theo nhóm 4 người.",
        "Nhóm trưởng kiểm tra học liệu: Phiếu khảo sát, hồ sơ 5 bệnh án."
      ],
      notes: "Hạn chế làm ồn khi chuyển trạng thái nhóm."
    },
    // Slide 9 (Hướng dẫn HĐ2)
    {
      duration: "1 - 2 phút",
      prep: "Slide các bước khảo sát nhóm.",
      steps: [
        "GV hướng dẫn các nhóm làm việc chung để phân loại các thói quen xấu vào 3 cột trên phiếu.",
        "GV bắt đầu chạy <strong>Đồng hồ đếm ngược 15:00</strong> trên màn hình.",
        "Hướng dẫn học sinh thảo luận câu hỏi hậu quả y sinh khi duy trì thói quen xấu."
      ],
      notes: "GV đi xung quanh quan sát, hỗ trợ các nhóm thảo luận."
    },
    // Slide 10 (Dữ liệu khảo sát & Highlight)
    {
      duration: "4 - 5 phút",
      prep: "Bảng 5 tab hồ sơ dữ liệu.",
      steps: [
        "GV hướng dẫn học sinh đọc to dữ liệu khảo sát từ 5 ca bệnh.",
        "GV: Hãy chỉ diện các thói quen cản trở chiều cao của từng ca bệnh.",
        "Click chọn từng tab bệnh nhân. Click nút <strong>'Chỉ diện thói quen xấu'</strong> (hoặc nhấn <strong>Spacebar</strong>) để kích hoạt hiệu ứng tô nền vàng rực vào thói quen cản trở chiều cao."
      ],
      notes: "Rào chắn kỹ thuật bắt buộc. Kích hoạt highlight để học sinh dễ nhận thấy thực trạng lỗi."
    },
    // Slide 11 (Thảo luận hội chẩn cộng đồng)
    {
      duration: "3 phút",
      prep: "Mở slide thảo luận hậu quả.",
      steps: [
        "GV hỏi học sinh: <strong>Nếu duy trì thói quen cản trở này kéo dài thì sao?</strong>",
        "Click vào từng câu hỏi để hiển thị lý giải y học y sinh sau khi học sinh trả lời."
      ],
      notes: "Định hướng học sinh trả lời bằng các thuật ngữ khoa học (xốp xương, sụn đầu xương chây lì, giảm hormone GH)."
    },
    // Slide 12 (Bảng đối chiếu nguy cơ - Đáp án HĐ2)
    {
      duration: "3 phút",
      prep: "Bảng đối chiếu hậu quả y khoa dạng Table.",
      steps: [
        "GV chốt đáp án hậu quả chuẩn y khoa dưới dạng Bảng đối chiếu cột rõ ràng.",
        "Giải thích cơ chế xốp xương do nước ngọt, thiếu hormone tăng trưởng GH do thức khuya, sụn chây lì do lười vận động."
      ],
      notes: "Học sinh hoàn thiện phiếu nhóm dựa trên bảng đối chiếu khoa học này."
    },
    // Slide 13 (Tổng kết HĐ2)
    {
      duration: "1 - 2 phút",
      prep: "Slide tổng kết 3 chìa khóa vàng.",
      steps: [
        "GV chốt 3 chìa khóa sức khỏe: Dinh dưỡng (Viên gạch), Giấc ngủ (Mặt trời), Vận động (Lực kéo).",
        "Nhấn mạnh tầm quan trọng của việc thay đổi thói quen cho cả tập thể."
      ],
      notes: "Yêu cầu học sinh ghi nhận 3 chìa khóa vàng này vào sổ tay của mình."
    },
    // Slide 14 (Tên HĐ3)
    {
      duration: "1 phút",
      prep: "Mở slide giới thiệu hoạt động 3.",
      steps: [
        "GV giới thiệu hoạt động 3: <strong>THIẾT KẾ POSTER TRUYỀN THÔNG</strong>.",
        "Thông báo nhiệm vụ thiết kế Poster giúp thay đổi hành vi cộng đồng."
      ],
      notes: "Tạo cảm hứng sáng tạo nghệ thuật kết hợp kiến thức y học."
    },
    // Slide 15 (Chuẩn bị HĐ3)
    {
      duration: "1 phút",
      prep: "Chuẩn bị giấy A3/A2, bút màu, thước kẻ cho các nhóm.",
      steps: [
        "GV yêu cầu các nhóm nhận dụng cụ vẽ và giấy khổ lớn.",
        "Xác nhận hình thức hoạt động: Nhóm y khoa 4 người."
      ],
      notes: "Phân phát học liệu nhanh chóng, trật tự."
    },
    // Slide 16 (Hướng dẫn HĐ3)
    {
      duration: "2 phút",
      prep: "Slide công thức thiết kế poster.",
      steps: [
        "GV giải thích công thức thiết kế Poster chuẩn y khoa: Vấn đề (Sai) -> Hậu quả -> Giải pháp (Đúng).",
        "GV bắt đầu <strong>Đồng hồ đếm ngược 12:00</strong> để các nhóm vẽ poster."
      ],
      notes: "Nhấn mạnh poster y học cần thông tin khoa học chính xác, chữ slogan to dễ đọc lướt."
    },
    // Slide 17 (Kiểm tra Quy Chuẩn & Chấm điểm - USER REQUEST)
    {
      duration: "3 phút",
      prep: "Bảng kiểm đánh giá poster và bộ điều khiển chấm điểm y tế.",
      steps: [
        "GV yêu cầu các nhóm tự đánh giá chéo poster của nhau theo 5 tiêu chí trên bảng kiểm.",
        "GV dùng bộ nút cộng/trừ để cho điểm từ 0 đến 10 dựa trên chất lượng poster.",
        "Nhập lời nhận xét và nhấn 'Nghiệm Thu & Lưu Điểm' để ghi nhận kết quả."
      ],
      notes: "Khuyến khích học sinh trao đổi lý do chấm điểm và nhận xét cụ thể về mặt khoa học."
    },
    // Slide 18 (Tổng kết HĐ3)
    {
      duration: "1 phút",
      prep: "Slide tổng kết quy chuẩn đánh giá poster.",
      steps: [
        "GV chốt: Poster y tế cộng đồng thành công khi thay đổi được nhận thức của người xem.",
        "Dẫn dắt sang hoạt động 4: Tự viết nhật ký cam kết hành động cá nhân để hỗ trợ cộng đồng."
      ],
      notes: "Chuẩn bị học sinh quay lại làm việc cá nhân."
    },
    // Slide 19 (Tên HĐ4)
    {
      duration: "1 phút",
      prep: "Mở slide giới thiệu hoạt động 4.",
      steps: [
        "GV giới thiệu hoạt động 4: <strong>NHẬT KÝ BÁC SĨ CỘNG ĐỒNG</strong>.",
        "GV: Mỗi bác sĩ sau khi thiết kế chiến dịch cần viết nhật ký suy ngẫm phòng bệnh."
      ],
      notes: "Kêu gọi tinh thần tự giác, kỷ luật cá nhân."
    },
    // Slide 20 (Chuẩn bị HĐ4)
    {
      duration: "1 phút",
      prep: "Mở sổ tay mini tự làm ở Tiết 1, chuẩn bị viết.",
      steps: [
        "GV yêu cầu học sinh mở sổ tay mini cá nhân của mình ra.",
        "Xác nhận hình thức hoạt động: Cá nhân độc lập."
      ],
      notes: "Tạo không khí làm việc tĩnh lặng, suy ngẫm."
    },
    // Slide 21 (Hướng dẫn HĐ4)
    {
      duration: "2 - 3 phút",
      prep: "Slide câu hỏi suy ngẫm nhật ký.",
      steps: [
        "GV hướng sau học sinh trả lời 2 câu hỏi định hướng suy ngẫm vào sổ tay.",
        "GV bấm bắt đầu <strong>Đồng hồ đếm ngược 08:00</strong>.",
        "Khuyên học sinh dùng bút màu để làm nổi bật các từ khóa y học."
      ],
      notes: "Hỗ trợ học sinh trong việc diễn đạt ý kiến suy ngẫm."
    },
    // Slide 22 (Bản cam kết - Đáp án HĐ4)
    {
      duration: "2 phút",
      prep: "Slide bản cam kết hành động tuần tới.",
      steps: [
        "GV yêu cầu học sinh tích chọn phương án cam kết trong sổ tay hoặc trên slide.",
        "Hướng dẫn học sinh ký tên xác nhận vai trò Bác sĩ cộng đồng hành động."
      ],
      notes: "Giúp học sinh tự tin vào khả năng lan tỏa lối sống lành mạnh đến bạn bè."
    },
    // Slide 23 (Tổng kết Tiết 2)
    {
      duration: "2 phút",
      prep: "Slide chúc mừng hoàn thành nhiệm vụ.",
      steps: [
        "GV chúc mừng các nhóm đã xuất sắc hoàn thành nhiệm vụ Bác sĩ cộng đồng.",
        "Đọc to thông báo kết thúc Tiết 2 và mở ra hướng đi cho Tiết 3 (Lan tỏa sức khỏe).",
        "GV click nút Khởi động lại nếu muốn thực hiện lại ca trực."
      ],
      notes: "Tôn vinh nỗ lực của học sinh và tạo sự mong đợi cho tiết học tiếp theo."
    }
  ];

  // ==========================================================================
  // SLIDE NAV ENGINE
  // ==========================================================================
  
  // Create progress dots dynamically (23 dots)
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
    
    // Update teacher guide content for current slide
    updateTeacherGuideContent(currentSlideIndex);
  }

  // Update dots and buttons state
  function updateSlideControlsUI() {
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
      currentStageDisplay.textContent = "TIẾT 2: BÁC SĨ CỘNG ĐỒNG";
    } else if (currentSlideIndex === totalSlides - 1) {
      currentStageDisplay.textContent = "HOÀN THÀNH CHIẾN DỊCH";
    } else {
      currentStageDisplay.textContent = `BÁC SĨ CỘNG ĐỒNG: ${stageName.toUpperCase()}`;
    }
  }

  // Update teacher guide drawer text dynamically
  function updateTeacherGuideContent(slideIndex) {
    const data = teacherGuideData[slideIndex];
    if (!data) return;
    
    document.getElementById('g-act-name').textContent = slides[slideIndex].getAttribute('data-stage') || 'Bài học';
    document.getElementById('g-act-time').textContent = data.duration;
    document.getElementById('g-prep-details').textContent = data.prep;
    document.getElementById('g-notes-details').innerHTML = data.notes;
    
    // Render steps list
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
      // Spacebar highlights bad habits on Slide 10 (HĐ2 Case records)
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

  // Action buttons events
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

  // Reset lecture state
  function resetLectureData() {
    localStorage.removeItem('t2-commitments');
    localStorage.removeItem('t2-poster-score');
    localStorage.removeItem('t2-poster-feedback');
    
    // Reset check boxes
    document.getElementById('v-commit-ad1').checked = false;
    document.getElementById('v-commit-ad2').checked = false;
    document.getElementById('v-commit-ad3').checked = false;
    document.getElementById('v-sig-display2').textContent = "Bác Sĩ Cộng Đồng";
    
    // Reset poster audit checklist
    document.getElementById('post-check-1').checked = false;
    document.getElementById('post-check-2').checked = false;
    document.getElementById('post-check-3').checked = false;
    document.getElementById('post-check-4').checked = false;
    document.getElementById('post-check-5').checked = false;
    document.getElementById('check-status-badge').style.display = 'none';
    
    // Reset score grading
    scoreValue = 0;
    document.getElementById('score-display-val').textContent = '0';
    document.getElementById('grading-comment').value = '';
    
    // Hide diagnostic answers
    document.querySelectorAll('.diag-answer').forEach(ans => ans.classList.add('hidden'));
    
    resetDragGame();
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

  // Theme Toggle (Light/Dark Mode)
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

  // Teacher Guide panel toggle
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
  // HĐ1 DRAG AND DROP / CLICK TO SORT LOGIC
  // ==========================================================================
  function setupDragGame() {
    const items = document.querySelectorAll('#drag-items .drag-item');
    const zoneGreen = document.getElementById('zone-green');
    const zoneRed = document.getElementById('zone-red');
    const checkBtn = document.getElementById('check-drag-btn');
    
    items.forEach(item => {
      item.addEventListener('click', () => {
        const currentParent = item.parentNode.id;
        if (currentParent === 'drag-items') {
          zoneGreen.appendChild(item);
          item.style.borderColor = 'rgba(49, 151, 149, 0.4)';
        } else if (currentParent === 'zone-green') {
          zoneRed.appendChild(item);
          item.style.borderColor = 'rgba(229, 62, 62, 0.4)';
        } else {
          document.getElementById('drag-items').appendChild(item);
          item.style.borderColor = '';
        }
      });
    });
    
    checkBtn.addEventListener('click', () => {
      let correct = true;
      
      const greenChildren = zoneGreen.querySelectorAll('.drag-item');
      greenChildren.forEach(child => {
        const type = child.getAttribute('data-type');
        if (type !== 'green') {
          correct = false;
          child.style.borderColor = 'var(--accent-red)';
          child.style.background = 'rgba(229,62,62,0.1)';
        } else {
          child.style.borderColor = 'var(--accent-mint)';
          child.style.background = 'rgba(49,151,149,0.1)';
        }
      });
      
      const redChildren = zoneRed.querySelectorAll('.drag-item');
      redChildren.forEach(child => {
        const type = child.getAttribute('data-type');
        if (type !== 'red') {
          correct = false;
          child.style.borderColor = 'var(--accent-red)';
          child.style.background = 'rgba(229,62,62,0.1)';
        } else {
          child.style.borderColor = 'var(--accent-mint)';
          child.style.background = 'rgba(49,151,149,0.1)';
        }
      });
      
      const poolItems = document.getElementById('drag-items').querySelectorAll('.drag-item');
      if (poolItems.length > 0) {
        correct = false;
        showCustomAlert("Bác sĩ vui lòng phân loại hết tất cả các thói quen trên bàn!");
        return;
      }
      
      if (correct) {
        showCustomAlert("Tuyệt vời! Bác sĩ đã phân loại hoàn toàn chính xác thói quen sức khỏe! ✅");
      } else {
        showCustomAlert("Có một vài thói quen phân loại chưa chính xác hoặc nhầm lẫn, hãy kiểm tra lại các hộp viền đỏ ❌");
      }
    });
  }

  function resetDragGame() {
    const items = document.querySelectorAll('#drag-items .drag-item, #zone-green .drag-item, #zone-red .drag-item');
    const pool = document.getElementById('drag-items');
    items.forEach(item => {
      pool.appendChild(item);
      item.style.borderColor = '';
      item.style.background = '';
    });
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
  // HĐ3 POSTER AUDIT CHECKLIST & GRADING (USER REQUEST)
  // ==========================================================================
  let scoreValue = 0;

  function setupPosterAuditGrading() {
    const checks = [
      document.getElementById('post-check-1'),
      document.getElementById('post-check-2'),
      document.getElementById('post-check-3'),
      document.getElementById('post-check-4'),
      document.getElementById('post-check-5')
    ];
    
    const badge = document.getElementById('check-status-badge');
    const plusBtn = document.getElementById('score-plus-btn');
    const minusBtn = document.getElementById('score-minus-btn');
    const scoreVal = document.getElementById('score-display-val');
    const submitBtn = document.getElementById('submit-grade-btn');
    const commentInput = document.getElementById('grading-comment');
    
    const updateChecklistStatus = () => {
      let allChecked = true;
      checks.forEach(c => {
        if (!c.checked) allChecked = false;
      });
      
      if (allChecked) {
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    };
    
    checks.forEach(c => {
      c.addEventListener('change', updateChecklistStatus);
    });
    
    // Grading controls
    plusBtn.addEventListener('click', () => {
      if (scoreValue < 10) {
        scoreValue++;
        scoreVal.textContent = scoreValue;
      }
    });
    
    minusBtn.addEventListener('click', () => {
      if (scoreValue > 0) {
        scoreValue--;
        scoreVal.textContent = scoreValue;
      }
    });
    
    submitBtn.addEventListener('click', () => {
      let allChecked = true;
      checks.forEach(c => {
        if (!c.checked) allChecked = false;
      });
      
      if (!allChecked) {
        showCustomAlert("Bác sĩ vui lòng kiểm tra và tích chọn đầy đủ 5 tiêu chí hợp quy chuẩn trước khi lưu điểm!");
        return;
      }
      
      const comment = commentInput.value.trim();
      if (!comment) {
        showCustomAlert("Bác sĩ vui lòng ghi lời nhận xét y khoa trước khi nghiệm thu!");
        commentInput.focus();
        return;
      }
      
      localStorage.setItem('t2-poster-score', scoreValue);
      localStorage.setItem('t2-poster-feedback', comment);
      
      showCustomAlert(`Nghiệm thu thành công! Poster được phê duyệt với số điểm: <strong>\${scoreValue}/10</strong>.<br>Nhận xét: <em>"\${comment}"</em>`, '📋', 'Nghiệm thu poster');
    });
  }

  // ==========================================================================
  // HĐ4 CAM KẾT
  // ==========================================================================
  function setupCommitmentBoxes() {
    const cAd1 = document.getElementById('v-commit-ad1');
    const cAd2 = document.getElementById('v-commit-ad2');
    const cAd3 = document.getElementById('v-commit-ad3');
    const sigDisplay2 = document.getElementById('v-sig-display2');
    
    const updateSig2 = () => {
      let checkedCount = 0;
      if (cAd1.checked) checkedCount++;
      if (cAd2.checked) checkedCount++;
      if (cAd3.checked) checkedCount++;
      
      if (checkedCount >= 3) {
        sigDisplay2.textContent = "Bác Sĩ Cộng Đồng Trưởng Nhóm";
        sigDisplay2.style.color = 'var(--accent-teal)';
      } else {
        sigDisplay2.textContent = "Bác Sĩ Cộng Đồng";
        sigDisplay2.style.color = '';
      }
    };
    
    cAd1.addEventListener('change', updateSig2);
    cAd2.addEventListener('change', updateSig2);
    cAd3.addEventListener('change', updateSig2);
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  initProgressDots();
  setupTimers();
  setupDragGame();
  setupPatientTabs();
  setupDiscussionCards();
  setupPosterAuditGrading();
  setupCommitmentBoxes();
  
  updateTeacherGuideContent(0);
});