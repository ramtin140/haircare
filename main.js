// Hair Care Routine Webapp - Main JavaScript
class HairCareApp {
    constructor() {
        this.currentDate = new Date();
        this.routineData = this.loadRoutineData();
        this.timers = {};
        this.notificationsEnabled = false;
        this.init();
    }

    init() {
        this.initializeAnimations();
        this.setupEventListeners();
        this.updateDailyDisplay();
        this.initializeTypedText();
        this.initializePWA();
        this.requestNotificationPermission();
        this.updateRealTimeDay();
        this.setupDailyReminders();
    }

    // Initialize PWA features
    initializePWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully');
                    this.showPWAPrompt();
                })
                .catch(error => {
                    console.log('Service Worker registration failed');
                });
        }
    }

    // Show PWA install prompt
    showPWAPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button
            const installBtn = document.createElement('div');
            installBtn.className = 'pwa-install-prompt';
            installBtn.innerHTML = `
                <div class="bg-green-800 text-white p-4 rounded-lg shadow-lg fixed bottom-4 right-4 left-4 z-50">
                    <div class="flex items-center justify-between">
                        <div class="persian-text">
                            <h4 class="font-bold">نصب برنامه مراقبت از موها</h4>
                            <p class="text-sm">برای دسترسی سریع‌تر و نوتیفیکیشن‌ها</p>
                        </div>
                        <div class="flex space-x-2">
                            <button id="install-pwa" class="bg-yellow-500 px-4 py-2 rounded-lg font-medium persian-text">
                                نصب
                            </button>
                            <button id="close-pwa-prompt" class="bg-gray-600 px-4 py-2 rounded-lg font-medium persian-text">
                                بستن
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(installBtn);
            
            document.getElementById('install-pwa').addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        this.showNotification('برنامه با موفقیت نصب شد!');
                    }
                    deferredPrompt = null;
                    installBtn.remove();
                });
            });
            
            document.getElementById('close-pwa-prompt').addEventListener('click', () => {
                installBtn.remove();
            });
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (installBtn.parentNode) {
                    installBtn.remove();
                }
            }, 10000);
        });
    }

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.notificationsEnabled = permission === 'granted';
            
            if (this.notificationsEnabled) {
                this.showNotification('نوتیفیکیشن‌ها فعال شدند!');
            }
        }
    }

    // Setup daily reminders
    setupDailyReminders() {
        // Morning reminder (8 AM)
        this.scheduleReminder(8, 0, 'صبح بخیر! زمان مصرف فیناستراید و شامپو است.');
        
        // Evening reminder (9 PM)
        this.scheduleReminder(21, 0, 'شب بخیر! زمان استفاده از تونیک و ماساژ سر است.');
        
        // Weekly treatment reminder (Saturday 8 PM for Minoxidil)
        if (new Date().getDay() === 0) { // Saturday
            this.scheduleReminder(20, 0, 'امشب زمان استفاده از فوم ماینوکسیدیل است!');
        }
    }

    // Schedule notification
    scheduleReminder(hour, minute, message) {
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(hour, minute, 0, 0);
        
        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }
        
        const timeUntilReminder = reminderTime.getTime() - now.getTime();
        
        setTimeout(() => {
            this.showNotification(message);
            // Repeat daily
            setInterval(() => {
                this.showNotification(message);
            }, 24 * 60 * 60 * 1000);
        }, timeUntilReminder);
    }

    // Show notification
    showNotification(message) {
        if (this.notificationsEnabled && 'serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification('مراقبت از موها', {
                    body: message,
                    icon: '/resources/hero-hair-care.png',
                    badge: '/resources/hero-hair-care.png',
                    vibrate: [100, 50, 100],
                    data: {
                        dateOfArrival: Date.now()
                    },
                    actions: [
                        {
                            action: 'open',
                            title: 'باز کردن برنامه'
                        }
                    ]
                });
            });
        }
    }

    // Update real-time day display
    updateRealTimeDay() {
        const today = new Date();
        const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
        const todayName = persianDays[today.getDay()];
        
        // Update any element showing current day
        const dayElements = document.querySelectorAll('.current-day');
        dayElements.forEach(el => {
            el.textContent = todayName;
        });
        
        // Highlight today in weekly calendar
        const todayIndex = today.getDay();
        const todayElement = document.querySelector(`[data-day="${todayIndex}"]`);
        if (todayElement) {
            todayElement.classList.add('today');
        }
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