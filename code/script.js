document.addEventListener('DOMContentLoaded', function() {
    console.log('ウェブサイトが正常に読み込まれました！');

    // --- 1. ヘッダー タイピングアニメーション (TypeIt.js) ---
    const subtitleElement = document.getElementById('header-subtitle');
    if (subtitleElement && typeof TypeIt !== 'undefined') {
        new TypeIt('#header-subtitle', {
            strings: ["令和5年税理士試験合格", "日商簿記1級", "Excel VBA", "Python", "夢を教えてください！"],
            speed: 75, // タイピング速度
            breakLines: false, // 改行しない
            waitUntilVisible: true, // 要素が見えるまで待機
            lifeLike: true, // 自然なタイピング
            loop: true, // ループ再生
            loopDelay: 3000 // ループ間の待機時間
        }).go();
    } else {
        console.error('TypeIt library not found or subtitle element missing.');
    }


    // --- 2. 画像スライドショー ---
    const slideshowContainer = document.querySelector('#slideshow .slideshow-container');
    if (slideshowContainer) {
        const images = slideshowContainer.querySelectorAll('.slide-image');
        const prevButton = slideshowContainer.querySelector('.slide-prev');
        const nextButton = slideshowContainer.querySelector('.slide-next');
        const dotsContainer = slideshowContainer.querySelector('.slide-dots');
        let currentIndex = 0;
        const intervalTime = 4000; // 画像切り替え間隔 (4秒)
        let slideInterval;

        // ドットインジケーターを生成
        if (dotsContainer && images.length > 0) {
            images.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('slide-dot');
                dot.setAttribute('data-index', index);
                if (index === 0) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    showSlide(index);
                    resetInterval(); // 手動操作したらタイマーリセット
                });
                dotsContainer.appendChild(dot);
            });
        }
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.slide-dot') : [];

        // スライド表示関数
        function showSlide(index) {
            if (index >= images.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = images.length - 1;
            } else {
                currentIndex = index;
            }

            // 画像の表示切り替え
            images.forEach((image, i) => {
                if (i === currentIndex) {
                    image.classList.add('active');
                } else {
                    image.classList.remove('active');
                }
            });

            // ドットの表示切り替え
            if (dots.length > 0) {
                dots.forEach((dot, i) => {
                    if (i === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }

        // 次のスライドへ
        function nextSlide() {
            showSlide(currentIndex + 1);
        }

        // 前のスライドへ
        function prevSlide() {
            showSlide(currentIndex - 1);
        }

        // 自動再生開始
        function startInterval() {
             // 画像が1枚以下の場合は自動再生しない
            if (images.length <= 1) return;
            // 既にタイマーが動いていればクリア
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, intervalTime);
        }

        // 自動再生リセット
        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        // ボタンイベントリスナー
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });
        }
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }

        // 初期表示と自動再生開始
        if (images.length > 0) {
           showSlide(currentIndex); // 最初の画像を表示
           startInterval(); // 自動再生開始
        }
         // 画像が1枚以下の場合はボタンとドットを隠す
        if (images.length <= 1) {
            if(prevButton) prevButton.style.display = 'none';
            if(nextButton) nextButton.style.display = 'none';
            if(dotsContainer) dotsContainer.style.display = 'none';
        }

    } // end if slideshowContainer


    // --- 3. スムーズスクロール ---
    document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                // getBoundingClientRect().top はビューポートの上端からの距離
                // window.pageYOffset は現在のスクロール量
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10; // ヘッダー分のオフセットと少し余裕

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- 4. スクロールアニメーション (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // 一度表示したら監視を停止
                }
            });
        }, {
            rootMargin: "0px 0px -50px 0px", // ビューポートの下端より50px早く反応させる
            threshold: 0 // 少しでも見えたら
        });

        animatedElements.forEach((el, index) => {
             // CSSカスタムプロパティでインデックスを設定 (遅延アニメーション用)
             el.style.setProperty('--item-index', index);
             observer.observe(el);
        });
    } else {
        // IntersectionObserver未対応ブラウザ向けのフォールバック (全要素表示)
        animatedElements.forEach(el => {
            el.classList.add('visible');
        });
    }

}); // End DOMContentLoaded