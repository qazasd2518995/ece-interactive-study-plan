// 學期按鈕和內容管理
document.addEventListener('DOMContentLoaded', function() {
    const semesterButtons = document.querySelectorAll('.semester-btn');
    const semesterContents = document.querySelectorAll('.semester-content');
    
    // 學期配色方案
    const semesterThemes = {
        1: { primary: '#667eea', secondary: '#764ba2' },
        2: { primary: '#11998e', secondary: '#38ef7d' },
        3: { primary: '#fc466b', secondary: '#3f5efb' },
        4: { primary: '#ff6b35', secondary: '#f7931e' }
    };
    
    // 學期學分數據 (電子工程學系)
    const semesterCredits = {
        1: 13,
        2: 13,
        3: 13,
        4: 13
    };
    
    // 初始化頁面
    function initializePage() {
        // 設置總學分
        document.getElementById('totalCredits').textContent = 
            Object.values(semesterCredits).reduce((sum, credits) => sum + credits, 0);
        
        // 設置第一學期為默認活躍狀態
        switchSemester(1);
        
        // 為每個按鈕添加鍵盤快捷鍵
        addKeyboardShortcuts();
        
        // 添加觸控手勢支援
        addTouchGestureSupport();
    }
    
    // 切換學期
    function switchSemester(semesterNumber) {
        // 更新按鈕狀態
        semesterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.semester) === semesterNumber) {
                btn.classList.add('active');
            }
        });
        
        // 更新內容顯示
        semesterContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `semester-${semesterNumber}`) {
                content.classList.add('active');
            }
        });
        
        // 更新背景主題
        updateBackgroundTheme(semesterNumber);
        
        // 更新動態顏色
        updateDynamicColors(semesterNumber);
        
        // 播放切換音效（如果需要）
        playTransitionSound();
    }
    
    // 更新背景主題
    function updateBackgroundTheme(semesterNumber) {
        document.body.className = `semester-${semesterNumber}`;
    }
    
    // 更新動態顏色
    function updateDynamicColors(semesterNumber) {
        const theme = semesterThemes[semesterNumber];
        const root = document.documentElement;
        
        // 更新CSS變數
        root.style.setProperty('--current-primary', theme.primary);
        root.style.setProperty('--current-secondary', theme.secondary);
        
        // 更新活躍按鈕的顏色
        const activeBtn = document.querySelector(`.semester-btn[data-semester="${semesterNumber}"]`);
        if (activeBtn) {
            activeBtn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
        }
        
        // 更新當前學期的進度條顏色
        const progressFill = document.querySelector(`#semester-${semesterNumber} .progress-fill`);
        if (progressFill) {
            progressFill.style.background = `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`;
        }
        
        // 更新當前學期的學分徽章顏色
        const creditsBadges = document.querySelectorAll(`#semester-${semesterNumber} .credits-badge`);
        creditsBadges.forEach(badge => {
            badge.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
        });
        
        // 更新當前學期的圖標顏色
        const experienceIcons = document.querySelectorAll(`#semester-${semesterNumber} .course-experience i`);
        experienceIcons.forEach(icon => {
            if (!icon.closest('.no-experience')) {
                icon.style.color = theme.primary;
            }
        });
        
        // 更新當前學期卡片的頂部邊框
        const courseCards = document.querySelectorAll(`#semester-${semesterNumber} .course-card`);
        courseCards.forEach(card => {
            card.style.setProperty('--card-border-color', theme.primary);
        });
    }
    
    // 播放切換音效
    function playTransitionSound() {
        // 創建音效（可選）
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // 如果音效不支援，靜默處理
        }
    }
    
    // 添加鍵盤快捷鍵支援
    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // 數字鍵 1-4 切換學期
            if (e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                switchSemester(parseInt(e.key));
            }
            
            // 左右箭頭鍵切換學期
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const currentSemester = parseInt(document.querySelector('.semester-btn.active').dataset.semester);
                let nextSemester;
                
                if (e.key === 'ArrowLeft') {
                    nextSemester = currentSemester > 1 ? currentSemester - 1 : 4;
                } else {
                    nextSemester = currentSemester < 4 ? currentSemester + 1 : 1;
                }
                
                switchSemester(nextSemester);
            }
        });
    }
    
    // 添加觸控手勢支援
    function addTouchGestureSupport() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', function(e) {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // 檢查是否為水平滑動
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const currentSemester = parseInt(document.querySelector('.semester-btn.active').dataset.semester);
                let nextSemester;
                
                if (diffX > 0) {
                    // 向左滑動 - 下一學期
                    nextSemester = currentSemester < 4 ? currentSemester + 1 : 1;
                } else {
                    // 向右滑動 - 上一學期
                    nextSemester = currentSemester > 1 ? currentSemester - 1 : 4;
                }
                
                switchSemester(nextSemester);
            }
            
            // 重置觸控點
            startX = 0;
            startY = 0;
        });
    }
    
    // 為學期按鈕添加點擊事件
    semesterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const semesterNumber = parseInt(this.dataset.semester);
            switchSemester(semesterNumber);
        });
        
        // 添加鍵盤導航支援
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const semesterNumber = parseInt(this.dataset.semester);
                switchSemester(semesterNumber);
            }
        });
    });
    
    // 添加課程卡片的互動效果
    function addCourseCardInteractions() {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            // 滑鼠懸停效果增強
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-12px) scale(1.02)';
                this.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.2)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            });
            
            // 點擊效果
            card.addEventListener('click', function() {
                this.style.transform = 'translateY(-8px) scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-12px) scale(1.02)';
                }, 150);
            });
        });
    }
    
    // 添加平滑滾動效果
    function addSmoothScrolling() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // 添加載入動畫
    function addLoadingAnimation() {
        const elements = document.querySelectorAll('.course-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100); // 錯開動畫時間
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    // 添加學期統計功能
    function addSemesterStatistics() {
        // 計算並顯示各學期的課程數量
        semesterContents.forEach(content => {
            const semesterNumber = content.id.split('-')[1];
            const courseCount = content.querySelectorAll('.course-card').length;
            const credits = semesterCredits[semesterNumber];
            
            // 可以在這裡添加統計顯示邏輯
            console.log(`第${semesterNumber}學期: ${courseCount}門課程, ${credits}學分`);
        });
    }
    
    // 錯誤處理
    function handleErrors() {
        window.addEventListener('error', function(e) {
            console.error('頁面錯誤:', e.error);
        });
        
        // 檢查瀏覽器兼容性
        if (!window.CSS || !CSS.supports('backdrop-filter', 'blur(10px)')) {
            console.warn('瀏覽器不支援某些視覺效果');
            // 可以添加回退樣式
        }
    }
    
    // 初始化所有功能
    initializePage();
    addCourseCardInteractions();
    addSmoothScrolling();
    addLoadingAnimation();
    addSemesterStatistics();
    handleErrors();
    
    // 顯示鍵盤快捷鍵提示（可選）
    console.log('🎓 電子工程學系雙主修修業計劃');
    console.log('📱 快捷鍵: 數字鍵 1-4 切換學期，左右箭頭鍵導航');
    console.log('👆 觸控: 左右滑動切換學期');
    console.log('⚡ 總學分: 52學分 (每學期13學分)');
});

// 添加 CSS 動畫類別
const style = document.createElement('style');
style.textContent = `
    .initial-animation {
        animation: courseCardSlideIn 0.6s ease-out both;
    }
    
    @keyframes courseCardSlideIn {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin-left: -10px;
        margin-top: -10px;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .in-view {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    /* 平滑過渡 */
    .semester-content {
        transition: all 0.3s ease;
    }
    
    /* 無障礙支援 */
    .semester-btn:focus {
        outline: 3px solid #667eea;
        outline-offset: 2px;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

document.head.appendChild(style); 