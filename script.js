document.addEventListener("DOMContentLoaded", function() {
    const rpiButton = document.getElementById('rpi-button');
    const lcdMenu = document.getElementById('lcd-menu');
    const menuItems = document.querySelectorAll('.lcd-screen li');
    const displayContent = document.getElementById('display-content');
    const displayArea = document.getElementById('display-area');
    const logo = document.querySelector('.logo');
    const ledAct = document.getElementById('led-act');

    function simulateLedActivity(durationMs) {
        if(!ledAct) return;
        const endTime = Date.now() + durationMs;
        function blink() {
            if (Date.now() > endTime) {
                ledAct.classList.remove('led-active');
                return;
            }
            if (Math.random() > 0.4) {
                ledAct.classList.add('led-active');
            } else {
                ledAct.classList.remove('led-active');
            }
            setTimeout(blink, 30 + Math.random() * 50);
        }
        blink();
    }
    
    function resetToInitialState() {
        displayContent.classList.add('fade-out');
        setTimeout(() => {
            displayContent.innerHTML = `
                <div class="initial-message glass-card">
                    <i class="fas fa-terminal" style="font-size: 2rem; color: var(--accent-gold); margin-bottom: 1rem;"></i>
                    <p>System Ready. Please press the red button on the Raspberry Pi board to load modules.</p>
                </div>
            `;
            displayContent.classList.remove('fade-out');
        }, 400);
        
        // Remove active highlights from menu
        menuItems.forEach(i => i.classList.remove('active'));
    }

    // Logo click resets everything
    if(logo) {
        logo.addEventListener('click', function(e) {
            // Let the href="#" naturally scroll to top, just reset the content
            resetToInitialState();
            lcdMenu.classList.remove('active');
        });
    }

    // Toggle LCD Menu when RPi button is clicked
    rpiButton.addEventListener('click', function() {
        simulateLedActivity(300);
        const isActive = lcdMenu.classList.toggle('active');
        if (!isActive) {
            resetToInitialState();
        }
    });

    // Handle Menu Selection (Inject content and scroll down)
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the target section ID
            const targetId = this.getAttribute('data-target');
            
            // Simulate processing activity
            simulateLedActivity(600);
            
            // Fade out current content
            displayContent.classList.add('fade-out');
            
            setTimeout(() => {
                // Get the HTML content from the hidden template section
                const template = document.getElementById(targetId);
                
                if(template) {
                    displayContent.innerHTML = template.outerHTML;
                    
                    // Allow browser to register the DOM change before fading back in
                    setTimeout(() => {
                        displayContent.classList.remove('fade-out');
                        
                        // Scroll down smoothly to display area
                        displayArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        
                    }, 50);
                }
            }, 400); // Matches the CSS transition duration
            
            // Close the menu after clicking
            lcdMenu.classList.remove('active');
        });
    });
});
