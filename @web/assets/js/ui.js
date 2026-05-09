const UI = {
    toast(message, type = 'warning') {
        // Hapus toast lama
        const existing = document.getElementById('fintjam-toast');
        if (existing) existing.remove();

        // Buat wrapper — di-append terakhir ke body agar selalu paling atas secara DOM order
        const wrapper = document.createElement('div');
        wrapper.id = 'fintjam-toast';
        wrapper.style.cssText = `
            position: fixed;
            top: 72px;
            right: 16px;
            z-index: 2147483647;
            max-width: 320px;
            border: 2px solid #000;
            box-shadow: 4px 4px 0px #000;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: ${type === 'error' ? '#ffdad6' : '#d3e4fe'};
            transform: translateX(calc(100% + 2rem));
            transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
            isolation: isolate;
        `;

        wrapper.innerHTML = `
            <span style="font-family:'Material Symbols Outlined';font-size:20px;flex-shrink:0;color:#000;">warning</span>
            <p style="font-family:'Hanken Grotesk',sans-serif;font-weight:700;font-size:13px;line-height:1.4;color:#000;flex:1;">${message}</p>
            <button onclick="document.getElementById('fintjam-toast').remove()" style="font-family:'Material Symbols Outlined';font-size:18px;flex-shrink:0;background:none;border:none;cursor:pointer;color:#000;padding:0;">close</button>
        `;

        // Append terakhir ke body — DOM order menentukan siapa yang di depan
        document.body.appendChild(wrapper);

        // Slide in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                wrapper.style.transform = 'translateX(0)';
            });
        });

        // Auto hide setelah 5 detik
        setTimeout(() => {
            wrapper.style.transform = 'translateX(calc(100% + 2rem))';
            setTimeout(() => wrapper.remove(), 400);
        }, 5000);
    },

    updateBudgetAlerts(user, transactions) {
        const monthlyExpenses = transactions
            .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
            .reduce((sum, t) => sum + t.amount, 0);

        const percentage = (monthlyExpenses / user.monthlyLimit) * 100;
        
        if (percentage >= 100) {
            this.toast('Limit pengeluaran Anda telah tercapai 100%!', 'error');
        } else if (percentage >= 80) {
            this.toast(`Peringatan: Pengeluaran telah mencapai ${Math.floor(percentage)}% dari limit.`);
        }
    }
};
