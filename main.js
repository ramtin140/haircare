// Hair Care Routine Webapp - Main JavaScript
class HairCareApp {
    constructor() {
        this.currentDate = new Date();
        this.routineData = this.loadRoutineData();
        this.timers = {};
        this.init();
    }

    init() {
        this.initializeAnimations();
        this.setupEventListeners();
        this.updateDailyDisplay();
        this.initializeTypedText();
    }

    // Initialize text animations
    initializeTypedText() {
        if (document.getElementById('typed-text')) {
            new Typed('#typed-text', {
                strings: [
                    'مراقبت از موها',
                    'روال روزانه زیبایی',
                    'برنامه درمانی شما'
                ],
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }

    // Initialize visual animations
    initializeAnimations() {
        // Animate routine cards on load
        anime({
            targets: '.routine-card',
            translateY: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(200),
            duration: 800,
            easing: 'easeOutQuart'
        });

        // Animate progress bars
        anime({
            targets: '.progress-bar',
            width: '100%',
            duration: 1500,
            delay: 1000,
            easing: 'easeOutQuart'
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Routine checkboxes
        document.querySelectorAll('.routine-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleRoutineItem(e.target);
            });
        });

        // Timer buttons
        document.querySelectorAll('.timer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.startTimer(e.target.dataset.timer);
            });
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage(link.getAttribute('href'));
            });
        });

        // Weekly calendar interactions
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', (e) => {
                this.selectDay(e.target);
            });
        });
    }

    // Toggle routine item completion
    toggleRoutineItem(checkbox) {
        const itemId = checkbox.dataset.id;
        const isCompleted = checkbox.checked;
        
        // Update data
        this.routineData[this.getTodayKey()] = this.routineData[this.getTodayKey()] || {};
        this.routineData[this.getTodayKey()][itemId] = isCompleted;
        this.saveRoutineData();

        // Animate completion
        if (isCompleted) {
            this.celebrateCompletion(checkbox);
        }

        // Update progress
        this.updateProgress();
    }

    // Celebration animation for completed tasks
    celebrateCompletion(element) {
        // Create celebration particles
        const rect = element.getBoundingClientRect();
        const particles = [];
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            particle.style.left = rect.left + rect.width / 2 + 'px';
            particle.style.top = rect.top + rect.height / 2 + 'px';
            document.body.appendChild(particle);
            particles.push(particle);
        }

        // Animate particles
        anime({
            targets: particles,
            translateX: () => anime.random(-100, 100),
            translateY: () => anime.random(-100, 100),
            scale: [0, 1, 0],
            opacity: [1, 0],
            duration: 1000,
            easing: 'easeOutQuart',
            complete: () => {
                particles.forEach(p => p.remove());
            }
        });

        // Animate checkbox
        anime({
            targets: element.parentElement,
            scale: [1, 1.1, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });
    }

    // Start timer for treatments
    startTimer(timerType) {
        const duration = timerType === 'shampoo' ? 5 * 60 : 5 * 60; // 5 minutes
        const timerElement = document.querySelector(`[data-timer="${timerType}"]`);
        
        if (this.timers[timerType]) {
            clearInterval(this.timers[timerType]);
        }

        let timeLeft = duration;
        const display = timerElement.querySelector('.timer-display') || timerElement;
        
        this.timers[timerType] = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(this.timers[timerType]);
                this.timerComplete(timerType);
            }
            timeLeft--;
        }, 1000);

        // Visual feedback
        timerElement.classList.add('timer-active');
    }

    // Timer completion
    timerComplete(timerType) {
        const timerElement = document.querySelector(`[data-timer="${timerType}"]`);
        timerElement.classList.remove('timer-active');
        
        // Show completion message
        this.showNotification(`${timerType === 'shampoo' ? 'شامپو' : 'ماساژ'} به پایان رسید!`);
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        anime({
            targets: notification,
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutQuart'
        });

        setTimeout(() => {
            anime({
                targets: notification,
                translateY: [0, -50],
                opacity: [1, 0],
                duration: 500,
                easing: 'easeOutQuart',
                complete: () => notification.remove()
            });
        }, 3000);
    }

    // Update daily display
    updateDailyDisplay() {
        const today = this.getTodayKey();
        const todayData = this.routineData[today] || {};
        
        // Update checkboxes based on saved data
        Object.keys(todayData).forEach(itemId => {
            const checkbox = document.querySelector(`[data-id="${itemId}"]`);
            if (checkbox) {
                checkbox.checked = todayData[itemId];
            }
        });

        this.updateProgress();
    }

    // Update progress indicators
    updateProgress() {
        const today = this.getTodayKey();
        const todayData = this.routineData[today] || {};
        
        const totalItems = document.querySelectorAll('.routine-checkbox').length;
        const completedItems = Object.values(todayData).filter(Boolean).length;
        const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

        // Update progress bar
        const progressBar = document.querySelector('.progress-bar-fill');
        if (progressBar) {
            anime({
                targets: progressBar,
                width: `${percentage}%`,
                duration: 800,
                easing: 'easeOutQuart'
            });
        }

        // Update progress text
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${completedItems}/${totalItems} انجام شده`;
        }
    }

    // Get today's date key
    getTodayKey() {
        return this.currentDate.toISOString().split('T')[0];
    }

    // Load routine data from localStorage
    loadRoutineData() {
        const saved = localStorage.getItem('hairCareRoutine');
        return saved ? JSON.parse(saved) : {};
    }

    // Save routine data to localStorage
    saveRoutineData() {
        localStorage.setItem('hairCareRoutine', JSON.stringify(this.routineData));
    }

    // Navigate to different pages
    navigateToPage(href) {
        window.location.href = href;
    }

    // Get treatment for specific day
    getTreatmentForDay(dayIndex) {
        const treatments = {
            0: { type: 'minoxidil', text: 'فوم ماینوکسیدیل ۵٪' },
            1: { type: 'tonic', text: 'تونیک سریتا T2' },
            2: { type: 'minoxidil', text: 'فوم ماینوکسیدیل ۵٪' },
            3: { type: 'dermaroller', text: 'درمارولر ۰٫۵mm' },
            4: { type: 'minoxidil', text: 'فوم ماینوکسیدیل ۵٪' },
            5: { type: 'tonic', text: 'تونیک سریتا T2' },
            6: { type: 'dermaroller', text: 'درمارولر ۰٫۵mm' }
        };
        return treatments[dayIndex];
    }

    // Initialize progress charts
    initProgressCharts() {
        if (typeof echarts !== 'undefined' && document.getElementById('progress-chart')) {
            const chart = echarts.init(document.getElementById('progress-chart'));
            
            const option = {
                title: {
                    text: 'پیشرفت هفتگی',
                    textStyle: {
                        fontFamily: 'Vazirmatn',
                        fontSize: 18,
                        color: '#2D3748'
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
                    axisLabel: {
                        fontFamily: 'Vazirmatn'
                    }
                },
                yAxis: {
                    type: 'value',
                    max: 100,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                series: [{
                    data: this.getWeeklyProgress(),
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        color: '#1B4332'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(27, 67, 50, 0.3)'
                            }, {
                                offset: 1, color: 'rgba(27, 67, 50, 0.1)'
                            }]
                        }
                    }
                }]
            };
            
            chart.setOption(option);
        }
    }

    // Get weekly progress data
    getWeeklyProgress() {
        const progress = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - date.getDay() + i);
            const dateKey = date.toISOString().split('T')[0];
            const dayData = this.routineData[dateKey] || {};
            const completed = Object.values(dayData).filter(Boolean).length;
            const total = 4; // Total routine items per day
            progress.push(Math.round((completed / total) * 100));
        }
        return progress;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hairCareApp = new HairCareApp();
});

// Utility functions for Persian date formatting
function formatPersianDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Intl.DateTimeFormat('fa-IR', options).format(date);
}

function getPersianDayName(date) {
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    return days[date.getDay()];
}