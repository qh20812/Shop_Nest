# TỔNG HỢP NHỮNG CODE HTML TỪ STITCH DESIGN

## 00. Từ Master Prompt:
```html
<!DOCTYPE html>

<html class="h-full" lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&amp;family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 20;vertical-align:middle;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{colors:{"primary-container":"#b23a2f","turmeric":"#8A5A1A","on-secondary-fixed-variant":"#494641","border":"#DCD1BE","secondary":"#615e59","surface-bright":"#fef9ee","on-tertiary-fixed":"#1f1b11","inverse-on-surface":"#f5f0e5","on-tertiary-container":"#e9e0cf","on-primary":"#ffffff","tertiary-fixed-dim":"#cec6b5","logo-blue":"#4991D8","inverse-surface":"#323029","surface-variant":"#e7e2d7","secondary-fixed-dim":"#cbc6bf","on-tertiary":"#ffffff","tertiary":"#514b3f","on-surface-variant":"#58413e","ink-faint":"#9A8F7F","outline-variant":"#dfbfbb","on-secondary":"#ffffff","lacquer-wash":"#F2DCD5","on-error":"#ffffff","ink":"#1D1B17","on-surface":"#1d1c15","on-tertiary-fixed-variant":"#4b463a","background":"#fef9ee","on-secondary-container":"#67645f","on-background":"#1d1c15","tertiary-container":"#696356","secondary-fixed":"#e8e2db","error":"#ba1a1a","brick":"#8B2A24","inverse-primary":"#ffb4aa","secondary-container":"#e8e2db","surface-dim":"#dedacf","rice-paper":"#F6F1E6","jade":"#2F6B57","on-error-container":"#93000a","primary-fixed":"#ffdad5","lacquer-red":"#B23A2F","tertiary-fixed":"#eae2d1","surface-container-lowest":"#ffffff","surface-container-highest":"#e7e2d7","surface-container-high":"#ede8dd","error-container":"#ffdad6","on-secondary-fixed":"#1d1b17","surface":"#fef9ee","warm-porcelain":"#FFFCF4","surface-container-low":"#f8f3e8","lacquer-deep":"#8C2A22","raw-linen":"#EDE4D3","primary-fixed-dim":"#ffb4aa","on-primary-fixed":"#410001","surface-tint":"#aa342a","on-primary-container":"#ffd9d3","on-primary-fixed-variant":"#891c16","surface-container":"#f2ede2","ink-muted":"#6B6458","primary":"#91221a","outline":"#8c716d"},borderRadius:{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},spacing:{"gutter":"1.5rem","margin":"3rem","space-lg":"1.5rem","gutter-mobile":"1rem","space-md":"1rem","space-xs":"0.25rem","margin-mobile":"1.25rem","space-sm":"0.5rem","space-xl":"2.5rem"},fontFamily:{"label-code":["JetBrains Mono"],"headline-2":["Newsreader"],"display-lg-mobile":["Newsreader"],"label-micro":["Be Vietnam Pro"],"display-lg":["Newsreader"],"body-lg":["Be Vietnam Pro"],"headline-3":["Be Vietnam Pro"],"body-md":["Be Vietnam Pro"],"display-xl":["Newsreader"],"display-xl-mobile":["Newsreader"],"body-sm":["Be Vietnam Pro"],"headline-1":["Newsreader"]},fontSize:{"label-code":["14px",{"lineHeight":"20px","fontWeight":"500"}],"headline-2":["28px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"600"}],"display-lg-mobile":["32px",{"lineHeight":"34px","letterSpacing":"-0.025em","fontWeight":"600"}],"label-micro":["12px",{"lineHeight":"16px","letterSpacing":"0.12em","fontWeight":"600"}],"display-lg":["48px",{"lineHeight":"48px","letterSpacing":"-0.03em","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"headline-3":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}],"body-md":["16px",{"lineHeight":"26px","fontWeight":"400"}],"display-xl":["64px",{"lineHeight":"60px","letterSpacing":"-0.035em","fontWeight":"600"}],"display-xl-mobile":["40px",{"lineHeight":"40px","letterSpacing":"-0.03em","fontWeight":"600"}],"body-sm":["14px",{"lineHeight":"21px","fontWeight":"400"}],"headline-1":["36px",{"lineHeight":"40px","letterSpacing":"-0.025em","fontWeight":"600"}]}}}};</script></head><body class="min-h-full bg-rice-paper text-ink font-body-md"><header class="fixed top-0 left-0 right-0 z-50 bg-warm-porcelain/95 backdrop-blur-md border-b border-border"><div class="w-full max-w-7xl mx-auto px-gutter"><div class="h-20 flex items-center justify-between gap-space-lg"><div class="flex items-center gap-space-md shrink-0"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><div class="flex flex-col"><span class="font-headline-2 text-headline-2 text-lacquer-red leading-none">ShopNest</span><span class="font-label-micro text-label-micro text-ink-muted uppercase tracking-widest mt-1">Chợ đời sống &amp; tổ ấm Việt</span></div></div><div class="flex-1 max-w-2xl"><div class="relative flex items-center bg-rice-paper rounded-xl border border-border focus-within:border-lacquer-red focus-within:ring-1 focus-within:ring-lacquer-red transition-all"><button class="flex items-center gap-1 pl-space-md pr-space-sm py-2 text-ink-muted border-r border-border hover:text-ink font-body-sm text-body-sm" type="button"><span class="material-symbols-outlined text-[18px]">category</span><span class="hidden sm:inline">Tất cả</span><span class="material-symbols-outlined text-[16px]">expand_more</span></button><div class="relative flex-1 flex items-center"><span class="material-symbols-outlined absolute left-3 text-ink-faint text-[20px]">search</span><input class="w-full bg-transparent pl-10 pr-4 py-2.5 font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none" placeholder="Tìm laptop, nồi chiên không dầu, xe đẩy, serum dưỡng da..." type="text"/></div><button class="mr-1.5 px-4 py-1.5 bg-lacquer-red text-warm-porcelain rounded-lg font-body-sm text-body-sm hover:bg-lacquer-deep transition-colors" type="button">Tìm</button></div></div><div class="flex items-center gap-space-md shrink-0"><a class="flex items-center gap-2 text-ink hover:text-lacquer-red transition-colors py-2 px-3 rounded-lg hover:bg-lacquer-wash/40" href="#"><span class="material-symbols-outlined text-[22px]">account_circle</span><span class="font-body-sm text-body-sm">Tài khoản</span></a><a class="relative flex items-center gap-2 text-ink hover:text-lacquer-red transition-colors py-2 px-3 rounded-lg hover:bg-lacquer-wash/40" href="#"><span class="material-symbols-outlined text-[22px]">shopping_bag</span><span class="font-body-sm text-body-sm">Giỏ hàng</span><span class="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full bg-lacquer-red text-warm-porcelain font-label-code text-[12px] leading-tight font-semibold">3</span></a><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div><div class="h-12 border-t border-border/60 flex items-center justify-between"><nav class="flex items-center gap-space-lg h-full" data-active-classes="text-lacquer-red border-b-2 border-lacquer-red font-semibold"><a aria-current="page" class="h-full flex items-center transition-colors text-lacquer-red border-b-2 border-lacquer-red font-semibold" data-path="home" href="#">Chợ hôm nay</a><a class="h-full flex items-center font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors" data-path="categories" href="#">Ngành hàng</a><a class="h-full flex items-center font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors" data-path="vietnamese-curated-shops" href="#">Shop Việt tuyển chọn</a><a class="h-full flex items-center font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors" data-path="order-tracking" href="#">Tra cứu đơn hàng</a></nav><div class="flex items-center gap-2 font-label-micro text-label-micro text-ink-faint"><span class="material-symbols-outlined text-[15px] text-jade">verified</span><span>Chuẩn nếp thủ công &amp; tiêu dùng xanh</span></div></div></div></header><main class="w-full pt-32 bg-rice-paper min-h-screen"><div class="flex flex-col w-full">
<!-- SECTION: HERO SHOWCASE (7/5 Asymmetric Grid) -->
<section class="w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter pt-6 md:pt-10 pb-12">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
<!-- Left Column: 7 Cols Editorial Presentation -->
<div class="lg:col-span-7 flex flex-col justify-center">
<div class="inline-flex items-center gap-2 px-3 py-1 bg-lacquer-wash/60 rounded-full w-fit mb-4">
<span class="w-2 h-2 rounded-full bg-lacquer-red"></span>
<span class="font-label-micro text-label-micro text-lacquer-deep uppercase tracking-widest">
            SÀN THƯƠNG MẠI ĐIỆN TỬ TUYỂN CHỌN CHO TỔ ẤM &amp; ĐỜI SỐNG
          </span>
</div>
<h1 class="font-headline-1 md:font-display-xl text-headline-1 md:text-display-xl text-ink tracking-tight mb-5">
          Chọn đúng món,<br/>
<span class="italic font-normal text-lacquer-red">dùng thật bền.</span>
</h1>
<p class="font-body-lg text-body-lg text-ink-muted max-w-[52ch] mb-8 leading-relaxed">
          Nền tảng mua sắm quy tụ các thương hiệu tử tế và nhà bán hàng uy tín tại Việt Nam. Kiểm duyệt chặt chẽ từ điện tử gia dụng đến đồ dùng gia đình.
        </p>
<!-- Quick Discovery Search Box -->
<div class="p-2 bg-warm-porcelain rounded-2xl shadow-sm max-w-xl mb-6">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-ink-faint ml-3 text-[22px]">search</span>
<input class="flex-1 bg-transparent py-2.5 px-2 font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none" placeholder="Bạn đang tìm kiếm thiết bị hay vật phẩm nào hôm nay?" type="text"/>
<button class="px-5 py-3 bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain rounded-xl font-body-sm text-body-sm transition-transform active:scale-[0.98] shrink-0 font-medium">
              Khám phá ngay
            </button>
</div>
</div>
<!-- Hot Search Query Pills -->
<div class="flex flex-wrap items-center gap-2 mb-8 text-ink-muted font-body-sm text-body-sm">
<span class="font-label-micro text-label-micro text-ink-faint uppercase tracking-wider mr-1">Tìm nhiều:</span>
<a class="px-3 py-1 bg-surface-container hover:bg-lacquer-wash/50 text-ink rounded-full transition-colors text-xs" href="#">Nồi chiên không dầu</a>
<a class="px-3 py-1 bg-surface-container hover:bg-lacquer-wash/50 text-ink rounded-full transition-colors text-xs" href="#">Tai nghe True Wireless</a>
<a class="px-3 py-1 bg-surface-container hover:bg-lacquer-wash/50 text-ink rounded-full transition-colors text-xs" href="#">Xe đẩy em bé</a>
<a class="px-3 py-1 bg-surface-container hover:bg-lacquer-wash/50 text-ink rounded-full transition-colors text-xs" href="#">Serum B5</a>
<a class="px-3 py-1 bg-surface-container hover:bg-lacquer-wash/50 text-ink rounded-full transition-colors text-xs" href="#">Áo thun Pima</a>
</div>
<!-- Metric Trust Bar -->
<div class="grid grid-cols-3 gap-4 pt-6 max-w-xl bg-surface-container-low p-4 rounded-xl">
<div class="flex flex-col">
<span class="font-label-code text-label-code text-ink font-semibold text-base">6 Nhóm Ngành</span>
<span class="font-body-sm text-body-sm text-ink-faint mt-0.5">Thiết yếu cho tổ ấm</span>
</div>
<div class="flex flex-col pl-4">
<span class="font-label-code text-label-code text-ink font-semibold text-base">1.400+ Đơn Vị</span>
<span class="font-body-sm text-body-sm text-ink-faint mt-0.5">Nhà bán kiểm định kỹ</span>
</div>
<div class="flex flex-col pl-4">
<span class="font-label-code text-label-code text-jade font-semibold text-base flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">verified</span>100%
            </span>
<span class="font-body-sm text-body-sm text-ink-faint mt-0.5">Bảo hành chính hãng</span>
</div>
</div>
</div>
<!-- Right Column: 5 Cols Bento Visual Showcase -->
<div class="lg:col-span-5 grid grid-cols-2 gap-3.5 relative">
<!-- Bento Item 1: Modern Tech Laptop -->
<div class="col-span-2 bg-warm-porcelain rounded-2xl p-5 shadow-sm flex flex-col justify-between group overflow-hidden">
<div class="flex items-start justify-between mb-3 z-10">
<div>
<span class="px-2 py-0.5 bg-lacquer-wash text-lacquer-deep rounded font-label-micro text-label-micro uppercase tracking-wider">ĐIỆN TỬ CHỦ LỰC</span>
<h3 class="font-headline-3 text-headline-3 text-ink mt-1.5 group-hover:text-lacquer-red transition-colors">Laptop OLED Siêu Mỏng</h3>
</div>
<span class="font-label-code text-label-code text-ink font-semibold">24.890.000 ₫</span>
</div>
<div class="w-full h-44 overflow-hidden rounded-xl relative bg-surface-container">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="An ultra-slim modern metallic grey premium laptop open on a clean warm ash wooden desk, displaying crisp high-contrast code and modern graphic design application, natural warm morning sunlight softly casting subtle shadows in an airy minimal architectural studio." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHPoO7YcDwbavJUlEbM4FQePeOYLTE2N6RosHBqlWLYQJtaJqFi5YX4KEMVQVIV5Gi-b4J6Mq8ZNxJAO7EDe4UAEygp9nDausFhi6p6z01woWLHWeq_z9bDHnSqwFWESiwR990dO2SMEHd8cwseeNco7EkRPmc2rfc2opqbuFi1URLT1rwkD_C2Xm_2T7LIjvJKlVUUB0n5MG8gQvtYQKut9DncQDEhOsj4GPZRA"/>
</div>
</div>
<!-- Bento Item 2: Aesthetic Home Kitchen Device -->
<div class="bg-warm-porcelain rounded-2xl p-4 shadow-sm flex flex-col justify-between group">
<div class="w-full h-32 overflow-hidden rounded-xl bg-surface-container mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="A minimalist matte off-white smart steam air fryer with a clear tempered glass viewing window, sitting on a warm beige terrazzo countertop with rosemary springs and a ceramic bowl beside it, soft cinematic editorial culinary lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD908WVfp69h55cKWl-rkbaEGSas2JdhRZyTL2dSVVem8iak2nd8m12ukR1LCTQ7BYHaSkGnOGSCDoXTQxfbSh0MFx1-REEnyTICrLus1x5gHtZYsyF9rrGbTdq96Huyw_Nl8Fn5zFFLgNQiyjAJZvravPMra_Tn4BAvUykTF0ZmVxfK140i5F28g6tu1msqHo4X10PwdG57wnWrX3m5fhiRAk0fTSskZ9dtSl2IQ"/>
</div>
<div>
<span class="font-label-micro text-label-micro text-turmeric uppercase font-semibold">GIA DỤNG BẾP</span>
<div class="font-body-sm text-body-sm font-medium text-ink truncate mt-0.5">Nồi Chiên Hơi Nước</div>
<div class="font-label-code text-label-code text-ink-muted text-xs mt-1">3.490.000 ₫</div>
</div>
</div>
<!-- Bento Item 3: Mother & Baby / Skincare Pair -->
<div class="bg-warm-porcelain rounded-2xl p-4 shadow-sm flex flex-col justify-between group">
<div class="w-full h-32 overflow-hidden rounded-xl bg-surface-container mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="An amber glass serum dropper bottle with botanical extract liquid, next to a folded natural linen cloth and a compact modern lightweight baby stroller frame in background, warm soft lighting aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS2GgVZ0UN4JFScMsmAdqUkYkc1W1FKKrYnYmDogzNNXQYkNBjo_YMOdIMfytRCbFQHBmX0FZt2poGt2h99uOjeBMVcqW9G2eJ0A-wrtHzTK3vZ5GRBtrzdYPNAqBHeA-D3VuNrMH9q4NT1CBo9MSugDlvihTlE8neDwJ_BxyU5_SWIbNh2NucXJQ_dIsoegbxiSnw24Rg6rZ3_gD7hONfXBAzIoHcbywa1QSjeA"/>
</div>
<div>
<span class="px-2 py-0.5 bg-surface-container text-ink-muted rounded font-label-micro text-label-micro uppercase font-semibold">MẸ &amp; SẮC ĐẸP</span>
<div class="font-body-sm text-body-sm font-medium text-ink truncate mt-0.5">Vật Phẩm An Toàn</div>
<div class="font-label-code text-label-code text-jade text-xs mt-1">Chuẩn Hữu Cơ</div>
</div>
</div>
</div>
</div>
</section>
<!-- SECTION: 6 ANCHOR CATEGORIES RAIL -->
<section class="w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter py-8">
<div class="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-3">
<div>
<div class="font-label-micro text-label-micro text-lacquer-red uppercase tracking-wider mb-1">HỆ THỐNG MỤC LỤC</div>
<h2 class="font-headline-2 text-headline-2 text-ink">6 Nhóm Ngành Hàng Chủ Lực</h2>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-2 md:mt-0 max-w-md">
        Mỗi nhóm ngành được thiết lập quy chuẩn kiểm định minh bạch, bảo vệ quyền lợi trọn vòng đời sử dụng.
      </p>
</div>
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
<!-- 1. Điện tử & Công nghệ -->
<a class="group flex flex-col p-4 bg-warm-porcelain rounded-2xl shadow-sm hover:scale-[1.02] transition-transform" href="#">
<div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-ink group-hover:bg-lacquer-wash group-hover:text-lacquer-red transition-colors mb-3">
<span class="material-symbols-outlined text-[24px]">laptop_mac</span>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base mb-1 group-hover:text-lacquer-red transition-colors">Điện tử &amp; Công nghệ</h3>
<p class="font-body-sm text-body-sm text-ink-muted text-xs line-clamp-2 leading-relaxed">
          Laptop, âm thanh, phụ kiện làm việc chuẩn chỉ
        </p>
<span class="mt-4 font-label-micro text-label-micro text-ink-faint flex items-center gap-1 group-hover:text-lacquer-red transition-colors">
          Xem 320+ món <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</span>
</a>
<!-- 2. Gia dụng & Bếp -->
<a class="group flex flex-col p-4 bg-warm-porcelain rounded-2xl shadow-sm hover:scale-[1.02] transition-transform" href="#">
<div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-ink group-hover:bg-lacquer-wash group-hover:text-lacquer-red transition-colors mb-3">
<span class="material-symbols-outlined text-[24px]">skillet</span>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base mb-1 group-hover:text-lacquer-red transition-colors">Gia dụng &amp; Bếp</h3>
<p class="font-body-sm text-body-sm text-ink-muted text-xs line-clamp-2 leading-relaxed">
          Nồi chiên, thiết bị nấu nướng, máy làm sạch tiện nghi
        </p>
<span class="mt-4 font-label-micro text-label-micro text-ink-faint flex items-center gap-1 group-hover:text-lacquer-red transition-colors">
          Xem 480+ món <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</span>
</a>
<!-- 3. Nhà cửa & Đời sống -->
<a class="group flex flex-col p-4 bg-warm-porcelain rounded-2xl shadow-sm hover:scale-[1.02] transition-transform" href="#">
<div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-ink group-hover:bg-lacquer-wash group-hover:text-lacquer-red transition-colors mb-3">
<span class="material-symbols-outlined text-[24px]">chair</span>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base mb-1 group-hover:text-lacquer-red transition-colors">Nhà cửa &amp; Đời sống</h3>
<p class="font-body-sm text-body-sm text-ink-muted text-xs line-clamp-2 leading-relaxed">
          Bàn ghế gỗ sồi, đèn làm việc, chăn ga tencel
        </p>
<span class="mt-4 font-label-micro text-label-micro text-ink-faint flex items-center gap-1 group-hover:text-lacquer-red transition-colors">
          Xem 510+ món <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</span>
</a>
<!-- 4. Mẹ & Bé -->
<a class="group flex flex-col p-4 bg-warm-porcelain rounded-2xl shadow-sm hover:scale-[1.02] transition-transform" href="#">
<div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-ink group-hover:bg-lacquer-wash group-hover:text-lacquer-red transition-colors mb-3">
<span class="material-symbols-outlined text-[24px]">stroller</span>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base mb-1 group-hover:text-lacquer-red transition-colors">Mẹ &amp; Bé</h3>
<p class="font-body-sm text-body-sm text-ink-muted text-xs line-clamp-2 leading-relaxed">
          Xe đẩy, tã sữa hữu cơ, dinh dưỡng &amp; độ an toàn
        </p>
<span class="mt-4 font-label-micro text-label-micro text-ink-faint flex items-center gap-1 group-hover:text-lacquer-red transition-colors">
          Xem 290+ món <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</span>
</a>
<!-- 5. Thời trang & Phụ kiện -->
<a class="group flex flex-col p-4 bg-warm-porcelain rounded-2xl shadow-sm hover:scale-[1.02] transition-transform" href="#">
<div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-ink group-hover:bg-lacquer-wash group-hover:text-lacquer-red transition-colors mb-3">
<span class="material-symbols-outlined text-[24px]">apparel</span>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base mb-1 group-hover:text-lacquer-red transition-colors">Thời trang &amp; Phụ kiện</h3>
<p class="font-body-sm text-body-sm text-ink-muted text-xs line-clamp-2 leading-relaxed">
          Vải sợi tự nhiên mộc mạc, bền bỉ qua năm tháng
        </p>
<span class="mt-4 font-label-micro text-label-micro text-ink-faint flex items-center gap-1 group-hover:text-lacquer-red transition-colors">
          Xem 360+ món <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</span>
</a>
<!-- 6. Sắc đẹp & Chăm sóc -->
<a class="group flex flex-col p-4 bg-warm-porcelain rounded-2xl shadow-sm hover:scale-[1.02] transition-transform" href="#">
<div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-ink group-hover:bg-lacquer-wash group-hover:text-lacquer-red transition-colors mb-3">
<span class="material-symbols-outlined text-[24px]">spa</span>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base mb-1 group-hover:text-lacquer-red transition-colors">Sắc đẹp &amp; Thảo mộc</h3>
<p class="font-body-sm text-body-sm text-ink-muted text-xs line-clamp-2 leading-relaxed">
          Dược mỹ phẩm lành tính, thảo mộc dưỡng sinh Việt
        </p>
<span class="mt-4 font-label-micro text-label-micro text-ink-faint flex items-center gap-1 group-hover:text-lacquer-red transition-colors">
          Xem 410+ món <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</span>
</a>
</div>
</section>
<!-- SECTION: CURATION FILTERS & SHOP VIỆT SPOTLIGHT -->
<section class="w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter pt-6 pb-2">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-warm-porcelain p-3.5 rounded-2xl shadow-sm">
<!-- Filter Tabs -->
<div class="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0" id="filter-shelf">
<button class="px-4 py-2 bg-ink text-warm-porcelain rounded-xl font-body-sm text-body-sm font-medium shrink-0">
          Tất cả (2.370)
        </button>
<button class="px-4 py-2 bg-lacquer-wash hover:bg-lacquer-wash/80 text-lacquer-deep rounded-xl font-body-sm text-body-sm font-semibold shrink-0 flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px]">verified</span>
          Huy hiệu Shop Việt
        </button>
<button class="px-4 py-2 bg-surface-container hover:bg-raw-linen text-ink rounded-xl font-body-sm text-body-sm shrink-0">
          Chính hãng thương hiệu
        </button>
<button class="px-4 py-2 bg-surface-container hover:bg-raw-linen text-ink rounded-xl font-body-sm text-body-sm shrink-0">
          Đang ưu đãi nếp
        </button>
<button class="px-4 py-2 bg-surface-container hover:bg-raw-linen text-ink rounded-xl font-body-sm text-body-sm shrink-0 flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-turmeric">bolt</span>
          Giao nhanh 2H
        </button>
</div>
<!-- Sorting Selector -->
<div class="flex items-center gap-2 self-end md:self-auto shrink-0 text-ink-muted font-body-sm text-body-sm">
<span class="text-xs uppercase font-label-micro">Sắp xếp:</span>
<select class="bg-surface-container-low text-ink font-body-sm text-body-sm px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer">
<option>Đánh giá cao nhất</option>
<option>Mới tuyển chọn</option>
<option>Giá: Thấp đến Cao</option>
<option>Giá: Cao đến Thấp</option>
</select>
</div>
</div>
</section>
<!-- SECTION: MULTI-CATEGORY CURATED PRODUCT GRID (8 ITEMS - 4 COLUMNS) -->
<section class="w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter py-8">
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
<!-- Product 1: ZenBook 14 OLED -->
<div class="group bg-warm-porcelain rounded-[20px] p-3.5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-all">
<div>
<!-- Image 4:5 -->
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="ZenBook 14 OLED ultralight laptop in deep ponder blue open on a minimalist solid pine desk, displaying vivid high resolution wallpaper with ambient warm lamp light and ceramic coffee mug." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsSzpySJkxVbOiAs02yCoWsRp5dgDTZV04Vpq0zqqLC74zujEQ_NvCBuB128Dc94tF5PuxHfvBbolcNguRXEXI8PMTk5n_UWS-POmeUFo82YlSMCFliroXrYncwRpCgN1hmHctjPE57DYtl_L69NKHq3xwPGLKVxfTI4aTjdLicIfXd8vL7dDWkWr1EcD-sv2PDSo7jFK7m7kTyyqPTeIVPZPoRHDVM83FBKu_Ug"/>
<div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
<span class="px-2 py-0.5 bg-warm-porcelain/90 backdrop-blur-sm text-lacquer-deep rounded font-label-micro text-label-micro uppercase font-semibold flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-[13px] text-lacquer-red">workspace_premium</span> SHOP VIỆT
              </span>
<span class="px-2 py-0.5 bg-jade/90 backdrop-blur-sm text-warm-porcelain rounded font-label-micro text-label-micro uppercase font-semibold shadow-sm">
                CHÍNH HÃNG
              </span>
</div>
</div>
<!-- Metadata -->
<div class="flex items-center justify-between text-xs mb-1">
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Điện tử &amp; Công nghệ</span>
<div class="flex items-center text-turmeric gap-0.5 font-label-code text-xs">
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>4.9</span>
<span class="text-ink-faint">(84)</span>
</div>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base line-clamp-2 group-hover:text-lacquer-red transition-colors mb-1">
            Laptop mỏng nhẹ ZenBook 14 OLED (Intel Core Ultra, 16GB, 512GB SSD)
          </h3>
<div class="font-body-sm text-body-sm text-ink-faint text-xs mb-3 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">storefront</span>
<span>Shop Việt TechMart</span>
</div>
</div>
<div>
<div class="pt-2 flex items-baseline justify-between mb-3 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
<span class="font-label-code text-label-code text-ink font-semibold text-lg">24.890.000 ₫</span>
<span class="font-label-code text-label-code text-ink-faint line-through text-xs">26.500.000 ₫</span>
</div>
<button class="w-full py-2.5 bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink rounded-xl font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            Thêm vào giỏ
          </button>
</div>
</div>
<!-- Product 2: Nồi chiên LockAir 7L -->
<div class="group bg-warm-porcelain rounded-[20px] p-3.5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-all">
<div>
<!-- Image 4:5 -->
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Matte cream white steam air fryer appliance with clear glass viewing window showing crispy roast vegetables inside, placed on a pristine kitchen counter with natural warm light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZuooGDXNvQstuJlMI1wGnAVRvUI7No2aQUtdgM66W0Wq9ROhjeSIXWhUd6s1xnD4exJC5K_WHN2_UKoFVeqd_x9U2YFw-OXlB5OJ-8pC4E040JlyufdGIDRF7jjHAFDjcD-6ODz5BuWn_8xl6UhZ1LDx17gxn_yp2LlDTLsl2Il1XLBN5KvYwFYLBk_sbXEj8vk_8mpTFpiPHiwFM4mqvwNenBUucrRC9Y9TKag"/>
<div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
<span class="px-2 py-0.5 bg-warm-porcelain/90 backdrop-blur-sm text-lacquer-deep rounded font-label-micro text-label-micro uppercase font-semibold flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-[13px] text-lacquer-red">workspace_premium</span> SHOP VIỆT
              </span>
<span class="px-2 py-0.5 bg-turmeric text-warm-porcelain rounded font-label-micro text-label-micro uppercase font-semibold shadow-sm">
                BÁN CHẠY
              </span>
</div>
</div>
<!-- Metadata -->
<div class="flex items-center justify-between text-xs mb-1">
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Gia dụng &amp; Bếp</span>
<div class="flex items-center text-turmeric gap-0.5 font-label-code text-xs">
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>4.8</span>
<span class="text-ink-faint">(212)</span>
</div>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base line-clamp-2 group-hover:text-lacquer-red transition-colors mb-1">
            Nồi chiên không dầu hơi nước LockAir 7L dung tích lớn kèm khay nướng
          </h3>
<div class="font-body-sm text-body-sm text-ink-faint text-xs mb-3 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">storefront</span>
<span>Bếp Xanh Việt Nam</span>
</div>
</div>
<div>
<div class="pt-2 flex items-baseline justify-between mb-3 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
<span class="font-label-code text-label-code text-ink font-semibold text-lg">3.490.000 ₫</span>
<span class="font-label-code text-label-code text-ink-faint line-through text-xs">4.200.000 ₫</span>
</div>
<button class="w-full py-2.5 bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink rounded-xl font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            Thêm vào giỏ
          </button>
</div>
</div>
<!-- Product 3: Xe đẩy Urban Lite -->
<div class="group bg-warm-porcelain rounded-[20px] p-3.5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-all">
<div>
<!-- Image 4:5 -->
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="High-end foldable lightweight baby stroller in oat beige fabric with aluminum alloy chassis standing folded and ready in a sunlit airy entrance corridor, minimal Scandinavian styling." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNQo6lyqmiTURumxqjEePKiQ5gxG7sv4Jm6_C4inE4D4frQdjzdQDem4y4VJuAahaMITKPrdNelKJetZjuD7rypZ937S3w3tIt3IjOdlEQeaR6y4B6yDBoROB-O78LHO5W6TpJpKQ6-fstUmjY0r3jtn7Exita5AafkOgXf9_HcI74fP2gfwimWAH6q1PIra_Z39qPOQdubFnHSF_tTwMF_bEgj3YFXXHrKumaZQ"/>
<div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
<span class="px-2 py-0.5 bg-warm-porcelain/90 backdrop-blur-sm text-lacquer-deep rounded font-label-micro text-label-micro uppercase font-semibold flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-[13px] text-lacquer-red">workspace_premium</span> SHOP VIỆT
              </span>
<span class="px-2 py-0.5 bg-jade/90 backdrop-blur-sm text-warm-porcelain rounded font-label-micro text-label-micro uppercase font-semibold shadow-sm">
                CHÍNH HÃNG
              </span>
</div>
</div>
<!-- Metadata -->
<div class="flex items-center justify-between text-xs mb-1">
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Mẹ &amp; Bé</span>
<div class="flex items-center text-turmeric gap-0.5 font-label-code text-xs">
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>5.0</span>
<span class="text-ink-faint">(59)</span>
</div>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base line-clamp-2 group-hover:text-lacquer-red transition-colors mb-1">
            Xe đẩy gấp gọn đa năng Urban Lite siêu êm chống sốc cho trẻ 0-36 tháng
          </h3>
<div class="font-body-sm text-body-sm text-ink-faint text-xs mb-3 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">storefront</span>
<span>Bé Yêu Store</span>
</div>
</div>
<div>
<div class="pt-2 flex items-baseline justify-between mb-3 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
<span class="font-label-code text-label-code text-ink font-semibold text-lg">2.850.000 ₫</span>
<span class="font-label-code text-label-code text-ink-faint line-through text-xs">3.150.000 ₫</span>
</div>
<button class="w-full py-2.5 bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink rounded-xl font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            Thêm vào giỏ
          </button>
</div>
</div>
<!-- Product 4: Serum B5 Centella -->
<div class="group bg-warm-porcelain rounded-[20px] p-3.5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-all">
<div>
<!-- Image 4:5 -->
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Botanical skincare serum dropper bottle with frosted glass and fresh organic centella asiatica leaves beside water droplets, clean laboratory aesthetic with organic calm tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkAT-w8LWGBGwkQHcuNuf-nNRSxmj4y9wJfyItA5bCgw31kOpww3A_wPwYzcJlvl0xjmvLJT0lROFdPSUbEGxirbcT9NHuTWrvk0TBV9jzT3u1CZFFKdItIXkiFWlOrZJ7B0-9baBIB1TOjJ2UDPMvOKgyQwjgM_4APuhmf_35KUJ_yZZame4RRt4JMEm-pHFJKeHnmZ5fvMOyN0lfVI1I4j7l6EazjMDATMtBfw"/>
<div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
<span class="px-2 py-0.5 bg-warm-porcelain/90 backdrop-blur-sm text-lacquer-deep rounded font-label-micro text-label-micro uppercase font-semibold flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-[13px] text-lacquer-red">workspace_premium</span> SHOP VIỆT
              </span>
<span class="px-2 py-0.5 bg-turmeric text-warm-porcelain rounded font-label-micro text-label-micro uppercase font-semibold shadow-sm">
                BÁN CHẠY
              </span>
</div>
</div>
<!-- Metadata -->
<div class="flex items-center justify-between text-xs mb-1">
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Sắc đẹp &amp; Thảo mộc</span>
<div class="flex items-center text-turmeric gap-0.5 font-label-code text-xs">
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>4.9</span>
<span class="text-ink-faint">(340)</span>
</div>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base line-clamp-2 group-hover:text-lacquer-red transition-colors mb-1">
            Serum phục hồi &amp; làm dịu rau má Centella B5 50ml hữu cơ
          </h3>
<div class="font-body-sm text-body-sm text-ink-faint text-xs mb-3 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">storefront</span>
<span>Tiệm Dược Mỹ Phẩm Xanh</span>
</div>
</div>
<div>
<div class="pt-2 flex items-baseline justify-between mb-3 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
<span class="font-label-code text-label-code text-ink font-semibold text-lg">420.000 ₫</span>
<span class="font-label-code text-label-code text-ink-faint line-through text-xs">490.000 ₫</span>
</div>
<button class="w-full py-2.5 bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink rounded-xl font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            Thêm vào giỏ
          </button>
</div>
</div>
<!-- Product 5: Ghế công thái học Ergoflex -->
<div class="group bg-warm-porcelain rounded-[20px] p-3.5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-all">
<div>
<!-- Image 4:5 -->
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Modern ergonomic mesh desk chair in slate grey with adjustable lumbar support positioned in a clean quiet study room with a solid light oak desk and soft natural side light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLE76_W-1VqoAQRGDYoAODPp5VdquM8EG7iaeWkCXsUhOdZgPIhDAq3htA9xTf5MdWxO6Rrk3y25Ja8T7ZFE8W4OQkEHD6yBXzs09y-pIttB5CCPkkMhYcTpAjHbvj_9FksYEqzYEJKASez5z4UjPSM7etyF0vkEEVBtsO-9rbvy6_8lC4wjXfKf25sr_a6dS5HAsD8aqmRdOxDqiFGE0rhfjtd4G2gYWYiNEtNQ"/>
<div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
<span class="px-2 py-0.5 bg-warm-porcelain/90 backdrop-blur-sm text-lacquer-deep rounded font-label-micro text-label-micro uppercase font-semibold flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-[13px] text-lacquer-red">workspace_premium</span> SHOP VIỆT
              </span>
</div>
</div>
<!-- Metadata -->
<div class="flex items-center justify-between text-xs mb-1">
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Nhà cửa &amp; Đời sống</span>
<div class="flex items-center text-turmeric gap-0.5 font-label-code text-xs">
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>4.9</span>
<span class="text-ink-faint">(118)</span>
</div>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base line-clamp-2 group-hover:text-lacquer-red transition-colors mb-1">
            Ghế công thái học lưới thoáng Ergoflex đệm ngồi tùy chỉnh 3D
          </h3>
<div class="font-body-sm text-body-sm text-ink-faint text-xs mb-3 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">storefront</span>
<span>Nội Thất Nếp</span>
</div>
</div>
<div>
<div class="pt-2 flex items-baseline justify-between mb-3 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
<span class="font-label-code text-label-code text-ink font-semibold text-lg">4.690.000 ₫</span>
<span class="font-label-code text-label-code text-ink-faint line-through text-xs">5.200.000 ₫</span>
</div>
<button class="w-full py-2.5 bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink rounded-xl font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            Thêm vào giỏ
          </button>
</div>
</div>
<!-- Product 6: Tai nghe chống ồn Over-ear -->
<div class="group bg-warm-porcelain rounded-[20px] p-3.5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-all">
<div>
<!-- Image 4:5 -->
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Matte sand beige premium over-ear wireless headphones resting on a minimalist sculptural wooden headphone stand beside a mechanical keyboard, warm tactile ambient studio lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsqqrVCoINV2hSmjtPzedNbxc7r4sCmMGxJUwbIj60Jx_lP5GlkioXKuBwNyaxmzsVgEaVC9FKyGDpK2bh6E7BckVcbWTsHvES8WvrH7jHiSy5rJL4mmlaYOs31mymcINfQbOq2b857zYs5Hq-XwBJ3lHEiF7S0TYIFOhX7LnyPs2Qj3IIRbfYO2JoELErpFqqCrE_ftnkgLJIRxGk6HzjBZ2XxWAIfgJ6nSIOXw"/>
<div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
<span class="px-2 py-0.5 bg-warm-porcelain/90 backdrop-blur-sm text-lacquer-deep rounded font-label-micro text-label-micro uppercase font-semibold flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-[13px] text-lacquer-red">workspace_premium</span> SHOP VIỆT
              </span>
<span class="px-2 py-0.5 bg-jade/90 backdrop-blur-sm text-warm-porcelain rounded font-label-micro text-label-micro uppercase font-semibold shadow-sm">
                CHÍNH HÃNG
              </span>
</div>
</div>
<!-- Metadata -->
<div class="flex items-center justify-between text-xs mb-1">
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Điện tử &amp; Công nghệ</span>
<div class="flex items-center text-turmeric gap-0.5 font-label-code text-xs">
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>4.7</span>
<span class="text-ink-faint">(76)</span>
</div>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base line-clamp-2 group-hover:text-lacquer-red transition-colors mb-1">
            Tai nghe chống ồn chủ động Over-ear V-Acoustic thời lượng pin 40H
          </h3>
<div class="font-body-sm text-body-sm text-ink-faint text-xs mb-3 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">storefront</span>
<span>Âm Thanh Việt</span>
</div>
</div>
<div>
<div class="pt-2 flex items-baseline justify-between mb-3 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
<span class="font-label-code text-label-code text-ink font-semibold text-lg">3.190.000 ₫</span>
<span class="font-label-code text-label-code text-ink-faint line-through text-xs">3.800.000 ₫</span>
</div>
<button class="w-full py-2.5 bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink rounded-xl font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            Thêm vào giỏ
          </button>
</div>
</div>
<!-- Product 7: Áo thun cotton chải kỹ -->
<div class="group bg-warm-porcelain rounded-[20px] p-3.5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-all">
<div>
<!-- Image 4:5 -->
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Folded natural unbleached organic cotton t-shirt with subtle weave texture visible, placed on a raw linen background next to a minimal handmade ceramic button, warm natural studio light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-Ci8FYlZG34SsbAnfh5hXU9KdAY0A7WCcUjuFDQ1gzptu4pghXB576oGKauhAPnsnlVFwBiQgKnuHy_RB7McO-LIoRKPLhninD2i1am2h0PM-JzZNYNjMe6fN6HKUDqA5OqdV3rA35BjenfhxK1SSbHwzyN31BWjCh4xWQE6UqP5Tq6KODDQuthBZeJ-9xnsRIEsRsF3WTaXHS4xAGt1xPmPYb2SygM-hwqQbIQ"/>
<div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
<span class="px-2 py-0.5 bg-warm-porcelain/90 backdrop-blur-sm text-lacquer-deep rounded font-label-micro text-label-micro uppercase font-semibold flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-[13px] text-lacquer-red">workspace_premium</span> SHOP VIỆT
              </span>
</div>
</div>
<!-- Metadata -->
<div class="flex items-center justify-between text-xs mb-1">
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Thời trang &amp; Phụ kiện</span>
<div class="flex items-center text-turmeric gap-0.5 font-label-code text-xs">
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>4.9</span>
<span class="text-ink-faint">(430)</span>
</div>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base line-clamp-2 group-hover:text-lacquer-red transition-colors mb-1">
            Áo thun cổ tròn cotton chải kỹ dệt mộc định lượng 240gsm bền bỉ
          </h3>
<div class="font-body-sm text-body-sm text-ink-faint text-xs mb-3 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">storefront</span>
<span>Mộc Studio</span>
</div>
</div>
<div>
<div class="pt-2 flex items-baseline justify-between mb-3 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
<span class="font-label-code text-label-code text-ink font-semibold text-lg">290.000 ₫</span>
<span class="font-label-code text-label-code text-ink-faint line-through text-xs">350.000 ₫</span>
</div>
<button class="w-full py-2.5 bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink rounded-xl font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            Thêm vào giỏ
          </button>
</div>
</div>
<!-- Product 8: Máy ép chậm VitaPress -->
<div class="group bg-warm-porcelain rounded-[20px] p-3.5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-all">
<div>
<!-- Image 4:5 -->
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container mb-3">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Compact vertical cold press slow juicer in sage green on a bright kitchen counter with a glass of fresh cold-pressed orange-carrot juice beside sliced fresh citrus fruits, soft natural sunlight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr1cWWHXMj2P1H4drsu2iCh4WCbmB1n1o_ysuRHIzkAnmQGJSu4gcrvXzZtKOQDb-3NGtBdTP36pohV-PO_B7UpddwthSejmrNTSNV94oGhoDCEzSsOSwTzStgNrXwQXg_BhUyhBc0NrS4oL2TBQetoChorcV3z4k_wmoN6joywUv9olAtVtLjpv2fnlhRWm6wZ4wsnaCd6-TGsUTodL9QVqjlTCThZec_OBSS0g"/>
<div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
<span class="px-2 py-0.5 bg-warm-porcelain/90 backdrop-blur-sm text-lacquer-deep rounded font-label-micro text-label-micro uppercase font-semibold flex items-center gap-1 shadow-sm">
<span class="material-symbols-outlined text-[13px] text-lacquer-red">workspace_premium</span> SHOP VIỆT
              </span>
<span class="px-2 py-0.5 bg-jade/90 backdrop-blur-sm text-warm-porcelain rounded font-label-micro text-label-micro uppercase font-semibold shadow-sm">
                CHÍNH HÃNG
              </span>
</div>
</div>
<!-- Metadata -->
<div class="flex items-center justify-between text-xs mb-1">
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Gia dụng &amp; Bếp</span>
<div class="flex items-center text-turmeric gap-0.5 font-label-code text-xs">
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>4.8</span>
<span class="text-ink-faint">(165)</span>
</div>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink text-base line-clamp-2 group-hover:text-lacquer-red transition-colors mb-1">
            Máy ép chậm công nghệ ép lạnh VitaPress giữ trọn 98% vitamin
          </h3>
<div class="font-body-sm text-body-sm text-ink-faint text-xs mb-3 flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">storefront</span>
<span>Gia Dụng Chuẩn</span>
</div>
</div>
<div>
<div class="pt-2 flex items-baseline justify-between mb-3 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
<span class="font-label-code text-label-code text-ink font-semibold text-lg">2.150.000 ₫</span>
<span class="font-label-code text-label-code text-ink-faint line-through text-xs">2.600.000 ₫</span>
</div>
<button class="w-full py-2.5 bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink rounded-xl font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            Thêm vào giỏ
          </button>
</div>
</div>
</div>
<!-- Pagination or Load More -->
<div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
<button class="px-8 py-3 bg-warm-porcelain hover:bg-lacquer-wash/50 text-ink rounded-xl font-body-sm text-body-sm font-medium transition-all shadow-sm flex items-center gap-2">
<span>Tải thêm 24 sản phẩm nếp</span>
<span class="material-symbols-outlined text-[18px]">expand_more</span>
</button>
</div>
</section>
<!-- SECTION: BRAND SPOTLIGHT BANNER (SHOP VIỆT) -->
<section class="w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter py-8">
<div class="bg-surface-container-low rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
<div class="lg:col-span-8">
<div class="inline-flex items-center gap-2 px-3 py-1 bg-lacquer-wash rounded-full text-lacquer-deep font-label-micro text-label-micro uppercase font-semibold mb-3">
<span class="material-symbols-outlined text-[16px]">verified</span> TIÊU CHUẨN GIAN HÀNG VIỆT
          </div>
<h2 class="font-headline-2 text-headline-2 text-ink mb-3">
            Vì sao chọn mua tại các gian hàng Shop Việt?
          </h2>
<p class="font-body-md text-body-md text-ink-muted max-w-2xl leading-relaxed mb-6">
            Mỗi đối tác mang huy hiệu <strong>Shop Việt</strong> phải đáp ứng đủ 3 tiêu chí cốt lõi: Có pháp nhân minh bạch tại Việt Nam, sản phẩm có chứng nhận hợp chuẩn kiểm định, và cam kết kho bãi giao vận bảo toàn chất lượng trong 24 giờ.
          </p>
<div class="flex flex-wrap items-center gap-4">
<a class="px-6 py-3 bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain rounded-xl font-body-sm text-body-sm font-semibold transition-colors" href="#">
              Khám phá 1.400+ Shop Việt
            </a>
<a class="px-6 py-3 bg-warm-porcelain hover:bg-lacquer-wash text-ink rounded-xl font-body-sm text-body-sm font-medium transition-colors shadow-sm" href="#">
              Đăng ký mở gian hàng đối tác
            </a>
</div>
</div>
<div class="lg:col-span-4 flex flex-col gap-3">
<div class="bg-warm-porcelain p-4 rounded-2xl shadow-sm flex items-center gap-4">
<div class="w-12 h-12 rounded-xl bg-jade/10 text-jade flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[28px]">shield</span>
</div>
<div>
<div class="font-headline-3 text-headline-3 text-ink text-sm">Hợp quy &amp; Chính hãng</div>
<div class="font-body-sm text-body-sm text-ink-muted text-xs">Kiểm định nguồn gốc định kỳ</div>
</div>
</div>
<div class="bg-warm-porcelain p-4 rounded-2xl shadow-sm flex items-center gap-4">
<div class="w-12 h-12 rounded-xl bg-turmeric/10 text-turmeric flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[28px]">local_shipping</span>
</div>
<div>
<div class="font-headline-3 text-headline-3 text-ink text-sm">Kho vận bản địa</div>
<div class="font-body-sm text-body-sm text-ink-muted text-xs">Đóng gói thân thiện môi trường</div>
</div>
</div>
<div class="bg-warm-porcelain p-4 rounded-2xl shadow-sm flex items-center gap-4">
<div class="w-12 h-12 rounded-xl bg-lacquer-wash text-lacquer-deep flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[28px]">assignment_turned_in</span>
</div>
<div>
<div class="font-headline-3 text-headline-3 text-ink text-sm">Hậu mãi an tâm</div>
<div class="font-body-sm text-body-sm text-ink-muted text-xs">Đổi trả minh bạch trong 15 ngày</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- SECTION: CURATION STORY (3 PILLARS WITH ASYMMETRIC RHYTHM) -->
<section class="w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter py-12 md:py-16">
<div class="text-center max-w-2xl mx-auto mb-12">
<span class="font-label-micro text-label-micro text-lacquer-red uppercase tracking-widest">TRIẾT LÝ NẾP NHÀ</span>
<h2 class="font-headline-2 md:font-headline-1 text-headline-2 md:text-headline-1 text-ink mt-1 mb-4">
        Tiêu Chuẩn Tuyển Chọn Tại ShopNest
      </h2>
<p class="font-body-md text-body-md text-ink-muted leading-relaxed">
        Chúng tôi không xây dựng một cái chợ ngập tràn hàng giả giá rẻ. Mỗi sản phẩm được đưa lên sàn là một lời hứa về sự tử tế, công năng thực chất và độ bền bỉ cùng thời gian.
      </p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Pillar 1 -->
<div class="bg-warm-porcelain rounded-3xl p-8 shadow-sm flex flex-col justify-between">
<div>
<div class="font-label-code text-label-code text-lacquer-red text-2xl font-bold mb-4">01</div>
<h3 class="font-headline-2 text-headline-2 text-ink text-xl mb-3">
            Kiểm định nguồn gốc &amp; giấy tờ hợp quy
          </h3>
<p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
            Mọi thiết bị điện tử, máy móc gia dụng và mỹ phẩm bắt buộc phải có chứng chỉ công bố hợp quy (CR), hóa đơn VAT đầu vào và phiếu kiểm nghiệm độ an toàn trước khi kích hoạt gian hàng.
          </p>
</div>
<div class="mt-8 pt-4 flex items-center gap-2 text-xs font-label-micro text-jade uppercase font-semibold">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
          100% hồ sơ duyệt thủ công
        </div>
</div>
<!-- Pillar 2 -->
<div class="bg-warm-porcelain rounded-3xl p-8 shadow-sm flex flex-col justify-between md:-mt-4">
<div>
<div class="font-label-code text-label-code text-lacquer-red text-2xl font-bold mb-4">02</div>
<h3 class="font-headline-2 text-headline-2 text-ink text-xl mb-3">
            Cam kết đổi trả an tâm 15 ngày
          </h3>
<p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
            Nếu sản phẩm có lỗi kỹ thuật hoặc không đúng mô tả thực tế, đội ngũ ShopNest trực tiếp can thiệp và hoàn tiền 100% không phiền hà trong vòng 15 ngày, bảo vệ tuyệt đối khách mua.
          </p>
</div>
<div class="mt-8 pt-4 flex items-center gap-2 text-xs font-label-micro text-jade uppercase font-semibold">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
          Bảo hiểm đơn hàng tự động
        </div>
</div>
<!-- Pillar 3 -->
<div class="bg-warm-porcelain rounded-3xl p-8 shadow-sm flex flex-col justify-between">
<div>
<div class="font-label-code text-label-code text-lacquer-red text-2xl font-bold mb-4">03</div>
<h3 class="font-headline-2 text-headline-2 text-ink text-xl mb-3">
            Ưu tiên chuỗi cung ứng Việt Nam
          </h3>
<p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
            Đặc quyền hạ tầng công nghệ và chiết khấu ưu đãi cho các nhà xưởng, xưởng mộc và thương hiệu nội địa có tâm, gìn giữ giá trị việc làm và tay nghề người Việt.
          </p>
</div>
<div class="mt-8 pt-4 flex items-center gap-2 text-xs font-label-micro text-jade uppercase font-semibold">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
          Đồng hành bền vững cùng làng nghề
        </div>
</div>
</div>
</section>
<!-- SECTION: NEWSLETTER & HOME LIFE GUIDES -->
<section class="w-full max-w-7xl mx-auto px-gutter-mobile md:px-gutter pb-16">
<div class="bg-surface-container rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
<div class="max-w-xl">
<span class="font-label-micro text-label-micro text-lacquer-red uppercase tracking-widest">BẢN TIN NẾP SỐNG</span>
<h3 class="font-headline-2 text-headline-2 text-ink mt-1 mb-2">Nhận gợi ý mua sắm thông thái mỗi tuần</h3>
<p class="font-body-sm text-body-sm text-ink-muted">
          Không spam khuyến mãi ảo. Chỉ gửi các cẩm nang kiểm định thiết bị, hướng dẫn chăm con an lành và gợi ý bài trí không gian sống ấm cúng.
        </p>
</div>
<div class="w-full md:w-auto flex-1 max-w-md">
<form class="flex flex-col sm:flex-row gap-2" onsubmit="event.preventDefault(); alert('Cảm ơn bạn đã đăng ký nhận bản tin Nếp Sống ShopNest!');">
<input class="flex-1 px-4 py-3 bg-warm-porcelain rounded-xl font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none shadow-sm" placeholder="Nhập địa chỉ email của bạn..." required="" type="email"/>
<button class="px-6 py-3 bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain rounded-xl font-body-sm text-body-sm font-semibold transition-colors shrink-0" type="submit">
            Đăng ký
          </button>
</form>
<span class="block mt-2 font-label-micro text-label-micro text-ink-faint">
          Bảo mật thông tin 100%. Huỷ đăng ký bất kỳ lúc nào chỉ với một chạm.
        </span>
</div>
</div>
</section>
</div></main><footer class="w-full bg-rice-paper border-t border-border mt-margin"><div class="max-w-7xl mx-auto px-gutter py-space-xl"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl"><div class="flex flex-col"><h3 class="font-headline-3 text-headline-3 text-ink mb-space-md border-b border-border pb-2">6 Nhóm Ngành Hàng Chủ Lực</h3><ul class="space-y-2 font-body-sm text-body-sm text-ink-muted"><li><a class="hover:text-lacquer-red transition-colors" href="#">Đồ Gia Dụng &amp; Nhà Bếp</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Thiết Bị Điện Tử &amp; Công Nghệ</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Thời Trang &amp; Sợi Tự Nhiên</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Mẹ, Bé &amp; Không Gian Sống</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Chăm Sóc Da &amp; Thảo Mộc Việt</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Nông Sản &amp; Gia Vị Bản Địa</a></li></ul></div><div class="flex flex-col"><h3 class="font-headline-3 text-headline-3 text-ink mb-space-md border-b border-border pb-2">Dịch Vụ &amp; Tiêu Chuẩn Nếp</h3><ul class="space-y-2 font-body-sm text-body-sm text-ink-muted"><li><a class="hover:text-lacquer-red transition-colors" href="#">Kiểm Định Nguồn Gốc &amp; Làng Nghề</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Chính Sách Đổi Trả Trong 7 Ngày</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Đóng Gói Thân Thiện Môi Trường</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Giao Vận Bảo Toàn Độ Tươi Mới</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Cam Kết 100% Hàng Chính Hãng</a></li></ul></div><div class="flex flex-col"><h3 class="font-headline-3 text-headline-3 text-ink mb-space-md border-b border-border pb-2">Dành Cho Nhà Bán Hàng (Seller)</h3><ul class="space-y-2 font-body-sm text-body-sm text-ink-muted"><li><a class="hover:text-lacquer-red transition-colors" href="#">Mở Gian Hàng ShopNest Ký Gửi</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Quy Chuẩn Sản Phẩm Nếp Việt</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Cổng Đăng Nhập Quản Trị Seller</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Hỗ Trợ Chụp Ảnh Sản Phẩm &amp; Story</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Chính Sách Chiết Khấu Làng Nghề</a></li></ul></div><div class="flex flex-col"><h3 class="font-headline-3 text-headline-3 text-ink mb-space-md border-b border-border pb-2">Thông Tin ShopNest</h3><p class="font-body-sm text-body-sm text-ink-muted mb-space-sm">Nền tảng thương mại điện tử tôn vinh nếp sống, thẩm mỹ gia đình và tinh hoa sản vật Việt Nam.</p><div class="space-y-1 font-body-sm text-body-sm text-ink-muted mb-space-md"><div><strong class="text-ink">Trụ sở:</strong> 88 Phố Huế, Q. Hai Bà Trưng, Hà Nội</div><div><strong class="text-ink">Tổng đài:</strong> 1900 6886 (8:00 - 21:00)</div><div><strong class="text-ink">Email:</strong> hotro@shopnest.vn</div></div><div class="flex items-center gap-2"><span class="px-2.5 py-1 bg-raw-linen rounded text-ink-muted font-label-micro text-label-micro uppercase">Đã đăng ký BCT</span><span class="px-2.5 py-1 bg-lacquer-wash text-lacquer-deep rounded font-label-micro text-label-micro uppercase">Nếp Certified</span></div></div></div><div class="mt-space-xl pt-space-md border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-ink-faint"><p>© 2025 ShopNest Việt Nam. Tinh hoa tổ ấm - Gìn giữ nếp nhà.</p><div class="flex items-center gap-6"><a class="hover:text-ink transition-colors" href="#">Điều khoản dịch vụ</a><a class="hover:text-ink transition-colors" href="#">Chính sách bảo mật</a><a class="hover:text-ink transition-colors" href="#">Quy chế hoạt động</a></div></div></div></footer></body></html>
```
### A01 - Login
```html
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_blank" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
          "ink": "#1D1B17",
          "surface": "#fef9ee",
          "inverse-primary": "#ffb4aa",
          "error": "#ba1a1a",
          "tertiary-fixed-dim": "#cec6b5",
          "lacquer-red": "#B23A2F",
          "on-error-container": "#93000a",
          "turmeric": "#8A5A1A",
          "surface-bright": "#fef9ee",
          "secondary-fixed-dim": "#cbc6bf",
          "outline": "#8c716d",
          "tertiary": "#514b3f",
          "logo-blue": "#4991D8",
          "surface-container-high": "#ede8dd",
          "secondary": "#615e59",
          "secondary-fixed": "#e8e2db",
          "on-background": "#1d1c15",
          "brick": "#8B2A24",
          "tertiary-container": "#696356",
          "on-surface": "#1d1c15",
          "primary-fixed": "#ffdad5",
          "surface-container": "#f2ede2",
          "rice-paper": "#F6F1E6",
          "on-secondary-fixed": "#1d1b17",
          "surface-variant": "#e7e2d7",
          "primary": "#91221a",
          "warm-porcelain": "#FFFCF4",
          "outline-variant": "#dfbfbb",
          "on-secondary-container": "#67645f",
          "on-primary-fixed": "#410001",
          "inverse-surface": "#323029",
          "lacquer-deep": "#8C2A22",
          "on-secondary": "#ffffff",
          "surface-container-low": "#f8f3e8",
          "on-primary-container": "#ffd9d3",
          "on-primary": "#ffffff",
          "on-tertiary-fixed-variant": "#4b463a",
          "on-tertiary-container": "#e9e0cf",
          "surface-tint": "#aa342a",
          "jade": "#2F6B57",
          "on-tertiary-fixed": "#1f1b11",
          "surface-dim": "#dedacf",
          "on-tertiary": "#ffffff",
          "on-secondary-fixed-variant": "#494641",
          "on-primary-fixed-variant": "#891c16",
          "primary-container": "#b23a2f",
          "inverse-on-surface": "#f5f0e5",
          "primary-fixed-dim": "#ffb4aa",
          "on-error": "#ffffff",
          "raw-linen": "#EDE4D3",
          "surface-container-lowest": "#ffffff",
          "on-surface-variant": "#58413e",
          "ink-faint": "#9A8F7F",
          "border": "#DCD1BE",
          "secondary-container": "#e8e2db",
          "error-container": "#ffdad6",
          "ink-muted": "#6B6458",
          "background": "#fef9ee",
          "tertiary-fixed": "#eae2d1",
          "surface-container-highest": "#e7e2d7",
          "lacquer-wash": "#F2DCD5"
        },
        "borderRadius": {
          "DEFAULT": "0.25rem",
          "lg": "0.5rem",
          "xl": "0.75rem",
          "full": "9999px"
        },
        "spacing": {
          "space-xl": "2.5rem",
          "gutter-mobile": "1rem",
          "space-md": "1rem",
          "margin-mobile": "1.25rem",
          "space-lg": "1.5rem",
          "margin": "3rem",
          "gutter": "1.5rem",
          "space-sm": "0.5rem",
          "space-xs": "0.25rem"
        },
        "fontFamily": {
          "label-code": [
            "JetBrains Mono"
          ],
          "headline-3": [
            "Be Vietnam Pro"
          ],
          "body-lg": [
            "Be Vietnam Pro"
          ],
          "display-xl-mobile": [
            "Newsreader"
          ],
          "display-xl": [
            "Newsreader"
          ],
          "headline-1": [
            "Newsreader"
          ],
          "body-md": [
            "Be Vietnam Pro"
          ],
          "headline-2": [
            "Newsreader"
          ],
          "display-lg": [
            "Newsreader"
          ],
          "label-micro": [
            "Be Vietnam Pro"
          ],
          "display-lg-mobile": [
            "Newsreader"
          ],
          "body-sm": [
            "Be Vietnam Pro"
          ]
        },
        "fontSize": {
          "label-code": [
            "14px",
            {
              "lineHeight": "20px",
              "fontWeight": "500"
            }
          ],
          "headline-3": [
            "18px",
            {
              "lineHeight": "24px",
              "letterSpacing": "-0.01em",
              "fontWeight": "600"
            }
          ],
          "body-lg": [
            "18px",
            {
              "lineHeight": "28px",
              "fontWeight": "400"
            }
          ],
          "display-xl-mobile": [
            "40px",
            {
              "lineHeight": "40px",
              "letterSpacing": "-0.03em",
              "fontWeight": "600"
            }
          ],
          "display-xl": [
            "64px",
            {
              "lineHeight": "60px",
              "letterSpacing": "-0.035em",
              "fontWeight": "600"
            }
          ],
          "headline-1": [
            "36px",
            {
              "lineHeight": "40px",
              "letterSpacing": "-0.025em",
              "fontWeight": "600"
            }
          ],
          "body-md": [
            "16px",
            {
              "lineHeight": "26px",
              "fontWeight": "400"
            }
          ],
          "headline-2": [
            "28px",
            {
              "lineHeight": "32px",
              "letterSpacing": "-0.02em",
              "fontWeight": "600"
            }
          ],
          "display-lg": [
            "48px",
            {
              "lineHeight": "48px",
              "letterSpacing": "-0.03em",
              "fontWeight": "600"
            }
          ],
          "label-micro": [
            "12px",
            {
              "lineHeight": "16px",
              "letterSpacing": "0.12em",
              "fontWeight": "600"
            }
          ],
          "display-lg-mobile": [
            "32px",
            {
              "lineHeight": "34px",
              "letterSpacing": "-0.025em",
              "fontWeight": "600"
            }
          ],
          "body-sm": [
            "14px",
            {
              "lineHeight": "21px",
              "fontWeight": "400"
            }
          ]
        }
      },
    },
  }</script></head><body class="bg-rice-paper text-ink min-h-screen selection:bg-lacquer-wash selection:text-primary"><main class="min-h-screen w-full flex flex-col justify-center items-center p-0 md:p-gutter"><div class="flex flex-col w-full">
<div class="w-full min-h-[1024px] flex flex-col lg:flex-row bg-rice-paper text-ink">
<!-- CỘT TRÁI: Editorial & Visual Storytelling (5 cột ~ 41.66%) -->
<aside class="w-full lg:w-[42%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-border bg-rice-paper relative">
<!-- Top: Identity Brand Header -->
<div class="space-y-10">
<div class="flex items-center space-x-3.5 group cursor-pointer">
<div class="w-11 h-11 rounded-lg bg-warm-porcelain border border-border p-1.5 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
<svg class="w-full h-full text-lacquer-red" fill="currentColor" viewbox="0 0 100 100">
<path d="M50 10 C38 10 28 19 28 31 C28 35 29 39 31 43 C26 47 21 53 18 59 C13 69 16 80 25 87 C34 94 44 94 50 90 C56 94 66 94 75 87 C84 80 87 69 82 59 C79 53 74 47 69 43 C71 39 72 35 72 31 C72 19 62 10 50 10 Z M50 20 C56 20 62 25 62 31 C62 34 60 37 58 39 C55 37 51 36 47 36 C42 36 38 38 35 41 C37 34 43 20 50 20 Z"></path>
</svg>
</div>
<div>
<div class="flex items-center space-x-2">
<span class="font-headline-2 text-headline-2 tracking-tight text-ink font-semibold">ShopNest</span>
<span class="font-label-code text-[11px] px-1.5 py-0.5 rounded bg-raw-linen text-ink-muted border border-border">v1.2</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted">Chợ đời sống &amp; tổ ấm Việt</p>
</div>
</div>
<!-- Editorial Slogan & Intro -->
<div class="space-y-4 max-w-lg">
<div class="inline-flex items-center space-x-2 font-label-micro text-label-micro text-lacquer-red uppercase tracking-wider">
<span class="w-1.5 h-1.5 rounded-full bg-lacquer-red"></span>
<span>Chợ nhỏ, tổ ấm</span>
</div>
<h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-ink font-semibold tracking-tight leading-tight">
            Đồ thật, người thật, chuyện thật.
          </h1>
<p class="font-body-md text-body-md text-ink-muted leading-relaxed">
            Nơi kết nối những xưởng gia đình, làng nghề và nhà sản xuất Việt tử tế với các tổ ấm trân quý giá trị bền lâu.
          </p>
</div>
<!-- Curated Still-Life Visual Anchor -->
<div class="relative rounded-2xl bg-warm-porcelain border border-border p-2.5 overflow-hidden transition-all duration-300 hover:border-lacquer-red/40">
<div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-raw-linen">
<img class="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]" data-alt="Close up artisanal Vietnamese ceramic tea bowl with gentle crackle glaze in warm earthy tone resting on an untreated woven bamboo tray with quiet morning natural window light reflecting handcrafted textures" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAApS_d3d7vf1qVmgDldU9yM4IdlhNH7v5_F2xFAyo3SJzVoXP4BlsRnpGf0UZIaJlgXuOhvrDQUXTiCVtqek6XnBsm0DJuq0bF7l_vs9BYmITfSy8tQiA4iQ1Kzwv55PShVRU2nkaeN43MOHV1yqUS143HI2xohcwd9T9A-JvprsCu2TgH8KDLoyBU_9jxSSQHsi4JgjJrkZamJSNEyUrAF0924JAUhlfsLHFeog"/>
<div class="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent"></div>
<div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-warm-porcelain text-xs">
<div class="flex items-center space-x-1.5">
<span class="material-symbols-outlined text-[16px] text-warm-porcelain">spa</span>
<span class="font-body-sm text-xs font-medium tracking-wide">Bát gốm Bát Tràng men rạn</span>
</div>
<span class="font-label-code text-[11px] opacity-90 px-2 py-0.5 rounded bg-ink/40 backdrop-blur-sm border border-warm-porcelain/20">Nung củi truyền thống</span>
</div>
</div>
</div>
</div>
<!-- Left Column Footer Utility -->
<div class="pt-8 border-t border-border mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-ink-muted text-xs">
<div class="flex items-center space-x-2 font-label-code">
<span class="material-symbols-outlined text-sm text-ink-faint">headset_mic</span>
<span>1900 6886</span>
<span class="text-border">·</span>
<span>hotro@shopnest.vn</span>
</div>
<div class="font-body-sm text-ink-faint">
          Bản quyền © 2025 ShopNest
        </div>
</div>
</aside>
<!-- CỘT PHẢI: Authentication Gateway (7 cột ~ 58.33%) -->
<main class="w-full lg:w-[58%] bg-warm-porcelain flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16">
<div class="w-full max-w-[460px] mx-auto space-y-8">
<!-- Header -->
<div class="space-y-2">
<div class="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-raw-linen/60 text-ink-muted border border-border text-xs font-label-code mb-1">
<span class="w-2 h-2 rounded-full bg-jade"></span>
<span>Hệ thống bảo mật đa tầng</span>
</div>
<h2 class="font-display-lg text-display-lg-mobile md:text-headline-1 text-ink font-semibold tracking-tight">
            Đăng nhập
          </h2>
<p class="font-body-md text-body-md text-ink-muted">
            Tiếp tục với tài khoản gia đình hoặc xưởng nghề của bạn.
          </p>
</div>
<!-- Authentication Form -->
<form class="space-y-5" onsubmit="event.preventDefault(); handleDemoLogin();">
<!-- Field 1: Identifier -->
<div class="space-y-1.5">
<label class="block font-body-sm text-sm font-medium text-ink" for="identifier">
              Email, số điện thoại hoặc tên đăng nhập
            </label>
<div class="relative">
<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint text-[20px]">
                alternate_email
              </span>
<input autocomplete="username" class="w-full h-12 pl-11 pr-4 bg-warm-porcelain border border-border rounded-xl text-ink font-body-md text-sm placeholder:text-ink-faint focus:outline-none focus:border-lacquer-red focus:ring-2 focus:ring-lacquer-red/20 transition-all duration-150" id="identifier" placeholder="nguyenvana@gmail.com hoặc 0912 345 678" required="" type="text"/>
</div>
</div>
<!-- Field 2: Password -->
<div class="space-y-1.5">
<div class="flex items-center justify-between">
<label class="block font-body-sm text-sm font-medium text-ink" for="password">
                Mật khẩu
              </label>
</div>
<div class="relative">
<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint text-[20px]">
                lock
              </span>
<input autocomplete="current-password" class="w-full h-12 pl-11 pr-11 bg-warm-porcelain border border-border rounded-xl text-ink font-body-md text-sm placeholder:text-ink-faint focus:outline-none focus:border-lacquer-red focus:ring-2 focus:ring-lacquer-red/20 transition-all duration-150" id="password" placeholder="Nhập mật khẩu an toàn" required="" type="password"/>
<button aria-label="Hiện hoặc ẩn mật khẩu" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors p-1" id="togglePassword" type="button">
<span class="material-symbols-outlined text-[20px]" id="passwordIcon">visibility</span>
</button>
</div>
</div>
<!-- Options Row -->
<div class="flex items-center justify-between pt-1">
<label class="flex items-center space-x-2.5 cursor-pointer select-none">
<input class="w-4 h-4 rounded text-lacquer-red border-border focus:ring-lacquer-red accent-lacquer-red" type="checkbox"/>
<span class="font-body-sm text-sm text-ink-muted">Ghi nhớ đăng nhập</span>
</label>
<a class="font-body-sm text-sm text-ink-muted hover:text-lacquer-red underline decoration-1 underline-offset-4 decoration-border hover:decoration-lacquer-red transition-all" href="javascript:void(0)">
              Quên mật khẩu?
            </a>
</div>
<!-- Primary Submit Button -->
<div class="pt-2">
<button class="w-full h-12 rounded-xl bg-lacquer-red hover:bg-lacquer-deep active:scale-[0.99] text-warm-porcelain font-body-md font-medium text-base flex items-center justify-center space-x-2 transition-all duration-180 shadow-sm" id="submitBtn" type="submit">
<span>Đăng nhập</span>
<span class="material-symbols-outlined text-lg">arrow_forward</span>
</button>
</div>
<!-- Notification feedback banner (hidden initially) -->
<div class="hidden p-3 rounded-lg bg-surface-container border border-border text-xs text-ink-muted flex items-start space-x-2" id="statusNotice">
<span class="material-symbols-outlined text-lacquer-red text-base shrink-0 mt-0.5">info</span>
<span id="statusNoticeText">Đang xác thực thông tin tài khoản...</span>
</div>
<!-- Divider -->
<div class="relative py-2 flex items-center">
<div class="flex-grow border-t border-border"></div>
<span class="flex-shrink mx-4 font-body-sm text-xs text-ink-muted uppercase tracking-wider">hoặc</span>
<div class="flex-grow border-t border-border"></div>
</div>
<!-- Google SSO Action -->
<button class="w-full h-12 rounded-xl border border-border hover:bg-lacquer-wash/30 bg-warm-porcelain text-ink font-body-md text-sm font-medium flex items-center justify-center space-x-3 transition-colors duration-150" type="button">
<svg class="w-5 h-5" viewbox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
</svg>
<span>Tiếp tục với Google</span>
</button>
</form>
<!-- Secondary Navigation & Role Segmentation -->
<div class="pt-6 border-t border-border space-y-4">
<div class="text-center font-body-sm text-sm text-ink-muted">
            Chưa có tài khoản? 
            <a class="text-lacquer-red font-medium hover:underline underline-offset-4 ml-1" href="javascript:void(0)">
              Tạo tài khoản mới
            </a>
</div>
<!-- Merchant & Shipper portals -->
<div class="rounded-xl bg-raw-linen/40 border border-border/80 p-3.5 text-center">
<p class="font-body-sm text-xs text-ink-muted mb-2">Bạn là đối tác kinh doanh hoặc vận chuyển?</p>
<div class="flex items-center justify-center space-x-4 text-xs font-medium">
<a class="inline-flex items-center space-x-1 text-ink hover:text-lacquer-red transition-colors" href="javascript:void(0)">
<span class="material-symbols-outlined text-[16px] text-turmeric">storefront</span>
<span>Bán hàng cùng ShopNest</span>
</a>
<span class="text-border">|</span>
<a class="inline-flex items-center space-x-1 text-ink hover:text-lacquer-red transition-colors" href="javascript:void(0)">
<span class="material-symbols-outlined text-[16px] text-jade">local_shipping</span>
<span>Giao vận đối tác</span>
</a>
</div>
</div>
</div>
</div>
</main>
</div>
</div>
<script>
  // Simple interaction behavior for password reveal
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const passwordIcon = document.getElementById('passwordIcon');

  if (toggleBtn && passwordInput && passwordIcon) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      passwordIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });
  }

  // Demonstration feedback on submit
  function handleDemoLogin() {
    const notice = document.getElementById('statusNotice');
    const noticeText = document.getElementById('statusNoticeText');
    const submitBtn = document.getElementById('submitBtn');
    
    if (notice && noticeText && submitBtn) {
      notice.classList.remove('hidden');
      noticeText.textContent = 'Đang kết nối hệ thống chứng thực Nếp...';
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-80');
      
      setTimeout(() => {
        noticeText.textContent = 'Đăng nhập thành công. Đang tải trang chủ ShopNest...';
        notice.classList.add('bg-lacquer-wash', 'border-lacquer-red/30', 'text-lacquer-deep');
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-80');
      }, 1200);
    }
  }
</script></main></body></html>
```
### A02 - Customer register
```html
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_blank" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&amp;family=Be+Vietnam+Pro:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500;600&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "on-secondary": "#ffffff", "tertiary-fixed-dim": "#cec6b5", "surface-variant": "#e7e2d7", "surface-container-low": "#f8f3e8", "rice-paper": "#F6F1E6", "outline": "#8c716d", "secondary-container": "#e8e2db", "lacquer-deep": "#8C2A22", "primary-container": "#b23a2f", "lacquer-red": "#B23A2F", "on-primary-fixed": "#410001", "border": "#DCD1BE", "surface-tint": "#aa342a", "inverse-on-surface": "#f5f0e5", "on-surface-variant": "#58413e", "secondary-fixed-dim": "#cbc6bf", "jade": "#2F6B57", "inverse-surface": "#323029", "on-error": "#ffffff", "ink": "#1D1B17", "ink-muted": "#6B6458", "background": "#fef9ee", "lacquer-wash": "#F2DCD5", "tertiary": "#514b3f", "surface-dim": "#dedacf", "surface-container-lowest": "#ffffff", "inverse-primary": "#ffb4aa", "on-tertiary-container": "#e9e0cf", "on-surface": "#1d1c15", "brick": "#8B2A24", "on-secondary-fixed-variant": "#494641", "warm-porcelain": "#FFFCF4", "surface": "#fef9ee", "surface-bright": "#fef9ee", "on-secondary-fixed": "#1d1b17", "secondary-fixed": "#e8e2db", "outline-variant": "#dfbfbb", "on-primary-container": "#ffd9d3", "raw-linen": "#EDE4D3", "on-tertiary-fixed": "#1f1b11", "tertiary-fixed": "#eae2d1", "error": "#ba1a1a", "error-container": "#ffdad6", "turmeric": "#8A5A1A", "on-error-container": "#93000a", "tertiary-container": "#696356", "on-primary": "#ffffff", "surface-container-highest": "#e7e2d7", "ink-faint": "#9A8F7F", "on-tertiary": "#ffffff", "on-background": "#1d1c15", "secondary": "#615e59", "on-secondary-container": "#67645f", "on-tertiary-fixed-variant": "#4b463a", "primary-fixed-dim": "#ffb4aa", "surface-container-high": "#ede8dd", "primary-fixed": "#ffdad5", "on-primary-fixed-variant": "#891c16", "primary": "#91221a", "surface-container": "#f2ede2", "logo-blue": "#4991D8" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": { "margin": "3rem", "space-xl": "2.5rem", "space-xs": "0.25rem", "space-md": "1rem", "space-lg": "1.5rem", "space-sm": "0.5rem", "margin-mobile": "1.25rem", "gutter": "1.5rem", "gutter-mobile": "1rem" }, "fontFamily": { "display-lg-mobile": [ "Newsreader" ], "display-lg": [ "Newsreader" ], "headline-2": [ "Newsreader" ], "headline-3": [ "Be Vietnam Pro" ], "body-lg": [ "Be Vietnam Pro" ], "body-sm": [ "Be Vietnam Pro" ], "label-code": [ "JetBrains Mono" ], "body-md": [ "Be Vietnam Pro" ], "label-micro": [ "Be Vietnam Pro" ], "headline-1": [ "Newsreader" ], "display-xl": [ "Newsreader" ], "display-xl-mobile": [ "Newsreader" ] }, "fontSize": { "display-lg-mobile": [ "32px", { "lineHeight": "34px", "letterSpacing": "-0.025em", "fontWeight": "600" } ], "display-lg": [ "48px", { "lineHeight": "48px", "letterSpacing": "-0.03em", "fontWeight": "600" } ], "headline-2": [ "28px", { "lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600" } ], "headline-3": [ "18px", { "lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "600" } ], "body-lg": [ "18px", { "lineHeight": "28px", "fontWeight": "400" } ], "body-sm": [ "14px", { "lineHeight": "21px", "fontWeight": "400" } ], "label-code": [ "14px", { "lineHeight": "20px", "fontWeight": "500" } ], "body-md": [ "16px", { "lineHeight": "26px", "fontWeight": "400" } ], "label-micro": [ "12px", { "lineHeight": "16px", "letterSpacing": "0.12em", "fontWeight": "600" } ], "headline-1": [ "36px", { "lineHeight": "40px", "letterSpacing": "-0.025em", "fontWeight": "600" } ], "display-xl": [ "64px", { "lineHeight": "60px", "letterSpacing": "-0.035em", "fontWeight": "600" } ], "display-xl-mobile": [ "40px", { "lineHeight": "40px", "letterSpacing": "-0.03em", "fontWeight": "600" } ] } } } };</script></head><body class="bg-rice-paper font-body-md text-body-md text-ink antialiased min-h-screen"><main class="w-full min-h-screen bg-rice-paper flex flex-col"><div class="flex flex-col w-full">
<div class="w-full grid grid-cols-1 lg:grid-cols-12 min-h-screen">
<!-- LEFT PANEL: Brand Heritage & Trust (5 Columns) -->
<aside class="lg:col-span-5 bg-rice-paper p-8 lg:p-14 xl:p-16 flex flex-col justify-between relative overflow-hidden">
<!-- Ambient Craft Background Pattern (Subtle artisanal lines) -->
<div class="absolute inset-0 pointer-events-none opacity-[0.035]" style="background-image: radial-gradient(#1D1B17 1px, transparent 1px); background-size: 24px 24px;"></div>
<div class="absolute top-0 right-0 w-48 h-48 bg-lacquer-wash/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
<!-- Top Section: Brand & Narrative -->
<div class="relative z-10">
<!-- Logo & Version Metadata -->
<div class="flex items-center gap-3 mb-10 lg:mb-14">
<div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-warm-porcelain shadow-sm p-1.5">
<svg aria-label="ShopNest Biểu tượng" class="w-full h-full fill-lacquer-red" viewbox="0 0 100 100">
<path d="M50 12 C36 12 25 23 25 37 L25 42 C16 46 10 56 10 67 C10 82 22 92 37 92 C43 92 48 90 50 88 C52 90 57 92 63 92 C78 92 90 82 90 67 C90 56 84 46 75 42 L75 37 C75 23 64 12 50 12 Z M50 20 C59 20 67 27 67 36 L67 40 C61 38 55 38 50 38 C45 38 39 38 33 40 L33 36 C33 27 41 20 50 20 Z" fill-rule="evenodd"></path>
</svg>
</div>
<div class="flex flex-col">
<span class="font-headline-2 text-headline-2 tracking-tight text-ink font-semibold leading-none">ShopNest</span>
<span class="inline-flex items-center font-label-micro text-label-micro text-ink-muted mt-1 tracking-wider uppercase">
              v1.2 Chợ đời sống &amp; tổ ấm Việt
            </span>
</div>
</div>
<!-- Eyebrow -->
<div class="inline-flex items-center gap-2 mb-4">
<span class="w-2 h-2 rounded-full bg-lacquer-red"></span>
<span class="font-label-micro text-label-micro text-lacquer-red tracking-widest uppercase">CHỢ NHỎ, TỔ ẤM</span>
</div>
<!-- Headline -->
<h1 class="font-headline-1 text-headline-1 text-ink font-semibold mb-5 leading-tight">
          Đồ thật, người thật, chuyện thật.
        </h1>
<!-- Narrative Paragraph -->
<p class="font-body-md text-body-md text-ink-muted leading-relaxed max-w-lg mb-8">
          Nơi kết nối những xưởng gia đình, làng nghề và nhà sản xuất Việt tử tế với các tổ ấm trân quý giá trị bền lâu.
        </p>
<!-- Curated Craft Still-life Card -->
<div class="relative rounded-[20px] overflow-hidden bg-warm-porcelain shadow-sm group">
<div class="aspect-[16/10] w-full overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" data-alt="Editorial still life photograph of Vietnamese handwoven Nam Cao natural tussah silk fabric resting beside authentic Bat Trang minimalist ceramic bowls, warm morning sunlight, tactile rice paper and linen textures, muted organic earth tones, 50mm lens photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSaeb4TKm3ydmQ5UxMnIw_p2BRIiCpIetVdATUdZZevc73r0RLZD0mXQqL5nx4ywOq_OkTK-bqE41-IC8w5TzrXBXLakvuG3ZagjKc6tT7uWyTBaOrfCx0OC4DrMr6f405Q6WS5cvWKWMYx8ikitt2TlwLqeOQOd6fN7P0tfLV7wUGXag9ybv9VewzZh-IZ_S7Sbm9Mmx403oMQJlVxOjrOaA98yF2HNXixmdNxg"/>
</div>
<!-- Metadata Tag Glass Overlaid -->
<div class="absolute bottom-3 left-3 right-3 bg-warm-porcelain/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl flex items-center justify-between shadow-sm">
<div class="flex items-center gap-2 min-w-0">
<span class="material-symbols-outlined text-lacquer-red text-[18px]">verified</span>
<span class="font-body-sm text-body-sm text-ink font-medium truncate">Lụa tơ tằm Nam Cao · Dệt thủ công truyền thống</span>
</div>
<span class="font-label-code text-label-code text-ink-muted text-xs shrink-0 ml-2">Thái Bình</span>
</div>
</div>
<!-- Trust Cues -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">
<div class="bg-warm-porcelain/60 p-3.5 rounded-xl flex flex-col gap-1.5">
<span class="material-symbols-outlined text-jade text-[20px]">verified_user</span>
<span class="font-body-sm text-body-sm text-ink font-medium leading-snug">Kiểm định 100% nguồn gốc</span>
</div>
<div class="bg-warm-porcelain/60 p-3.5 rounded-xl flex flex-col gap-1.5">
<span class="material-symbols-outlined text-turmeric text-[20px]">published_with_changes</span>
<span class="font-body-sm text-body-sm text-ink font-medium leading-snug">Đổi trả an tâm 15 ngày</span>
</div>
<div class="bg-warm-porcelain/60 p-3.5 rounded-xl flex flex-col gap-1.5">
<span class="material-symbols-outlined text-lacquer-red text-[20px]">handshake</span>
<span class="font-body-sm text-body-sm text-ink font-medium leading-snug">Đồng hành xưởng bản địa</span>
</div>
</div>
</div>
<!-- Bottom Panel / Left Footer -->
<div class="relative z-10 pt-10 mt-8">
<div class="flex flex-wrap items-center justify-between gap-y-2 text-ink-muted font-body-sm text-body-sm">
<div class="flex items-center gap-3">
<span class="font-label-code text-label-code text-xs text-ink font-medium">Hotline: 1900 6886</span>
<span class="text-ink-faint">·</span>
<a class="hover:text-lacquer-red transition-colors" href="mailto:hotro@shopnest.vn">hotro@shopnest.vn</a>
</div>
<div class="font-label-micro text-label-micro text-ink-faint">
            © 2025 ShopNest.
          </div>
</div>
</div>
</aside>
<!-- RIGHT PANEL: Registration Form (7 Columns) -->
<main class="lg:col-span-7 bg-warm-porcelain flex items-center justify-center p-6 sm:p-10 lg:p-16 xl:p-20 relative">
<div class="w-full max-w-[520px] py-4 flex flex-col">
<!-- Header Pill Badge -->
<div class="mb-4">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-raw-linen text-ink-muted font-label-micro text-label-micro uppercase tracking-wider">
<span class="material-symbols-outlined text-[15px] text-jade" style="font-variation-settings: 'FILL' 1;">shield</span>
            Bảo mật thông tin khách hàng
          </span>
</div>
<!-- Form Title & Subtitle -->
<h2 class="font-headline-1 text-headline-1 text-ink font-semibold tracking-tight">
          Tạo tài khoản
        </h2>
<p class="font-body-md text-body-md text-ink-muted mt-1.5 mb-7">
          Một tài khoản cho mọi đơn hàng.
        </p>
<!-- Registration Form -->
<form class="space-y-4" onsubmit="event.preventDefault();">
<!-- Name Fields: Họ & Tên -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
<div class="flex flex-col gap-1.5">
<label class="font-headline-3 text-sm text-ink font-medium" for="last-name">
                Họ <span class="text-lacquer-red">*</span>
</label>
<input class="w-full h-12 px-4 rounded-xl bg-rice-paper text-ink placeholder:text-ink-faint font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-lacquer-red transition duration-150" id="last-name" placeholder="Nguyễn" required="" type="text"/>
</div>
<div class="flex flex-col gap-1.5">
<label class="font-headline-3 text-sm text-ink font-medium" for="first-name">
                Tên <span class="text-lacquer-red">*</span>
</label>
<input class="w-full h-12 px-4 rounded-xl bg-rice-paper text-ink placeholder:text-ink-faint font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-lacquer-red transition duration-150" id="first-name" placeholder="Thu Hà" required="" type="text"/>
</div>
</div>
<!-- Email Field -->
<div class="flex flex-col gap-1.5">
<label class="font-headline-3 text-sm text-ink font-medium" for="email">
              Email <span class="text-lacquer-red">*</span>
</label>
<div class="relative flex items-center">
<input class="w-full h-12 pl-4 pr-11 rounded-xl bg-rice-paper text-ink placeholder:text-ink-faint font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-lacquer-red transition duration-150" id="email" placeholder="thuha.nguyen@gmail.com" required="" type="email"/>
<span class="material-symbols-outlined text-ink-faint text-[20px] absolute right-3.5 pointer-events-none">mail</span>
</div>
</div>
<!-- Phone Number Field -->
<div class="flex flex-col gap-1.5">
<label class="font-headline-3 text-sm text-ink font-medium" for="phone">
              Số điện thoại <span class="text-lacquer-red">*</span>
</label>
<div class="relative flex items-center">
<input class="w-full h-12 pl-4 pr-11 rounded-xl bg-rice-paper text-ink placeholder:text-ink-faint font-body-md text-body-md font-label-code focus:outline-none focus:ring-2 focus:ring-lacquer-red transition duration-150" id="phone" placeholder="0912 345 678" required="" type="tel"/>
<span class="material-symbols-outlined text-ink-faint text-[20px] absolute right-3.5 pointer-events-none">call</span>
</div>
</div>
<!-- Password Field -->
<div class="flex flex-col gap-1.5">
<label class="font-headline-3 text-sm text-ink font-medium" for="password">
              Mật khẩu <span class="text-lacquer-red">*</span>
</label>
<div class="relative flex items-center">
<input class="w-full h-12 pl-4 pr-11 rounded-xl bg-rice-paper text-ink placeholder:text-ink-faint font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-lacquer-red transition duration-150" id="password" placeholder="Nhập mật khẩu an toàn" required="" type="password"/>
<button aria-label="Hiện hoặc ẩn mật khẩu" class="absolute right-3 p-1 rounded text-ink-muted hover:text-ink transition-colors flex items-center justify-center" id="toggle-password" type="button">
<span class="material-symbols-outlined text-[20px]" id="password-icon">visibility</span>
</button>
</div>
<!-- Inline Password Rule Indicator -->
<div class="flex items-center gap-1.5 mt-0.5 text-ink-faint font-body-sm text-xs">
<span class="material-symbols-outlined text-[15px] text-jade">check_circle</span>
<span>Ít nhất 8 ký tự, bao gồm chữ cái và số.</span>
</div>
</div>
<!-- Confirm Password Field -->
<div class="flex flex-col gap-1.5">
<label class="font-headline-3 text-sm text-ink font-medium" for="confirm-password">
              Nhập lại mật khẩu <span class="text-lacquer-red">*</span>
</label>
<div class="relative flex items-center">
<input class="w-full h-12 pl-4 pr-11 rounded-xl bg-rice-paper text-ink placeholder:text-ink-faint font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-lacquer-red transition duration-150" id="confirm-password" placeholder="Xác nhận lại mật khẩu" required="" type="password"/>
<button aria-label="Hiện hoặc ẩn mật khẩu xác nhận" class="absolute right-3 p-1 rounded text-ink-muted hover:text-ink transition-colors flex items-center justify-center" id="toggle-confirm-password" type="button">
<span class="material-symbols-outlined text-[20px]" id="confirm-password-icon">visibility</span>
</button>
</div>
</div>
<!-- Terms Checkbox -->
<div class="pt-2">
<label class="flex items-start gap-3 cursor-pointer select-none">
<div class="relative flex items-center justify-center pt-0.5">
<input class="peer appearance-none w-5 h-5 rounded-md bg-rice-paper checked:bg-lacquer-red checked:border-lacquer-red focus:outline-none focus:ring-2 focus:ring-lacquer-red cursor-pointer transition" required="" type="checkbox"/>
<span class="material-symbols-outlined text-warm-porcelain text-[16px] absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity font-bold">
                  check
                </span>
</div>
<span class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
                Tôi đồng ý với 
                <a class="text-ink font-medium underline underline-offset-4 decoration-border hover:text-lacquer-red hover:decoration-lacquer-red transition-colors" href="#">Điều khoản sử dụng</a> 
                và 
                <a class="text-ink font-medium underline underline-offset-4 decoration-border hover:text-lacquer-red hover:decoration-lacquer-red transition-colors" href="#">Chính sách bảo mật</a> 
                của ShopNest.
              </span>
</label>
</div>
<!-- Primary Submit CTA Button -->
<button class="w-full h-12 mt-2 bg-lacquer-red hover:bg-lacquer-deep active:translate-y-[1px] text-warm-porcelain font-headline-3 text-base rounded-xl font-medium flex items-center justify-center gap-2 transition duration-200 shadow-sm" type="submit">
<span>Tạo tài khoản</span>
<span class="material-symbols-outlined text-[20px]">arrow_forward</span>
</button>
</form>
<!-- Divider with HOẶC -->
<div class="relative my-6 flex items-center justify-center">
<div class="w-full h-[1px] bg-secondary-container"></div>
<span class="absolute bg-warm-porcelain px-3 font-label-micro text-label-micro text-ink-faint tracking-widest uppercase">
            HOẶC
          </span>
</div>
<!-- Google Continue Button -->
<button class="w-full h-12 rounded-xl bg-warm-porcelain hover:bg-lacquer-wash/20 active:translate-y-[1px] text-ink font-headline-3 text-base font-medium flex items-center justify-center gap-3 transition duration-150 shadow-sm" type="button">
<svg class="w-5 h-5 shrink-0" viewbox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
</svg>
<span>Tiếp tục với Google</span>
</button>
<!-- Switch to Login Link -->
<div class="text-center mt-6">
<span class="font-body-md text-body-md text-ink-muted">
            Đã có tài khoản? 
            <a class="text-lacquer-red font-semibold underline underline-offset-4 decoration-lacquer-red/40 hover:decoration-lacquer-red hover:text-lacquer-deep transition-colors ml-1" href="#">
              Đăng nhập
            </a>
</span>
</div>
<!-- Quiet Links: Role Switching (Seller / Shipper) -->
<div class="mt-8 pt-5 bg-rice-paper/70 p-4 rounded-xl flex items-center justify-between gap-4">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-ink-muted text-[20px]">storefront</span>
<a class="font-body-sm text-body-sm text-ink hover:text-lacquer-red font-medium transition-colors" href="#">
              Đăng ký bán hàng
            </a>
</div>
<span class="text-secondary-container">|</span>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-ink-muted text-[20px]">local_shipping</span>
<a class="font-body-sm text-body-sm text-ink hover:text-lacquer-red font-medium transition-colors" href="#">
              Đăng ký giao hàng
            </a>
</div>
</div>
</div>
</main>
</div>
</div>
<script>
  // Micro-interaction for toggling password visibility
  function setupPasswordToggle(toggleId, inputId, iconId) {
    const toggleBtn = document.getElementById(toggleId);
    const inputField = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (toggleBtn && inputField && icon) {
      toggleBtn.addEventListener('click', () => {
        const isPassword = inputField.type === 'password';
        inputField.type = isPassword ? 'text' : 'password';
        icon.textContent = isPassword ? 'visibility_off' : 'visibility';
      });
    }
  }

  setupPasswordToggle('toggle-password', 'password', 'password-icon');
  setupPasswordToggle('toggle-confirm-password', 'confirm-password', 'confirm-password-icon');
</script></main></body></html>
```
### A03 — Seller registration
```html
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_blank" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{colors:{"brick":"#8B2A24","secondary":"#615e59","tertiary-fixed":"#eae2d1","surface-bright":"#fef9ee","on-secondary-container":"#67645f","lacquer-deep":"#8C2A22","on-tertiary-fixed-variant":"#4b463a","on-primary-fixed":"#410001","secondary-fixed-dim":"#cbc6bf","surface-container-highest":"#e7e2d7","border":"#DCD1BE","on-primary":"#ffffff","on-background":"#1d1c15","ink-muted":"#6B6458","secondary-fixed":"#e8e2db","surface-dim":"#dedacf","surface-variant":"#e7e2d7","tertiary":"#514b3f","tertiary-container":"#696356","logo-blue":"#4991D8","primary-container":"#b23a2f","on-tertiary":"#ffffff","inverse-on-surface":"#f5f0e5","primary":"#91221a","inverse-primary":"#ffb4aa","background":"#fef9ee","on-primary-fixed-variant":"#891c16","jade":"#2F6B57","surface-container":"#f2ede2","inverse-surface":"#323029","outline":"#8c716d","surface":"#fef9ee","on-error-container":"#93000a","on-error":"#ffffff","lacquer-red":"#B23A2F","on-secondary":"#ffffff","secondary-container":"#e8e2db","on-tertiary-container":"#e9e0cf","on-tertiary-fixed":"#1f1b11","error":"#ba1a1a","on-surface":"#1d1c15","tertiary-fixed-dim":"#cec6b5","on-surface-variant":"#58413e","error-container":"#ffdad6","ink":"#1D1B17","turmeric":"#8A5A1A","on-secondary-fixed":"#1d1b17","raw-linen":"#EDE4D3","primary-fixed-dim":"#ffb4aa","surface-container-low":"#f8f3e8","on-primary-container":"#ffd9d3","primary-fixed":"#ffdad5","surface-container-high":"#ede8dd","surface-container-lowest":"#ffffff","surface-tint":"#aa342a","lacquer-wash":"#F2DCD5","on-secondary-fixed-variant":"#494641","outline-variant":"#dfbfbb","warm-porcelain":"#FFFCF4","ink-faint":"#9A8F7F","rice-paper":"#F6F1E6"},borderRadius:{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},spacing:{"space-xl":"2.5rem","space-md":"1rem","margin":"3rem","margin-mobile":"1.25rem","gutter":"1.5rem","space-xs":"0.25rem","gutter-mobile":"1rem","space-lg":"1.5rem","space-sm":"0.5rem"},fontFamily:{"body-md":["Be Vietnam Pro"],"headline-3":["Be Vietnam Pro"],"display-lg":["Newsreader"],"body-sm":["Be Vietnam Pro"],"label-micro":["Be Vietnam Pro"],"body-lg":["Be Vietnam Pro"],"display-lg-mobile":["Newsreader"],"display-xl":["Newsreader"],"display-xl-mobile":["Newsreader"],"headline-2":["Newsreader"],"label-code":["JetBrains Mono"],"headline-1":["Newsreader"]},fontSize:{"body-md":["16px",{"lineHeight":"26px","fontWeight":"400"}],"headline-3":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}],"display-lg":["48px",{"lineHeight":"48px","letterSpacing":"-0.03em","fontWeight":"600"}],"body-sm":["14px",{"lineHeight":"21px","fontWeight":"400"}],"label-micro":["12px",{"lineHeight":"16px","letterSpacing":"0.12em","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"display-lg-mobile":["32px",{"lineHeight":"34px","letterSpacing":"-0.025em","fontWeight":"600"}],"display-xl":["64px",{"lineHeight":"60px","letterSpacing":"-0.035em","fontWeight":"600"}],"display-xl-mobile":["40px",{"lineHeight":"40px","letterSpacing":"-0.03em","fontWeight":"600"}],"headline-2":["28px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"600"}],"label-code":["14px",{"lineHeight":"20px","fontWeight":"500"}],"headline-1":["36px",{"lineHeight":"40px","letterSpacing":"-0.025em","fontWeight":"600"}]}}}};</script></head><body class="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen selection:bg-lacquer-wash selection:text-brick"><main class="min-h-screen w-full flex flex-col justify-center relative bg-surface"><div class="flex flex-col w-full">
<div class="min-h-[100dvh] w-full grid grid-cols-1 lg:grid-cols-12 bg-rice-paper">
<!-- LEFT PANEL: Brand Narrative & Process (6 Columns) -->
<div class="lg:col-span-6 bg-raw-linen p-8 lg:p-14 flex flex-col justify-between shadow-sm relative overflow-hidden">
<!-- Ambient subtle gradient glow -->
<div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-lacquer-wash/40 blur-3xl pointer-events-none"></div>
<!-- Header & Identity -->
<div class="relative z-10">
<div class="flex items-center justify-between pb-8">
<div class="flex items-center gap-3">
<img alt="ShopNest" class="w-10 h-10 object-contain rounded-lg shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfibGv9smhojWb0mpbu5rTs-Sv5TNUDY5_qwLxExnIPJgXUWV-daKXbmd47oy48nx9E3_wVxE5MK9wgz0E3Emicudu72Ij6O0PZy_hpXaSaOGLQOirUbgqIjSpsyVvUV0RjIIclN7j1b7IGV4NbXDALJRYWjjQdHbLZiyK0F5iVHyiWTesMazz83aKnUcH2_5E28Mw2Tng_6K3_7_09Q0x3E9yfWNXyuKBfRyRXQMgc7Qaeg1ZMLw"/>
<div class="flex flex-col">
<span class="font-headline-2 text-headline-2 text-ink tracking-tight leading-none">ShopNest</span>
<span class="font-label-micro text-label-micro tracking-widest text-ink-muted uppercase mt-0.5">Kênh Người Bán / Seller Hub</span>
</div>
</div>
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-micro text-label-micro bg-rice-paper text-ink shadow-sm">
<span class="w-2 h-2 rounded-full bg-jade"></span>
            Tuyển chọn 2024
          </span>
</div>
<!-- Main Hero Statement -->
<div class="mt-4">
<span class="font-label-micro text-label-micro uppercase tracking-[0.14em] text-lacquer-deep font-semibold block mb-2">
            Bán hàng cùng ShopNest
          </span>
<h1 class="font-display-lg text-display-lg text-ink font-semibold leading-tight">
            Mở shop nhỏ,<br/>chạm khách thật.
          </h1>
<p class="font-body-md text-body-md text-ink-muted mt-3 max-w-lg">
            Đồng hành cùng các xưởng sản xuất, hộ gia đình và thương hiệu Việt tử tế tiếp cận khách hàng trân quý giá trị bền lâu.
          </p>
</div>
<!-- 3-Step Flow Timeline -->
<div class="mt-8 space-y-5">
<div class="flex items-start gap-4">
<div class="w-10 h-10 rounded-xl bg-warm-porcelain flex items-center justify-center font-label-code text-label-code font-semibold text-lacquer-red shadow-sm flex-shrink-0">
              01
            </div>
<div class="pt-0.5">
<h2 class="font-headline-3 text-headline-3 text-ink">Gửi thông tin shop</h2>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">Điền biểu mẫu cơ bản về ngành hàng và định danh gian hàng trong 3 phút.</p>
</div>
</div>
<div class="flex items-start gap-4">
<div class="w-10 h-10 rounded-xl bg-warm-porcelain flex items-center justify-center font-label-code text-label-code font-semibold text-ink-muted shadow-sm flex-shrink-0">
              02
            </div>
<div class="pt-0.5">
<h2 class="font-headline-3 text-headline-3 text-ink">Chờ duyệt hồ sơ</h2>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">Đội ngũ ShopNest kiểm duyệt tiêu chuẩn chất lượng và liên hệ trong 24–48h.</p>
</div>
</div>
<div class="flex items-start gap-4">
<div class="w-10 h-10 rounded-xl bg-warm-porcelain flex items-center justify-center font-label-code text-label-code font-semibold text-ink-muted shadow-sm flex-shrink-0">
              03
            </div>
<div class="pt-0.5">
<h2 class="font-headline-3 text-headline-3 text-ink">Bắt đầu bán</h2>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">Kích hoạt gian hàng, đăng tải sản phẩm và nhận đơn vận hành toàn quốc.</p>
</div>
</div>
</div>
<!-- Craft Visual Card -->
<div class="mt-8 bg-warm-porcelain rounded-xl p-4 shadow-sm">
<div class="relative overflow-hidden rounded-lg aspect-[16/9] w-full">
<img class="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-300" data-alt="Warm artisanal ceramic studio workshop with natural sunlight streaming through wooden lattice windows, clay vessels, terracotta bowls, and traditional Vietnamese craft tools neatly arranged on rustic raw linen surfaces, warm beige and earthy lacquer red tones, cinematic editorial photograph" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDExD0BdVsfnc6HCjAzbz53MhEvEZf80AefP3Fcw415B1s7_iJnet4MNXLYUn551vGzxIvDS7BVJoPMRCr02KBnVM1_tGkww_dtJIaQSVvehR65H_bUIqcNwxTGXF8QIjsbhjyTA00K7_JFLX6TIwymRPomB1qv6vzkN4SbaffOtcR68WV4e7sxTAJPjI-xZF6JdrLZyHVHuBYSOkOwe8sP8xHq3fOG9oaK9oWiOQ"/>
<div class="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"></div>
<div class="absolute bottom-3 left-3 right-3 text-on-primary">
<p class="font-body-sm text-body-sm font-medium">Làng nghề thủ công &amp; Bản sắc mộc mạc</p>
<p class="font-label-micro text-label-micro text-warm-porcelain/90">Tiêu chuẩn kiểm định khắt khe từng mẻ thành phẩm</p>
</div>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-2.5 px-1 italic">
            "Mỗi gian hàng là một câu chuyện làng nghề và nếp sống mộc mạc."
          </p>
</div>
</div>
<!-- Trust Footer / Assurance -->
<div class="relative z-10 pt-8 mt-6">
<div class="bg-rice-paper/80 rounded-xl p-4 shadow-sm flex flex-col gap-2">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-jade text-xl">verified</span>
<span class="font-body-sm text-body-sm font-semibold text-ink">Chiết khấu minh bạch 4.5% · Không phí mở gian</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
            Hỗ trợ chụp ảnh &amp; chuẩn hóa câu chuyện sản phẩm miễn phí cho hộ kinh doanh và nghệ nhân địa phương.
          </p>
<div class="flex flex-wrap items-center gap-y-1 gap-x-4 pt-2 text-ink-muted font-label-micro text-label-micro">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-base text-lacquer-red">call</span>
              Hotline đối tác: 1900 6886 (nhánh 2)
            </span>
<span>·</span>
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-base text-lacquer-red">mail</span>
              doitac@shopnest.vn
            </span>
</div>
</div>
</div>
</div>
<!-- RIGHT PANEL: Registration Form (6 Columns) -->
<div class="lg:col-span-6 bg-warm-porcelain p-8 lg:p-14 flex flex-col justify-center items-center overflow-y-auto">
<div class="w-full max-w-xl mx-auto py-4">
<!-- Form Header Badge -->
<div class="flex items-center justify-between mb-4">
<span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full font-label-micro text-label-micro font-medium bg-lacquer-wash text-lacquer-deep shadow-sm">
<span class="material-symbols-outlined text-sm">shield</span>
            Hồ sơ đối tác chính thức
          </span>
<span class="font-label-code text-label-code text-ink-muted">Bước 1 / 3</span>
</div>
<h2 class="font-display-lg text-display-lg text-ink font-semibold leading-tight">
          Đăng ký người bán
        </h2>
<p class="font-body-md text-body-md text-ink-muted mt-1.5">
          Bắt đầu hành trình đưa sản phẩm Việt tới hàng triệu tổ ấm.
        </p>
<!-- Form Elements -->
<form class="mt-8 space-y-5" onsubmit="event.preventDefault();">
<!-- Shop Name -->
<div>
<label class="block font-body-sm text-body-sm font-semibold text-ink mb-1.5" for="shop_name">
              Tên shop / Thương hiệu <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<input class="w-full h-12 px-4 rounded-xl bg-surface font-body-md text-body-md text-ink placeholder:text-ink-faint shadow-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red transition-all" id="shop_name" name="shop_name" placeholder="VD: Gốm Bát Tràng An Nhiên, Tiệm Mây Đan..." required="" type="text"/>
<span class="absolute right-3.5 top-3.5 text-ink-faint material-symbols-outlined text-xl">storefront</span>
</div>
<p class="font-label-micro text-label-micro text-ink-muted mt-1">Tên này sẽ hiển thị công khai trên mặt tiền gian hàng của bạn.</p>
</div>
<!-- Business Type & Province -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div>
<label class="block font-body-sm text-body-sm font-semibold text-ink mb-1.5" for="business_type">
                Loại hình kinh doanh <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<select class="w-full h-12 px-4 pr-10 rounded-xl bg-surface font-body-md text-body-md text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red transition-all appearance-none cursor-pointer" id="business_type" name="business_type">
<option value="household">Hộ kinh doanh cá thể</option>
<option value="enterprise">Doanh nghiệp / Xưởng sản xuất</option>
<option selected="" value="artisan">Nghệ nhân / Tự làm (Handmade)</option>
<option value="cooperative">Hợp tác xã nông thôn</option>
</select>
<span class="absolute right-3.5 top-3.5 text-ink-muted pointer-events-none material-symbols-outlined text-xl">expand_more</span>
</div>
</div>
<div>
<label class="block font-body-sm text-body-sm font-semibold text-ink mb-1.5" for="location">
                Tỉnh / Thành phố <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<select class="w-full h-12 px-4 pr-10 rounded-xl bg-surface font-body-md text-body-md text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red transition-all appearance-none cursor-pointer" id="location" name="location">
<option value="HN">Hà Nội</option>
<option value="HCM">TP. Hồ Chí Minh</option>
<option value="DN">Đà Nẵng</option>
<option value="TB">Thái Bình</option>
<option value="HUE">Thừa Thiên Huế</option>
<option value="BT">Bến Tre</option>
<option value="OTHER">Tỉnh thành khác...</option>
</select>
<span class="absolute right-3.5 top-3.5 text-ink-muted pointer-events-none material-symbols-outlined text-xl">expand_more</span>
</div>
</div>
</div>
<!-- Phone & Email -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div>
<label class="block font-body-sm text-body-sm font-semibold text-ink mb-1.5" for="phone">
                Số điện thoại <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<input class="w-full h-12 px-4 rounded-xl bg-surface font-label-code text-label-code text-ink placeholder:text-ink-faint shadow-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red transition-all" id="phone" name="phone" placeholder="0912 345 678" required="" type="tel"/>
<span class="absolute right-3.5 top-3.5 text-ink-faint material-symbols-outlined text-xl">call</span>
</div>
</div>
<div>
<label class="block font-body-sm text-body-sm font-semibold text-ink mb-1.5" for="email">
                Email liên hệ <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<input class="w-full h-12 px-4 rounded-xl bg-surface font-body-md text-body-md text-ink placeholder:text-ink-faint shadow-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red transition-all" id="email" name="email" placeholder="chushop@gmail.com" required="" type="email"/>
<span class="absolute right-3.5 top-3.5 text-ink-faint material-symbols-outlined text-xl">alternate_email</span>
</div>
</div>
</div>
<!-- Password & Confirmation -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div>
<label class="block font-body-sm text-body-sm font-semibold text-ink mb-1.5" for="password">
                Mật khẩu quản trị <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<input class="w-full h-12 px-4 pr-11 rounded-xl bg-surface font-body-md text-body-md text-ink placeholder:text-ink-faint shadow-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red transition-all" id="password" name="password" placeholder="Tối thiểu 8 ký tự" required="" type="password"/>
<button class="absolute right-3 top-3.5 text-ink-faint hover:text-ink transition-colors" onclick="togglePass('password')" type="button">
<span class="material-symbols-outlined text-xl">visibility</span>
</button>
</div>
</div>
<div>
<label class="block font-body-sm text-body-sm font-semibold text-ink mb-1.5" for="password_confirm">
                Nhập lại mật khẩu <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<input class="w-full h-12 px-4 pr-11 rounded-xl bg-surface font-body-md text-body-md text-ink placeholder:text-ink-faint shadow-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red transition-all" id="password_confirm" name="password_confirm" placeholder="Xác nhận mật khẩu" required="" type="password"/>
<button class="absolute right-3 top-3.5 text-ink-faint hover:text-ink transition-colors" onclick="togglePass('password_confirm')" type="button">
<span class="material-symbols-outlined text-xl">visibility</span>
</button>
</div>
</div>
</div>
<!-- Policy Agreement -->
<div class="pt-2">
<label class="flex items-start gap-3 cursor-pointer group select-none">
<input checked="" class="accent-lacquer-red w-5 h-5 rounded mt-0.5 cursor-pointer flex-shrink-0 shadow-sm" required="" type="checkbox"/>
<span class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
                Tôi đồng ý với <a class="font-semibold text-lacquer-red underline hover:text-lacquer-deep transition-colors" href="#">Chính sách người bán</a> và Quy chuẩn kiểm định sản phẩm ShopNest để cùng xây dựng hệ sinh thái bền vững.
              </span>
</label>
</div>
<!-- Submit CTA -->
<div class="pt-3">
<button class="w-full h-12 bg-lacquer-red hover:bg-lacquer-deep active:scale-[0.99] text-on-primary font-headline-3 text-headline-3 rounded-xl shadow-md transition-all duration-150 flex items-center justify-center gap-2 group cursor-pointer" type="submit">
<span>Gửi hồ sơ đăng ký gian hàng</span>
<span class="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
</button>
</div>
</form>
<!-- Trust Note & Review Process -->
<div class="mt-4 flex items-center justify-center gap-2 text-center text-ink-muted font-body-sm text-body-sm">
<span class="w-2 h-2 rounded-full bg-jade flex-shrink-0"></span>
<span>Hồ sơ được xem xét trong 1–2 ngày làm việc. Chuyên viên sẽ gọi xác minh thông tin xưởng.</span>
</div>
<!-- Separation & Secondary Links -->
<div class="mt-8 pt-6 relative text-center">
<div class="absolute inset-x-0 top-0 flex items-center justify-center">
<span class="h-[1px] w-full bg-secondary-fixed"></span>
<span class="relative px-3 bg-warm-porcelain font-label-micro text-label-micro uppercase tracking-widest text-ink-faint">HOẶC</span>
</div>
<p class="font-body-md text-body-md text-ink mt-2">
            Đã có tài khoản người bán? 
            <a class="text-lacquer-red font-semibold underline hover:text-lacquer-deep transition-colors ml-1" href="#">Đăng nhập ngay</a>
</p>
<a class="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors mt-3" href="#">
<span class="material-symbols-outlined text-base">west</span>
            Quay lại trang mua sắm ShopNest
          </a>
</div>
</div>
</div>
</div>
</div>
<script>
  function togglePass(id) {
    const input = document.getElementById(id);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }
</script></main></body></html>
```
### A04 — Shipper registration
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_blank" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
          "on-primary-container": "#ffd9d3",
          "inverse-on-surface": "#f5f0e5",
          "brick": "#8B2A24",
          "on-surface": "#1d1c15",
          "on-secondary-fixed": "#1d1b17",
          "on-tertiary-fixed-variant": "#4b463a",
          "on-secondary-fixed-variant": "#494641",
          "surface-container-highest": "#e7e2d7",
          "on-tertiary": "#ffffff",
          "surface-container-high": "#ede8dd",
          "on-tertiary-container": "#e9e0cf",
          "surface-variant": "#e7e2d7",
          "primary-fixed-dim": "#ffb4aa",
          "tertiary-fixed": "#eae2d1",
          "tertiary-fixed-dim": "#cec6b5",
          "primary-fixed": "#ffdad5",
          "on-secondary-container": "#67645f",
          "inverse-surface": "#323029",
          "tertiary": "#514b3f",
          "on-error-container": "#93000a",
          "surface": "#fef9ee",
          "warm-porcelain": "#FFFCF4",
          "primary-container": "#b23a2f",
          "surface-tint": "#aa342a",
          "on-primary-fixed": "#410001",
          "on-secondary": "#ffffff",
          "jade": "#2F6B57",
          "lacquer-deep": "#8C2A22",
          "border": "#DCD1BE",
          "error-container": "#ffdad6",
          "on-background": "#1d1c15",
          "ink-faint": "#9A8F7F",
          "surface-container-lowest": "#ffffff",
          "surface-container": "#f2ede2",
          "lacquer-red": "#B23A2F",
          "on-error": "#ffffff",
          "inverse-primary": "#ffb4aa",
          "logo-blue": "#4991D8",
          "secondary-fixed-dim": "#cbc6bf",
          "tertiary-container": "#696356",
          "primary": "#91221a",
          "lacquer-wash": "#F2DCD5",
          "surface-dim": "#dedacf",
          "ink-muted": "#6B6458",
          "secondary-fixed": "#e8e2db",
          "surface-container-low": "#f8f3e8",
          "background": "#fef9ee",
          "on-surface-variant": "#58413e",
          "secondary-container": "#e8e2db",
          "on-primary": "#ffffff",
          "outline": "#8c716d",
          "outline-variant": "#dfbfbb",
          "raw-linen": "#EDE4D3",
          "secondary": "#615e59",
          "surface-bright": "#fef9ee",
          "on-tertiary-fixed": "#1f1b11",
          "turmeric": "#8A5A1A",
          "ink": "#1D1B17",
          "error": "#ba1a1a",
          "rice-paper": "#F6F1E6",
          "on-primary-fixed-variant": "#891c16"
        },
        "borderRadius": {
          "DEFAULT": "0.25rem",
          "lg": "0.5rem",
          "xl": "0.75rem",
          "full": "9999px"
        },
        "spacing": {
          "margin-mobile": "1.25rem",
          "space-sm": "0.5rem",
          "gutter-mobile": "1rem",
          "space-lg": "1.5rem",
          "space-xs": "0.25rem",
          "gutter": "1.5rem",
          "margin": "3rem",
          "space-xl": "2.5rem",
          "space-md": "1rem"
        },
        "fontFamily": {
          "headline-1": [
            "Newsreader"
          ],
          "body-md": [
            "Be Vietnam Pro"
          ],
          "display-xl-mobile": [
            "Newsreader"
          ],
          "headline-2": [
            "Newsreader"
          ],
          "label-micro": [
            "Be Vietnam Pro"
          ],
          "body-lg": [
            "Be Vietnam Pro"
          ],
          "display-xl": [
            "Newsreader"
          ],
          "display-lg": [
            "Newsreader"
          ],
          "headline-3": [
            "Be Vietnam Pro"
          ],
          "label-code": [
            "JetBrains Mono"
          ],
          "display-lg-mobile": [
            "Newsreader"
          ],
          "body-sm": [
            "Be Vietnam Pro"
          ]
        },
        "fontSize": {
          "headline-1": [
            "36px",
            {
              "lineHeight": "40px",
              "letterSpacing": "-0.025em",
              "fontWeight": "600"
            }
          ],
          "body-md": [
            "16px",
            {
              "lineHeight": "26px",
              "fontWeight": "400"
            }
          ],
          "display-xl-mobile": [
            "40px",
            {
              "lineHeight": "40px",
              "letterSpacing": "-0.03em",
              "fontWeight": "600"
            }
          ],
          "headline-2": [
            "28px",
            {
              "lineHeight": "32px",
              "letterSpacing": "-0.02em",
              "fontWeight": "600"
            }
          ],
          "label-micro": [
            "12px",
            {
              "lineHeight": "16px",
              "letterSpacing": "0.12em",
              "fontWeight": "600"
            }
          ],
          "body-lg": [
            "18px",
            {
              "lineHeight": "28px",
              "fontWeight": "400"
            }
          ],
          "display-xl": [
            "64px",
            {
              "lineHeight": "60px",
              "letterSpacing": "-0.035em",
              "fontWeight": "600"
            }
          ],
          "display-lg": [
            "48px",
            {
              "lineHeight": "48px",
              "letterSpacing": "-0.03em",
              "fontWeight": "600"
            }
          ],
          "headline-3": [
            "18px",
            {
              "lineHeight": "24px",
              "letterSpacing": "-0.01em",
              "fontWeight": "600"
            }
          ],
          "label-code": [
            "14px",
            {
              "lineHeight": "20px",
              "fontWeight": "500"
            }
          ],
          "display-lg-mobile": [
            "32px",
            {
              "lineHeight": "34px",
              "letterSpacing": "-0.025em",
              "fontWeight": "600"
            }
          ],
          "body-sm": [
            "14px",
            {
              "lineHeight": "21px",
              "fontWeight": "400"
            }
          ]
        }
      }
    }
  }</script></head><body class="bg-rice-paper font-body-md text-body-md text-ink antialiased min-h-screen"><main class="w-full min-h-screen bg-rice-paper"><div class="flex flex-col w-full">
<div class="w-full max-w-[1440px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-rice-paper">
<!-- LEFT PANEL: Editorial, Philosophy, Operational Credo -->
<div class="lg:col-span-6 bg-rice-paper p-8 lg:p-16 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-border">
<div class="space-y-10">
<!-- Brand Lockup -->
<div class="flex items-center justify-between">
<div class="flex items-center space-x-3">
<div class="w-10 h-10 rounded-lg bg-warm-porcelain flex items-center justify-center p-1.5 border border-border shadow-sm">
<svg class="w-full h-full" fill="none" viewbox="0 0 300 300">
<path d="M150 25C188 25 218 56 218 95V106C227 108 236 112 244 117L216 145C213 142 208 140 203 140H198V95C198 67 176 45 150 45C124 45 102 67 102 95V110H97C90 110 83 113 77 117L97 97C97 56 122 25 150 25Z" fill="#B23A2F"></path>
<path d="M150 120L75 195C50 220 50 260 75 285C100 310 140 310 165 285L225 225L150 150" stroke="#B23A2F" stroke-linecap="round" stroke-linejoin="round" stroke-width="26"></path>
<path d="M115 155L190 80C215 55 255 55 280 80C305 105 305 145 280 170L160 290" stroke="#B23A2F" stroke-linecap="round" stroke-linejoin="round" stroke-width="26"></path>
</svg>
</div>
<div class="flex flex-col">
<span class="font-headline-2 text-headline-2 tracking-tight text-ink leading-none">ShopNest</span>
<span class="font-label-micro text-label-micro uppercase tracking-widest text-ink-muted mt-1">Nếp Sống Thủ Công</span>
</div>
</div>
<span class="px-2.5 py-1 rounded-full bg-raw-linen text-ink-muted font-label-micro text-[11px] uppercase tracking-wider border border-border/80">
            Đối tác vận chuyển
          </span>
</div>
<!-- Editorial Copy -->
<div class="space-y-4 pt-2">
<div class="inline-flex items-center space-x-2">
<span class="w-1.5 h-1.5 rounded-full bg-lacquer-red"></span>
<span class="font-label-micro text-label-micro uppercase tracking-widest text-lacquer-deep">Giao hàng cùng ShopNest</span>
</div>
<h1 class="font-headline-1 text-headline-1 text-ink tracking-tight font-semibold max-w-md">
            Mỗi chuyến đi, một tổ ấm.
          </h1>
<p class="font-body-md text-body-md text-ink-muted max-w-xl leading-relaxed">
            Đồng hành đưa những gói hàng mộc mạc, chỉn chu từ bàn tay người thợ gốm, nghệ nhân dệt Việt Nam tới tận tay các tổ ấm bình yên trên từng góc phố.
          </p>
</div>
<!-- Curated Editorial Visual -->
<div class="relative rounded-2xl overflow-hidden border border-border bg-warm-porcelain shadow-sm group">
<div class="w-full h-64 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.02]" data-alt="Editorial warm photograph of an artisanal parcel made of natural kraft paper and twine, resting on the wooden luggage rack of a vintage bicycle under morning sun filtering through Hanoi tamarind trees. Calm, disciplined, tactile craft aesthetic with earthy linen, terracotta and muted tones." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgLWxUpXYtcAYuNKyoDaXV3a7JaEeAsgcYhUogei9wmjXRmOzB15D32AZ5-hieJHapXmr7YZTqEbNRpatjPM1MDPXoU-0SzcC7VDHisMcx9cOtrXf63HuPiRjVawLVUAlGJuN9ab1-6_CLKoMY_6nVA2rM66qRY8FJcCcvfLlR6OofYuwH4RffYXNbGGhUuiqOVDIkSqbC3vEkt6efS8ZHt4zDjD6kG3kCurZmBg')">
</div>
<div class="p-4 bg-warm-porcelain border-t border-border flex items-center justify-between">
<div class="flex items-center space-x-2.5">
<span class="material-symbols-outlined text-jade text-[20px]">verified</span>
<span class="font-body-sm text-body-sm text-ink font-medium">Giao nhận an tâm</span>
</div>
<span class="font-body-sm text-body-sm text-ink-muted italic">Tôn trọng từng món đồ tuyển chọn</span>
</div>
</div>
<!-- 3 Disciplined Factual Value Propositions -->
<div class="space-y-4 pt-2">
<div class="flex items-start space-x-4 p-4 rounded-xl bg-warm-porcelain/60 border border-border">
<div class="w-9 h-9 rounded-lg bg-raw-linen flex items-center justify-center text-ink shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[20px]">schedule</span>
</div>
<div class="space-y-0.5">
<h2 class="font-headline-3 text-headline-3 text-ink">Ca linh hoạt</h2>
<p class="font-body-sm text-body-sm text-ink-muted">Tự chủ thời gian nhận đơn theo lịch trình cá nhân trong ngày, phù hợp với nhịp sống riêng.</p>
</div>
</div>
<div class="flex items-start space-x-4 p-4 rounded-xl bg-warm-porcelain/60 border border-border">
<div class="w-9 h-9 rounded-lg bg-raw-linen flex items-center justify-center text-ink shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[20px]">near_me</span>
</div>
<div class="space-y-0.5">
<h2 class="font-headline-3 text-headline-3 text-ink">Đơn trong thành phố</h2>
<p class="font-body-sm text-body-sm text-ink-muted">Bán kính giao nhận tối ưu theo khu vực quận/huyện đã đăng ký, hạn chế tối đa việc di chuyển chồng chéo.</p>
</div>
</div>
<div class="flex items-start space-x-4 p-4 rounded-xl bg-warm-porcelain/60 border border-border">
<div class="w-9 h-9 rounded-lg bg-raw-linen flex items-center justify-center text-ink shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[20px]">support_agent</span>
</div>
<div class="space-y-0.5">
<h2 class="font-headline-3 text-headline-3 text-ink">Hỗ trợ khi cần</h2>
<p class="font-body-sm text-body-sm text-ink-muted">Đội ngũ điều phối túc trực qua tổng đài và ứng dụng trong suốt ca giao để xử lý các phát sinh về địa chỉ hay đóng gói.</p>
</div>
</div>
</div>
</div>
<!-- Support Footnote -->
<div class="pt-10 mt-10 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-body-sm text-body-sm text-ink-muted">
<div>
<span>Tổng đài đối tác: </span>
<span class="font-label-code text-ink font-semibold">1900 6886</span>
<span class="text-ink-faint"> (nhánh 3)</span>
</div>
<div class="font-label-code text-[13px] text-ink-faint">
          vantai@shopnest.vn
        </div>
</div>
</div>
<!-- RIGHT PANEL: Registration Ledger Form -->
<div class="lg:col-span-6 bg-warm-porcelain p-8 lg:p-16 flex flex-col justify-between">
<div class="max-w-xl mx-auto w-full space-y-8">
<!-- Header -->
<div class="space-y-3">
<div class="inline-flex items-center px-3 py-1 rounded-full bg-lacquer-wash text-lacquer-deep font-label-micro text-label-micro uppercase tracking-wider font-semibold">
            Giao Vận Tinh Tận
          </div>
<h2 class="font-headline-1 text-headline-1 text-ink font-semibold tracking-tight">
            Đăng ký giao hàng
          </h2>
<p class="font-body-md text-body-md text-ink-muted">
            Điền thông tin cơ bản để tham gia mạng lưới vận chuyển tuyển chọn của ShopNest.
          </p>
</div>
<!-- Form Elements -->
<form class="space-y-5" id="shipper-form" onsubmit="event.preventDefault(); handleSubmit();">
<!-- Full Name -->
<div class="space-y-1.5">
<label class="block font-body-sm text-body-sm font-semibold text-ink" for="fullName">
              Họ và tên <span class="text-lacquer-red">*</span>
</label>
<input class="w-full h-12 px-4 rounded-xl border border-border bg-rice-paper/50 text-ink placeholder-ink-faint font-body-md text-body-md focus:outline-none focus:border-lacquer-red focus:bg-warm-porcelain transition-colors" id="fullName" name="fullName" placeholder="VD: Nguyễn Văn Nam" required="" type="text"/>
</div>
<!-- Phone & Email Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="space-y-1.5">
<label class="block font-body-sm text-body-sm font-semibold text-ink" for="phone">
                Số điện thoại <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<input class="w-full h-12 px-4 rounded-xl border border-border bg-rice-paper/50 text-ink placeholder-ink-faint font-label-code text-label-code focus:outline-none focus:border-lacquer-red focus:bg-warm-porcelain transition-colors" id="phone" name="phone" placeholder="0912 345 678" required="" type="tel"/>
</div>
</div>
<div class="space-y-1.5">
<label class="block font-body-sm text-body-sm font-semibold text-ink" for="email">
                Email liên hệ <span class="text-lacquer-red">*</span>
</label>
<input class="w-full h-12 px-4 rounded-xl border border-border bg-rice-paper/50 text-ink placeholder-ink-faint font-body-md text-body-md focus:outline-none focus:border-lacquer-red focus:bg-warm-porcelain transition-colors" id="email" name="email" placeholder="nam.nguyen@gmail.com" required="" type="email"/>
</div>
</div>
<!-- City & Vehicle Selection -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="space-y-1.5">
<label class="block font-body-sm text-body-sm font-semibold text-ink" for="city">
                Tỉnh / Thành phố <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<select class="w-full h-12 px-4 pr-10 rounded-xl border border-border bg-rice-paper/50 text-ink font-body-md text-body-md appearance-none focus:outline-none focus:border-lacquer-red focus:bg-warm-porcelain transition-colors cursor-pointer" id="city" name="city" required="">
<option disabled="" selected="" value="">Chọn tỉnh / thành phố</option>
<option value="HN">Hà Nội</option>
<option value="HCM">TP. Hồ Chí Minh</option>
<option value="DN">Đà Nẵng</option>
<option value="HUE">Thừa Thiên Huế</option>
<option value="CT">Cần Thơ</option>
</select>
<span class="material-symbols-outlined absolute right-3 top-3 text-ink-muted pointer-events-none">
                  expand_more
                </span>
</div>
</div>
<div class="space-y-1.5">
<label class="block font-body-sm text-body-sm font-semibold text-ink" for="vehicle">
                Phương tiện chính <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<select class="w-full h-12 px-4 pr-10 rounded-xl border border-border bg-rice-paper/50 text-ink font-body-md text-body-md appearance-none focus:outline-none focus:border-lacquer-red focus:bg-warm-porcelain transition-colors cursor-pointer" id="vehicle" name="vehicle" required="">
<option disabled="" selected="" value="">Chọn phương tiện</option>
<option value="moto">Xe máy cá nhân</option>
<option value="ev">Xe máy điện / Xe đạp điện</option>
<option value="van">Xe bán tải nhỏ / Xe Van</option>
</select>
<span class="material-symbols-outlined absolute right-3 top-3 text-ink-muted pointer-events-none">
                  expand_more
                </span>
</div>
</div>
</div>
<!-- Password Pair -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="space-y-1.5">
<label class="block font-body-sm text-body-sm font-semibold text-ink" for="password">
                Mật khẩu quản trị <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<input class="w-full h-12 px-4 pr-11 rounded-xl border border-border bg-rice-paper/50 text-ink placeholder-ink-faint font-body-md text-body-md focus:outline-none focus:border-lacquer-red focus:bg-warm-porcelain transition-colors" id="password" name="password" placeholder="Tối thiểu 8 ký tự" required="" type="password"/>
<button aria-label="Ẩn hiện mật khẩu" class="absolute right-3 top-3 text-ink-faint hover:text-ink transition-colors flex items-center justify-center p-0.5" onclick="togglePasswordVisibility('password', this)" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
<div class="space-y-1.5">
<label class="block font-body-sm text-body-sm font-semibold text-ink" for="confirmPassword">
                Xác nhận mật khẩu <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<input class="w-full h-12 px-4 pr-11 rounded-xl border border-border bg-rice-paper/50 text-ink placeholder-ink-faint font-body-md text-body-md focus:outline-none focus:border-lacquer-red focus:bg-warm-porcelain transition-colors" id="confirmPassword" name="confirmPassword" placeholder="Nhập lại mật khẩu" required="" type="password"/>
<button aria-label="Ẩn hiện mật khẩu xác nhận" class="absolute right-3 top-3 text-ink-faint hover:text-ink transition-colors flex items-center justify-center p-0.5" onclick="togglePasswordVisibility('confirmPassword', this)" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
</div>
<!-- Password Requirement Helper -->
<div class="flex items-center space-x-2 text-ink-muted text-[13px]">
<span class="material-symbols-outlined text-[16px] text-turmeric">info</span>
<span>Ít nhất 8 ký tự, bao gồm cả chữ và số để tăng tính an toàn cho ví công nợ.</span>
</div>
<!-- Terms Checkbox -->
<div class="pt-2">
<label class="flex items-start space-x-3 cursor-pointer select-none">
<input class="mt-1 w-4 h-4 rounded text-lacquer-red border-border focus:ring-lacquer-red focus:ring-offset-warm-porcelain accent-lacquer-red cursor-pointer" id="terms" required="" type="checkbox"/>
<span class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
                Tôi đồng ý với 
                <a class="text-ink font-medium underline underline-offset-4 hover:text-lacquer-red transition-colors" href="#">Điều khoản đối tác</a> 
                và 
                <a class="text-ink font-medium underline underline-offset-4 hover:text-lacquer-red transition-colors" href="#">Chính sách bảo mật giao nhận</a> 
                của ShopNest.
              </span>
</label>
</div>
<!-- Submit Button -->
<div class="pt-2">
<button class="w-full h-12 rounded-xl bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain font-body-md text-body-md font-semibold tracking-wide flex items-center justify-center space-x-2 transition-all duration-150 active:scale-[0.99] shadow-sm" type="submit">
<span>Gửi hồ sơ đăng ký</span>
<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
<!-- Review Workflow Notice -->
<div class="p-3.5 rounded-xl bg-rice-paper/80 border border-border flex items-start space-x-3 text-ink-muted">
<span class="material-symbols-outlined text-[18px] text-jade shrink-0 mt-0.5">verified_user</span>
<p class="text-[13px] leading-relaxed">
              Hồ sơ được xem xét trong <strong class="text-ink font-semibold">1–2 ngày làm việc</strong>. Bộ phận Điều phối Vận chuyển sẽ liên hệ qua điện thoại để xếp lịch nhận đồng phục và ký cam kết bảo quản hàng thủ công.
            </p>
</div>
</form>
<!-- Form Footer Navigation -->
<div class="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm">
<div>
<span class="text-ink-muted">Đã có tài khoản đối tác? </span>
<a class="text-lacquer-red font-semibold underline underline-offset-4 hover:text-lacquer-deep transition-colors" href="#">
              Đăng nhập ngay
            </a>
</div>
<a class="inline-flex items-center text-ink-muted hover:text-ink transition-colors group" href="#">
<span class="material-symbols-outlined text-[18px] mr-1 group-hover:-translate-x-0.5 transition-transform">west</span>
            Quay lại sàn ShopNest
          </a>
</div>
</div>
<!-- Micro Ledger Stamp -->
<div class="mt-8 text-center lg:text-right font-label-code text-[11px] text-ink-faint">
        MÃ BIỂU MẪU: SN-LOG-2025/V1 · HỆ THỐNG GIAO VẬN TINH TẬN
      </div>
</div>
</div>
</div>
<script>
  function togglePasswordVisibility(fieldId, btn) {
    const input = document.getElementById(fieldId);
    const icon = btn.querySelector('.material-symbols-outlined');
    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = 'visibility_off';
    } else {
      input.type = 'password';
      icon.textContent = 'visibility';
    }
  }

  function handleSubmit() {
    const pwd = document.getElementById('password').value;
    const confirmPwd = document.getElementById('confirmPassword').value;

    if (pwd !== confirmPwd) {
      alert('Mật khẩu xác nhận chưa khớp. Vui lòng kiểm tra lại.');
      return;
    }

    const name = document.getElementById('fullName').value;
    alert('Hồ sơ đối tác giao vận của ' + name + ' đã được ghi nhận. Đội ngũ ShopNest sẽ liên lạc trong 24-48 giờ làm việc.');
  }
</script></main></body></html>
```
### A05 — Forgot and reset password
```html
<!DOCTYPE html>

<html class="h-full" lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_blank" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"on-secondary-fixed-variant":"#494641","inverse-surface":"#323029","lacquer-deep":"#8C2A22","surface-container-low":"#f8f3e8","surface-dim":"#dedacf","lacquer-red":"#B23A2F","tertiary-fixed-dim":"#cec6b5","outline-variant":"#dfbfbb","background":"#fef9ee","on-primary-fixed":"#410001","on-secondary-container":"#67645f","primary":"#91221a","on-primary-fixed-variant":"#891c16","secondary-container":"#e8e2db","on-secondary":"#ffffff","on-tertiary":"#ffffff","on-tertiary-fixed-variant":"#4b463a","secondary":"#615e59","surface-container-highest":"#e7e2d7","on-primary-container":"#ffd9d3","brick":"#8B2A24","ink-muted":"#6B6458","surface-bright":"#fef9ee","surface-tint":"#aa342a","surface-container-high":"#ede8dd","lacquer-wash":"#F2DCD5","on-primary":"#ffffff","primary-fixed-dim":"#ffb4aa","tertiary-fixed":"#eae2d1","surface":"#fef9ee","on-tertiary-container":"#e9e0cf","inverse-primary":"#ffb4aa","on-secondary-fixed":"#1d1b17","ink-faint":"#9A8F7F","surface-container-lowest":"#ffffff","on-error-container":"#93000a","on-error":"#ffffff","error-container":"#ffdad6","secondary-fixed-dim":"#cbc6bf","raw-linen":"#EDE4D3","warm-porcelain":"#FFFCF4","on-background":"#1d1c15","error":"#ba1a1a","primary-fixed":"#ffdad5","inverse-on-surface":"#f5f0e5","on-tertiary-fixed":"#1f1b11","surface-container":"#f2ede2","tertiary":"#514b3f","on-surface":"#1d1c15","logo-blue":"#4991D8","tertiary-container":"#696356","rice-paper":"#F6F1E6","jade":"#2F6B57","turmeric":"#8A5A1A","on-surface-variant":"#58413e","border":"#DCD1BE","outline":"#8c716d","primary-container":"#b23a2f","surface-variant":"#e7e2d7","secondary-fixed":"#e8e2db","ink":"#1D1B17"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"gutter":"1.5rem","space-xl":"2.5rem","space-xs":"0.25rem","space-lg":"1.5rem","space-sm":"0.5rem","margin":"3rem","margin-mobile":"1.25rem","gutter-mobile":"1rem","space-md":"1rem"},"fontFamily":{"headline-1":["Newsreader"],"body-md":["Be Vietnam Pro"],"display-lg-mobile":["Newsreader"],"body-lg":["Be Vietnam Pro"],"label-micro":["Be Vietnam Pro"],"display-lg":["Newsreader"],"display-xl-mobile":["Newsreader"],"body-sm":["Be Vietnam Pro"],"headline-3":["Be Vietnam Pro"],"headline-2":["Newsreader"],"label-code":["JetBrains Mono"],"display-xl":["Newsreader"]},"fontSize":{"headline-1":["36px",{"lineHeight":"40px","letterSpacing":"-0.025em","fontWeight":"600"}],"body-md":["16px",{"lineHeight":"26px","fontWeight":"400"}],"display-lg-mobile":["32px",{"lineHeight":"34px","letterSpacing":"-0.025em","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"label-micro":["12px",{"lineHeight":"16px","letterSpacing":"0.12em","fontWeight":"600"}],"display-lg":["48px",{"lineHeight":"48px","letterSpacing":"-0.03em","fontWeight":"600"}],"display-xl-mobile":["40px",{"lineHeight":"40px","letterSpacing":"-0.03em","fontWeight":"600"}],"body-sm":["14px",{"lineHeight":"21px","fontWeight":"400"}],"headline-3":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}],"headline-2":["28px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"600"}],"label-code":["14px",{"lineHeight":"20px","fontWeight":"500"}],"display-xl":["64px",{"lineHeight":"60px","letterSpacing":"-0.035em","fontWeight":"600"}]}}}};</script></head><body class="bg-rice-paper text-ink min-h-screen flex flex-col antialiased selection:bg-lacquer-wash selection:text-primary"><header class="w-full py-space-xl px-gutter lg:px-margin"><div class="max-w-7xl mx-auto flex items-center justify-between"><a class="flex items-center gap-space-sm group transition-opacity hover:opacity-90" data-path="login" href="#"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><div class="flex flex-col ml-1"><span class="font-headline-2 text-headline-3 text-ink tracking-tight font-semibold">ShopNest</span><span class="font-label-micro text-label-micro text-ink-faint tracking-widest uppercase">Authentic Craft</span></div></a><div class="flex items-center gap-space-md"><a class="inline-flex items-center gap-space-xs font-body-sm text-body-sm text-ink-muted hover:text-primary transition-colors" data-path="login" href="#"><span class="material-symbols-outlined text-[18px]">arrow_back</span><span>Back to Sign In</span></a></div></div></header><main class="flex-1 flex flex-col justify-center items-center px-gutter py-space-xl"><div class="flex flex-col w-full items-center justify-center">
<!-- Interactive State Controller & Step Switcher (Previewing all 3 states seamlessly) -->
<div class="w-full max-w-[560px] mb-space-lg flex items-center justify-between p-1.5 bg-raw-linen/60 rounded-xl">
<button class="flex-1 py-2 px-3 text-center rounded-lg font-body-sm text-body-sm transition-all text-ink font-semibold bg-warm-porcelain shadow-sm" id="tab-btn-forgot" onclick="switchStep('forgot')" type="button">
      1. Quên mật khẩu
    </button>
<button class="flex-1 py-2 px-3 text-center rounded-lg font-body-sm text-body-sm transition-all text-ink-muted hover:text-ink" id="tab-btn-reset" onclick="switchStep('reset')" type="button">
      2. Đặt mật khẩu mới
    </button>
<button class="flex-1 py-2 px-3 text-center rounded-lg font-body-sm text-body-sm transition-all text-ink-muted hover:text-ink" id="tab-btn-success" onclick="switchStep('success')" type="button">
      3. Hoàn tất &amp; Lỗi
    </button>
</div>
<!-- Main Narrative Stage: 480px elegant vertical column blending into Rice Paper -->
<div class="w-full max-w-[480px] flex flex-col">
<!-- Quiet Brand Block -->
<div class="flex flex-col items-center text-center mb-space-xl">
<div class="w-12 h-12 rounded-xl bg-warm-porcelain flex items-center justify-center p-2 mb-space-sm">
<img alt="ShopNest biểu trưng thủ công" class="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZDERYDko5IwXJXu7lpLjExImC_AmKnsly0_MTAGlO558uUUTRKxpfU7N9wfczVNMzr1QpC45naxxp4cCRTG3gWzS5Nx-kxUMdFmQUywezP0d0CnmvH9ytczQ9gbxrVI-u8pnO9DAytiiS7KqdIvc54QbAHs2AzFKDsm2m5QSckRhMskiGP1fQ5tzMAp3FGEdw8Pm1aa044JWXjoOUrz4PkB7C9JMqIN_7Fo4PioZ310AblL0sUew"/>
</div>
<span class="font-headline-2 text-headline-3 text-ink font-medium tracking-tight">ShopNest</span>
<p class="font-body-sm text-body-sm text-ink-muted mt-1">Khôi phục quyền truy cập an tâm</p>
</div>
<!-- ==================== STATE 1: FORGOT PASSWORD (PRIMARY FOCUS) ==================== -->
<div class="w-full flex flex-col" id="state-forgot">
<div class="text-left mb-space-lg">
<h1 class="font-headline-1 text-headline-1 text-ink mb-2">Quên mật khẩu?</h1>
<p class="font-body-md text-body-md text-ink-muted">Nhập email để nhận liên kết đặt lại mật khẩu an toàn từ hệ thống.</p>
</div>
<!-- Action Form -->
<form class="flex flex-col gap-space-md" id="form-forgot" onsubmit="event.preventDefault(); switchStep('reset');">
<div class="flex flex-col gap-1.5">
<label class="font-headline-3 text-headline-3 text-ink text-sm" for="input-email">Email đăng ký</label>
<div class="relative flex items-center">
<input class="w-full h-12 px-4 rounded-xl bg-warm-porcelain text-ink placeholder:text-ink-faint font-body-md text-body-md outline-none focus:ring-2 focus:ring-lacquer-red transition-all" id="input-email" placeholder="VD: hoanganh@gmail.com" required="" type="email" value="hoanganh@gmail.com"/>
<span class="material-symbols-outlined absolute right-3.5 text-ink-faint text-[20px] pointer-events-none">mail</span>
</div>
</div>
<button class="w-full h-12 mt-2 bg-lacquer-red hover:bg-lacquer-deep active:scale-[0.99] text-warm-porcelain font-headline-3 text-headline-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer" type="submit">
<span>Gửi liên kết</span>
<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</form>
<!-- Sub-links and Subtle Reassurance -->
<div class="mt-space-lg pt-space-md flex flex-col items-center gap-space-sm text-center">
<a class="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors group" data-path="login" href="#">
<span class="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
<span>Quay lại đăng nhập</span>
</a>
<div class="flex items-center gap-2 text-ink-faint font-body-sm text-body-sm mt-space-sm">
<span class="material-symbols-outlined text-[16px] text-jade">verified_user</span>
<span>Bảo mật theo quy chuẩn mã hóa ShopNest</span>
</div>
</div>
</div>
<!-- ==================== STATE 2: RESET PASSWORD ==================== -->
<div class="w-full flex-col hidden" id="state-reset">
<div class="text-left mb-space-lg">
<h1 class="font-headline-1 text-headline-1 text-ink mb-2">Đặt mật khẩu mới</h1>
<p class="font-body-md text-body-md text-ink-muted">Thiết lập lại mật khẩu bảo vệ tài khoản cho email của bạn.</p>
</div>
<form class="flex flex-col gap-space-md" id="form-reset" onsubmit="event.preventDefault(); switchStep('success');">
<!-- Read-only Email Field -->
<div class="flex flex-col gap-1.5">
<label class="font-headline-3 text-headline-3 text-ink text-sm">Tài khoản xác thực</label>
<div class="h-12 px-4 rounded-xl bg-raw-linen/60 text-ink-muted font-label-code text-label-code flex items-center justify-between select-none">
<span class="truncate">hoanganh@gmail.com</span>
<div class="flex items-center gap-1 text-jade font-body-sm text-xs font-medium">
<span class="material-symbols-outlined text-[16px]">lock</span>
<span>Đã xác nhận</span>
</div>
</div>
</div>
<!-- New Password Field -->
<div class="flex flex-col gap-1.5">
<label class="font-headline-3 text-headline-3 text-ink text-sm" for="input-new-pass">Mật khẩu mới</label>
<div class="relative flex items-center">
<input class="w-full h-12 px-4 pr-11 rounded-xl bg-warm-porcelain text-ink placeholder:text-ink-faint font-body-md text-body-md outline-none focus:ring-2 focus:ring-lacquer-red transition-all" id="input-new-pass" placeholder="Nhập mật khẩu mới" required="" type="password"/>
<button class="absolute right-3 text-ink-faint hover:text-ink transition-colors p-1 cursor-pointer" onclick="togglePasswordVisibility('input-new-pass', this)" type="button">
<span class="material-symbols-outlined text-[20px] block">visibility</span>
</button>
</div>
<span class="font-body-sm text-xs text-ink-muted mt-0.5">Ít nhất 8 ký tự, có chữ và số.</span>
</div>
<!-- Confirm Password Field -->
<div class="flex flex-col gap-1.5">
<label class="font-headline-3 text-headline-3 text-ink text-sm" for="input-confirm-pass">Nhập lại mật khẩu</label>
<div class="relative flex items-center">
<input class="w-full h-12 px-4 pr-11 rounded-xl bg-warm-porcelain text-ink placeholder:text-ink-faint font-body-md text-body-md outline-none focus:ring-2 focus:ring-lacquer-red transition-all" id="input-confirm-pass" placeholder="Nhập lại mật khẩu mới" required="" type="password"/>
<button class="absolute right-3 text-ink-faint hover:text-ink transition-colors p-1 cursor-pointer" onclick="togglePasswordVisibility('input-confirm-pass', this)" type="button">
<span class="material-symbols-outlined text-[20px] block">visibility</span>
</button>
</div>
</div>
<!-- Submit Button -->
<button class="w-full h-12 mt-2 bg-lacquer-red hover:bg-lacquer-deep active:scale-[0.99] text-warm-porcelain font-headline-3 text-headline-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer" type="submit">
<span>Lưu mật khẩu mới</span>
</button>
</form>
<div class="mt-space-lg text-center">
<button class="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors" onclick="switchStep('forgot')" type="button">
<span class="material-symbols-outlined text-[16px]">arrow_back</span>
<span>Quay lại nhập email khác</span>
</button>
</div>
</div>
<!-- ==================== STATE 3: SUCCESS STATE & TOKEN NOTIFICATIONS ==================== -->
<div class="w-full flex-col hidden" id="state-success">
<!-- Success Block (Primary) -->
<div class="w-full bg-warm-porcelain rounded-xl p-space-lg flex flex-col items-center text-center">
<div class="w-14 h-14 rounded-full bg-jade/10 text-jade flex items-center justify-center mb-space-md">
<span class="material-symbols-outlined text-[32px]">check_circle</span>
</div>
<h2 class="font-headline-2 text-headline-2 text-ink mb-1.5">Mật khẩu đã được cập nhật an toàn.</h2>
<p class="font-body-md text-body-md text-ink-muted mb-space-lg max-w-[340px]">
          Bạn đã hoàn tất đổi mật khẩu cho tài khoản <span class="font-label-code text-label-code text-ink font-medium">hoanganh@gmail.com</span>.
        </p>
<a class="w-full h-12 bg-lacquer-red hover:bg-lacquer-deep active:scale-[0.99] text-warm-porcelain font-headline-3 text-headline-3 rounded-xl flex items-center justify-center gap-2 transition-all" data-path="login" href="#">
<span>Về trang đăng nhập</span>
<span class="material-symbols-outlined text-[18px]">login</span>
</a>
</div>
<!-- Token Diagnostics / Transparent Fallback Notifications (Without Anxiety) -->
<div class="mt-space-xl pt-space-lg flex flex-col gap-space-sm">
<div class="flex items-center justify-between">
<span class="font-label-micro text-label-micro text-ink-faint uppercase tracking-widest">Trường hợp phụ &amp; Liên kết</span>
<span class="font-label-code text-xs text-ink-faint">Mã: N-408</span>
</div>
<!-- Token Expired / Invalid Notice Card -->
<div class="p-space-md rounded-xl bg-raw-linen/70 flex items-start gap-3">
<span class="material-symbols-outlined text-turmeric text-[20px] mt-0.5 shrink-0">hourglass_disabled</span>
<div class="flex flex-col text-left">
<span class="font-headline-3 text-headline-3 text-ink text-sm">Liên kết đã hết hạn hoặc không khả dụng</span>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">
              Vì lý do an toàn, liên kết chỉ có hiệu lực trong 15 phút. Bạn có thể yêu cầu gửi lại nhẹ nhàng bất kỳ lúc nào.
            </p>
<div class="mt-2.5">
<button class="font-body-sm text-body-sm font-semibold text-lacquer-red hover:text-lacquer-deep transition-colors inline-flex items-center gap-1" onclick="switchStep('forgot')" type="button">
<span>Gửi lại liên kết mới</span>
<span class="material-symbols-outlined text-[16px]">refresh</span>
</button>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Embedded Vanilla JS for smooth tab/state transition & reveal toggles -->
<script>
    function switchStep(step) {
      const states = ['forgot', 'reset', 'success'];
      states.forEach(s => {
        const el = document.getElementById('state-' + s);
        const btn = document.getElementById('tab-btn-' + s);
        if (s === step) {
          el.classList.remove('hidden');
          el.classList.add('flex');
          btn.classList.add('bg-warm-porcelain', 'text-ink', 'shadow-sm', 'font-semibold');
          btn.classList.remove('text-ink-muted');
        } else {
          el.classList.add('hidden');
          el.classList.remove('flex');
          btn.classList.remove('bg-warm-porcelain', 'text-ink', 'shadow-sm', 'font-semibold');
          btn.classList.add('text-ink-muted');
        }
      });
    }

    function togglePasswordVisibility(inputId, btn) {
      const input = document.getElementById(inputId);
      const icon = btn.querySelector('.material-symbols-outlined');
      if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility_off';
      } else {
        input.type = 'password';
        icon.textContent = 'visibility';
      }
    }
  </script>
</div></main><footer class="w-full py-space-lg px-gutter lg:px-margin"><div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-sm"><span class="font-body-sm text-body-sm text-ink-faint">© 2024 ShopNest. Crafted with order and discipline.</span><div class="flex items-center gap-space-lg"><a class="font-body-sm text-body-sm text-ink-muted hover:text-primary transition-colors" href="#">Security &amp; Privacy</a><a class="font-body-sm text-body-sm text-ink-muted hover:text-primary transition-colors" href="#">Support Contact</a></div></div></footer></body></html>
```
### A06 — Verify email and confirm password
```html
<!DOCTYPE html>

<html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_blank" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{colors:{"lacquer-red":"#B23A2F","secondary-fixed":"#e8e2db","warm-porcelain":"#FFFCF4","on-tertiary-fixed":"#1f1b11","on-tertiary-fixed-variant":"#4b463a","on-primary":"#ffffff","secondary":"#615e59","surface-container-highest":"#e7e2d7","on-secondary-container":"#67645f","on-primary-fixed":"#410001","ink-muted":"#6B6458","tertiary-fixed-dim":"#cec6b5","secondary-container":"#e8e2db","surface-bright":"#fef9ee","primary-fixed-dim":"#ffb4aa","surface-variant":"#e7e2d7","jade":"#2F6B57","on-tertiary":"#ffffff","lacquer-deep":"#8C2A22","primary-fixed":"#ffdad5","rice-paper":"#F6F1E6","outline":"#8c716d","tertiary-container":"#696356","turmeric":"#8A5A1A","surface-container-lowest":"#ffffff","inverse-primary":"#ffb4aa","inverse-surface":"#323029","surface":"#fef9ee","on-error":"#ffffff","ink":"#1D1B17","brick":"#8B2A24","surface-tint":"#aa342a","error":"#ba1a1a","raw-linen":"#EDE4D3","on-background":"#1d1c15","tertiary-fixed":"#eae2d1","on-surface-variant":"#58413e","outline-variant":"#dfbfbb","primary":"#91221a","on-secondary-fixed":"#1d1b17","lacquer-wash":"#F2DCD5","on-secondary":"#ffffff","surface-container":"#f2ede2","on-secondary-fixed-variant":"#494641","error-container":"#ffdad6","tertiary":"#514b3f","on-tertiary-container":"#e9e0cf","surface-container-high":"#ede8dd","on-primary-fixed-variant":"#891c16","border":"#DCD1BE","ink-faint":"#9A8F7F","inverse-on-surface":"#f5f0e5","primary-container":"#b23a2f","secondary-fixed-dim":"#cbc6bf","on-surface":"#1d1c15","on-error-container":"#93000a","on-primary-container":"#ffd9d3","surface-dim":"#dedacf","surface-container-low":"#f8f3e8","background":"#fef9ee","logo-blue":"#4991D8"},borderRadius:{DEFAULT:"0.25rem",lg:"0.5rem",xl:"0.75rem",full:"9999px"},spacing:{"space-lg":"1.5rem","gutter-mobile":"1rem","space-md":"1rem","space-xl":"2.5rem","space-xs":"0.25rem","space-sm":"0.5rem",gutter:"1.5rem",margin:"3rem","margin-mobile":"1.25rem"},fontFamily:{"label-code":["JetBrains Mono"],"display-xl-mobile":["Newsreader"],"body-md":["Be Vietnam Pro"],"headline-1":["Newsreader"],"label-micro":["Be Vietnam Pro"],"headline-2":["Newsreader"],"display-lg":["Newsreader"],"display-xl":["Newsreader"],"headline-3":["Be Vietnam Pro"],"display-lg-mobile":["Newsreader"],"body-lg":["Be Vietnam Pro"],"body-sm":["Be Vietnam Pro"]},fontSize:{"label-code":["14px",{lineHeight:"20px",fontWeight:"500"}],"display-xl-mobile":["40px",{lineHeight:"40px",letterSpacing:"-0.03em",fontWeight:"600"}],"body-md":["16px",{lineHeight:"26px",fontWeight:"400"}],"headline-1":["36px",{lineHeight:"40px",letterSpacing:"-0.025em",fontWeight:"600"}],"label-micro":["12px",{lineHeight:"16px",letterSpacing:"0.12em",fontWeight:"600"}],"headline-2":["28px",{lineHeight:"32px",letterSpacing:"-0.02em",fontWeight:"600"}],"display-lg":["48px",{lineHeight:"48px",letterSpacing:"-0.03em",fontWeight:"600"}],"display-xl":["64px",{lineHeight:"60px",letterSpacing:"-0.035em",fontWeight:"600"}],"headline-3":["18px",{lineHeight:"24px",letterSpacing:"-0.01em",fontWeight:"600"}],"display-lg-mobile":["32px",{lineHeight:"34px",letterSpacing:"-0.025em",fontWeight:"600"}],"body-lg":["18px",{lineHeight:"28px",fontWeight:"400"}],"body-sm":["14px",{lineHeight:"21px",fontWeight:"400"}]}}}}</script></head><body class="bg-rice-paper font-body-md text-body-md text-ink min-h-screen flex flex-col justify-between selection:bg-lacquer-wash selection:text-ink"><header class="w-full py-space-md px-gutter-mobile lg:px-gutter"><div class="max-w-7xl mx-auto flex items-center justify-between"><a class="flex items-center gap-space-sm group" data-path="login" href="#"><span class="font-headline-3 text-headline-3 text-ink tracking-tight">ShopNest</span></a><a class="inline-flex items-center gap-space-xs font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors" data-path="login" href="#"><span class="material-symbols-outlined text-[18px]">arrow_back</span><span>Return to Store</span></a></div></header><main class="flex-1 w-full max-w-7xl mx-auto px-gutter-mobile lg:px-gutter flex items-center justify-center py-space-xl"><div class="flex flex-col w-full items-center justify-center">
<div class="w-full max-w-[520px] mx-auto">
<!-- Top Minimalist Tab Switcher -->
<div class="flex items-center justify-center mb-space-lg">
<div class="inline-flex p-1 bg-surface-container rounded-xl">
<button class="px-space-md py-2 rounded-lg font-body-sm text-body-sm transition-all text-ink font-medium bg-warm-porcelain shadow-sm flex items-center gap-1.5" id="tab-btn-email" onclick="switchMode('email')" type="button">
<span class="material-symbols-outlined text-[18px] text-lacquer-red">mark_email_read</span>
<span>Xác thực email</span>
</button>
<button class="px-space-md py-2 rounded-lg font-body-sm text-body-sm transition-all text-ink-muted hover:text-ink font-medium flex items-center gap-1.5" id="tab-btn-password" onclick="switchMode('password')" type="button">
<span class="material-symbols-outlined text-[18px]">lock_reset</span>
<span>Xác nhận mật khẩu</span>
</button>
</div>
</div>
<!-- Main Architectural Container with 1px structural framing -->
<div class="w-full bg-warm-porcelain rounded-2xl p-8 sm:p-10 border border-border">
<!-- MODE 1: Xác Thực Email (Email Verification) -->
<section class="flex flex-col items-center text-center" id="panel-email">
<!-- Badge Icon -->
<div class="w-14 h-14 rounded-full bg-rice-paper border border-border flex items-center justify-center mb-space-md relative">
<span class="material-symbols-outlined text-[26px] text-lacquer-red">shield_with_heart</span>
<span class="absolute top-0 right-0 w-3 h-3 rounded-full bg-jade"></span>
</div>
<!-- Heading & Editorial Subtext -->
<span class="font-label-micro text-label-micro text-ink-muted uppercase tracking-wider mb-space-xs">Nếp An Nhiên • Bước 02 / 02</span>
<h1 class="font-headline-1 text-headline-1 text-ink mb-space-sm tracking-tight">Xác thực email</h1>
<p class="font-body-md text-body-md text-ink-muted leading-relaxed mb-space-lg text-center max-w-[420px]">
          Chúng tôi đã gửi liên kết kích hoạt đến <span class="font-medium text-ink bg-surface-container px-2 py-0.5 rounded text-body-sm">thuha.nguyen@gmail.com</span>. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác hoặc quảng cáo) để kích hoạt toàn diện quyền lợi tài khoản.
        </p>
<!-- Status Simulator Pill Row (Interactive) -->
<div class="w-full bg-rice-paper rounded-xl p-3 mb-space-lg text-left">
<div class="flex items-center justify-between mb-2">
<span class="font-label-micro text-label-micro text-ink-faint uppercase">Trạng thái mô phỏng</span>
<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-label-code bg-surface-container-high text-ink" id="demo-indicator">
<span class="w-1.5 h-1.5 rounded-full bg-turmeric"></span>
<span>Đã gửi (Sent)</span>
</span>
</div>
<div class="grid grid-cols-4 gap-1">
<button class="state-pill active px-1 py-1 rounded text-center text-xs font-label-code bg-warm-porcelain text-ink transition-colors" onclick="setDemoState('sent')" type="button">Gửi</button>
<button class="state-pill px-1 py-1 rounded text-center text-xs font-label-code text-ink-muted hover:text-ink transition-colors" onclick="setDemoState('verifying')" type="button">Đang xử lý</button>
<button class="state-pill px-1 py-1 rounded text-center text-xs font-label-code text-ink-muted hover:text-ink transition-colors" onclick="setDemoState('verified')" type="button">Thành công</button>
<button class="state-pill px-1 py-1 rounded text-center text-xs font-label-code text-ink-muted hover:text-ink transition-colors" onclick="setDemoState('expired')" type="button">Hết hạn</button>
</div>
</div>
<!-- Dynamic Status Notification Box -->
<div class="w-full mb-space-md hidden" id="status-notification-box"></div>
<!-- Actions -->
<div class="w-full flex flex-col gap-3 mb-space-lg">
<button class="w-full h-12 bg-lacquer-red hover:bg-lacquer-deep active:scale-[0.99] text-warm-porcelain font-headline-3 text-headline-3 rounded-xl transition-all flex items-center justify-center gap-2 group" id="btn-resend-email" onclick="handleResendEmail()" type="button">
<span class="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-12">send</span>
<span>Gửi lại email xác thực</span>
</button>
<button class="w-full h-11 bg-transparent hover:bg-lacquer-wash text-ink font-body-sm text-body-sm rounded-xl transition-colors border border-border flex items-center justify-center gap-1.5" onclick="openEmailChangeModal()" type="button">
<span class="material-symbols-outlined text-[18px] text-ink-muted">edit</span>
<span>Đổi địa chỉ email khác</span>
</button>
</div>
<!-- Helper Notice -->
<div class="w-full pt-space-md border-t border-border flex items-center justify-between font-label-code text-label-code text-ink-muted">
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-ink-faint">schedule</span>
<span class="text-xs">Hiệu lực trong <span class="text-ink font-semibold">60 phút</span></span>
</div>
<a class="text-xs text-lacquer-red hover:underline underline-offset-4 decoration-1 font-body-sm" href="#">Trung tâm trợ giúp</a>
</div>
</section>
<!-- MODE 2: Xác Nhận Mật Khẩu (Confirm Password for Sensitive Action) -->
<section class="hidden flex flex-col" id="panel-password">
<!-- Subheading metadata -->
<div class="flex items-center justify-between mb-space-sm pb-space-sm border-b border-border">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-lacquer-red">verified_user</span>
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Yêu cầu bảo mật cấp cao</span>
</div>
<span class="font-label-code text-xs px-2 py-0.5 rounded bg-surface-container text-ink-muted">Thao tác nhạy cảm</span>
</div>
<h2 class="font-headline-1 text-headline-1 text-ink mb-1 tracking-tight">Xác nhận mật khẩu</h2>
<p class="font-body-md text-body-md text-ink-muted mb-space-lg">Nhập mật khẩu hiện tại của tài khoản để tiếp tục lưu thay đổi thiết lập hệ thống.</p>
<!-- Read-only Account Pill -->
<div class="w-full p-3 rounded-xl bg-rice-paper flex items-center justify-between mb-space-lg">
<div class="flex items-center gap-2.5 min-w-0">
<div class="w-8 h-8 rounded-full bg-raw-linen flex items-center justify-center text-ink font-medium font-body-sm text-xs flex-shrink-0">
              TN
            </div>
<div class="min-w-0 flex flex-col text-left">
<span class="font-body-sm text-body-sm text-ink font-medium truncate">Nguyễn Thu Hà</span>
<span class="font-label-code text-xs text-ink-muted truncate">thuha.nguyen@gmail.com</span>
</div>
</div>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body-sm bg-warm-porcelain border border-border text-jade flex-shrink-0">
<span class="material-symbols-outlined text-[14px]">check_circle</span>
<span>Đã định danh</span>
</span>
</div>
<!-- Form fields -->
<form class="w-full flex flex-col gap-space-md" id="confirm-pwd-form" onsubmit="handlePasswordSubmit(event)">
<div class="flex flex-col gap-1.5 text-left">
<div class="flex items-center justify-between">
<label class="font-body-sm text-body-sm font-medium text-ink" for="current-password">Mật khẩu hiện tại</label>
<a class="font-body-sm text-xs text-lacquer-red hover:underline underline-offset-4 decoration-1" href="#">Quên mật khẩu?</a>
</div>
<div class="relative">
<input class="w-full h-11 px-3.5 pr-11 bg-warm-porcelain border border-border rounded-xl text-ink font-body-md text-body-md placeholder:text-ink-faint focus:outline-none focus:border-lacquer-red focus:ring-1 focus:ring-lacquer-red transition-all" id="current-password" placeholder="Nhập mật khẩu của bạn" required="" type="password"/>
<button aria-label="Ẩn hiện mật khẩu" class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink p-1 focus:outline-none" onclick="togglePasswordVisibility('current-password', 'pwd-toggle-icon')" type="button">
<span class="material-symbols-outlined text-[20px]" id="pwd-toggle-icon">visibility</span>
</button>
</div>
<!-- Error State Preview Note -->
<div class="hidden items-center gap-1.5 mt-1 font-body-sm text-xs text-brick" id="pwd-error-msg">
<span class="material-symbols-outlined text-[16px]">error</span>
<span>Mật khẩu không chính xác. Vui lòng kiểm tra lại.</span>
</div>
</div>
<!-- Buttons -->
<div class="flex flex-col gap-2.5 mt-space-sm">
<button class="w-full h-12 bg-lacquer-red hover:bg-lacquer-deep active:scale-[0.99] text-warm-porcelain font-headline-3 text-headline-3 rounded-xl transition-all flex items-center justify-center gap-2" type="submit">
<span class="material-symbols-outlined text-[20px]">check</span>
<span>Xác nhận tiếp tục</span>
</button>
<button class="w-full h-10 bg-transparent text-ink-muted hover:text-ink font-body-sm text-body-sm rounded-xl transition-colors flex items-center justify-center" onclick="switchMode('email')" type="button">
<span>Hủy thao tác và quay lại</span>
</button>
</div>
</form>
<!-- Security footer tag -->
<div class="w-full mt-space-lg pt-space-md border-t border-border flex items-center justify-center gap-2 text-center text-xs font-label-micro text-ink-faint uppercase">
<span class="material-symbols-outlined text-[14px]">lock</span>
<span>Bảo mật 256-bit chuẩn ShopNest Artisanal</span>
</div>
</section>
</div>
<!-- Minimal Back Footnote -->
<div class="mt-space-md text-center">
<p class="font-body-sm text-xs text-ink-faint">
        Cần hỗ trợ trực tiếp? <a class="text-ink hover:text-lacquer-red underline underline-offset-4 transition-colors" href="#">Liên hệ bộ phận Chăm sóc Khách hàng</a>
</p>
</div>
</div>
<!-- Inline Micro-Interactions Script -->
<script>
    function switchMode(mode) {
      const emailPanel = document.getElementById('panel-email');
      const pwdPanel = document.getElementById('panel-password');
      const emailTab = document.getElementById('tab-btn-email');
      const pwdTab = document.getElementById('tab-btn-password');

      if (mode === 'email') {
        emailPanel.classList.remove('hidden');
        pwdPanel.classList.add('hidden');
        emailTab.className = "px-space-md py-2 rounded-lg font-body-sm text-body-sm transition-all text-ink font-medium bg-warm-porcelain shadow-sm flex items-center gap-1.5";
        pwdTab.className = "px-space-md py-2 rounded-lg font-body-sm text-body-sm transition-all text-ink-muted hover:text-ink font-medium flex items-center gap-1.5";
      } else {
        emailPanel.classList.add('hidden');
        pwdPanel.classList.remove('hidden');
        pwdTab.className = "px-space-md py-2 rounded-lg font-body-sm text-body-sm transition-all text-ink font-medium bg-warm-porcelain shadow-sm flex items-center gap-1.5";
        emailTab.className = "px-space-md py-2 rounded-lg font-body-sm text-body-sm transition-all text-ink-muted hover:text-ink font-medium flex items-center gap-1.5";
      }
    }

    function togglePasswordVisibility(inputId, iconId) {
      const input = document.getElementById(inputId);
      const icon = document.getElementById(iconId);
      if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility_off';
      } else {
        input.type = 'password';
        icon.textContent = 'visibility';
      }
    }

    function setDemoState(state) {
      const buttons = document.querySelectorAll('.state-pill');
      buttons.forEach(b => {
        b.classList.remove('bg-warm-porcelain', 'text-ink');
        b.classList.add('text-ink-muted');
      });
      event.target.classList.add('bg-warm-porcelain', 'text-ink');
      event.target.classList.remove('text-ink-muted');

      const indicator = document.getElementById('demo-indicator');
      const notice = document.getElementById('status-notification-box');
      notice.classList.remove('hidden');

      if (state === 'sent') {
        indicator.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-turmeric"></span><span>Đã gửi (Sent)</span>';
        notice.className = "w-full mb-space-md p-3 rounded-xl bg-surface-container border border-border flex items-start gap-2.5 text-left";
        notice.innerHTML = '<span class="material-symbols-outlined text-[18px] text-turmeric mt-0.5">mark_email_unread</span><div class="text-xs font-body-sm text-ink-muted"><p class="font-medium text-ink">Thư đã được bàn giao cho máy chủ gửi thư.</p><p>Hộp thư đến có thể mất từ 1 - 2 phút để đồng bộ.</p></div>';
      } else if (state === 'verifying') {
        indicator.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-logo-blue"></span><span>Đang xác thực (Verifying)</span>';
        notice.className = "w-full mb-space-md p-3 rounded-xl bg-surface-container border border-border flex items-start gap-2.5 text-left";
        notice.innerHTML = '<span class="material-symbols-outlined text-[18px] text-logo-blue mt-0.5 animate-spin">progress_activity</span><div class="text-xs font-body-sm text-ink-muted"><p class="font-medium text-ink">Đang kiểm tra mã thông báo kích hoạt...</p><p>Vui lòng giữ cửa sổ này mở trong giây lát.</p></div>';
      } else if (state === 'verified') {
        indicator.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-jade"></span><span>Đã xác thực (Verified)</span>';
        notice.className = "w-full mb-space-md p-3 rounded-xl bg-surface-container border border-border flex items-start gap-2.5 text-left";
        notice.innerHTML = '<span class="material-symbols-outlined text-[18px] text-jade mt-0.5">check_circle</span><div class="text-xs font-body-sm text-ink-muted"><p class="font-medium text-ink">Tài khoản đã hoàn tất xác thực!</p><p>Đang chuyển tiếp về gian hàng ShopNest của bạn...</p></div>';
      } else if (state === 'expired') {
        indicator.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-brick"></span><span>Hết hạn (Expired)</span>';
        notice.className = "w-full mb-space-md p-3 rounded-xl bg-lacquer-wash border border-border flex items-start gap-2.5 text-left";
        notice.innerHTML = '<span class="material-symbols-outlined text-[18px] text-brick mt-0.5">warning</span><div class="text-xs font-body-sm text-brick"><p class="font-medium">Liên kết xác minh đã quá hạn 60 phút.</p><p class="text-ink-muted">Vui lòng nhấp "Gửi lại email xác thực" để nhận liên kết mới.</p></div>';
      }
    }

    function handleResendEmail() {
      const btn = document.getElementById('btn-resend-email');
      const originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span><span>Đang gửi lại...</span>';
      
      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">check</span><span>Đã gửi email mới!</span>';
        setDemoState('sent');
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalHtml;
        }, 3000);
      }, 1000);
    }

    function handlePasswordSubmit(e) {
      e.preventDefault();
      const pwdInput = document.getElementById('current-password');
      const errorMsg = document.getElementById('pwd-error-msg');
      
      // Demo trigger for error state when password is weak or dummy
      if (pwdInput.value !== 'CorrectPassword123') {
        errorMsg.classList.remove('hidden');
        errorMsg.classList.add('flex');
        pwdInput.classList.add('border-brick');
      } else {
        errorMsg.classList.add('hidden');
        errorMsg.classList.remove('flex');
        pwdInput.classList.remove('border-brick');
        alert('Xác thực danh tính thành công! Tiếp tục tiến trình.');
      }
    }

    function openEmailChangeModal() {
      const newEmail = prompt('Nhập địa chỉ email mới của bạn:', 'thuha.nguyen@gmail.com');
      if (newEmail && newEmail.includes('@')) {
        alert('Địa chỉ email mới đã lưu. Chúng tôi đã gửi lại liên kết đến: ' + newEmail);
      }
    }
  </script>
</div></main><footer class="w-full py-space-lg px-gutter-mobile lg:px-gutter"><div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-micro text-label-micro text-ink-faint uppercase"><p>© ShopNest Artisanal Commerce. All rights reserved.</p><div class="flex items-center gap-space-lg"><a class="hover:text-ink transition-colors" data-path="privacy-policy" href="#">Privacy Policy</a><a class="hover:text-ink transition-colors" data-path="terms-of-service" href="#">Terms of Service</a><a class="hover:text-ink transition-colors" data-path="help-center" href="#">Assistance</a></div></div></footer></body></html>
```
### S01 - Home
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"surface-container-low":"#f8f3e8","on-surface-variant":"#58413e","error":"#ba1a1a","on-primary-fixed-variant":"#891c16","lacquer-red":"#B23A2F","lacquer-deep":"#8C2A22","background":"#fef9ee","tertiary-fixed":"#eae2d1","on-tertiary":"#ffffff","tertiary-fixed-dim":"#cec6b5","on-error-container":"#93000a","inverse-surface":"#323029","tertiary-container":"#696356","surface-variant":"#e7e2d7","on-background":"#1d1c15","lacquer-wash":"#F2DCD5","surface":"#fef9ee","primary":"#91221a","secondary-container":"#e8e2db","surface-tint":"#aa342a","on-tertiary-container":"#e9e0cf","secondary":"#615e59","brick":"#8B2A24","surface-container-high":"#ede8dd","on-surface":"#1d1c15","surface-container-lowest":"#ffffff","on-tertiary-fixed":"#1f1b11","raw-linen":"#EDE4D3","surface-container":"#f2ede2","on-primary":"#ffffff","rice-paper":"#F6F1E6","primary-fixed":"#ffdad5","surface-container-highest":"#e7e2d7","outline":"#8c716d","on-secondary-fixed-variant":"#494641","tertiary":"#514b3f","secondary-fixed":"#e8e2db","on-secondary-container":"#67645f","error-container":"#ffdad6","on-secondary-fixed":"#1d1b17","on-tertiary-fixed-variant":"#4b463a","ink-faint":"#9A8F7F","surface-bright":"#fef9ee","on-secondary":"#ffffff","inverse-primary":"#ffb4aa","on-error":"#ffffff","inverse-on-surface":"#f5f0e5","primary-fixed-dim":"#ffb4aa","outline-variant":"#dfbfbb","logo-blue":"#4991D8","on-primary-container":"#ffd9d3","border":"#DCD1BE","primary-container":"#b23a2f","warm-porcelain":"#FFFCF4","ink":"#1D1B17","turmeric":"#8A5A1A","secondary-fixed-dim":"#cbc6bf","jade":"#2F6B57","on-primary-fixed":"#410001","ink-muted":"#6B6458","surface-dim":"#dedacf"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"space-xs":"0.25rem","space-md":"1rem","space-xl":"2.5rem","space-sm":"0.5rem","gutter":"1.5rem","margin":"3rem","space-lg":"1.5rem","gutter-mobile":"1rem","margin-mobile":"1.25rem"},"fontFamily":{"display-lg":["Newsreader"],"headline-2":["Newsreader"],"body-md":["Be Vietnam Pro"],"headline-1":["Newsreader"],"display-lg-mobile":["Newsreader"],"body-sm":["Be Vietnam Pro"],"label-micro":["Be Vietnam Pro"],"label-code":["JetBrains Mono"],"body-lg":["Be Vietnam Pro"],"headline-3":["Be Vietnam Pro"],"display-xl-mobile":["Newsreader"],"display-xl":["Newsreader"]},"fontSize":{"display-lg":["48px",{"lineHeight":"48px","letterSpacing":"-0.03em","fontWeight":"600"}],"headline-2":["28px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"600"}],"body-md":["16px",{"lineHeight":"26px","fontWeight":"400"}],"headline-1":["36px",{"lineHeight":"40px","letterSpacing":"-0.025em","fontWeight":"600"}],"display-lg-mobile":["32px",{"lineHeight":"34px","letterSpacing":"-0.025em","fontWeight":"600"}],"body-sm":["14px",{"lineHeight":"21px","fontWeight":"400"}],"label-micro":["12px",{"lineHeight":"16px","letterSpacing":"0.12em","fontWeight":"600"}],"label-code":["14px",{"lineHeight":"20px","fontWeight":"500"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"headline-3":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}],"display-xl-mobile":["40px",{"lineHeight":"40px","letterSpacing":"-0.03em","fontWeight":"600"}],"display-xl":["64px",{"lineHeight":"60px","letterSpacing":"-0.035em","fontWeight":"600"}]}}}};</script></head><body class="bg-surface font-body-md text-ink antialiased selection:bg-lacquer-wash selection:text-lacquer-deep"><header class="fixed top-0 left-0 right-0 z-50 bg-rice-paper border-b border-border"><div class="h-20 w-full px-gutter lg:px-margin flex items-center justify-between gap-space-md"><div class="flex items-center gap-space-md shrink-0"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><div class="flex flex-col justify-center"><a class="font-headline-2 text-headline-2 text-ink hover:text-lacquer-red transition-colors leading-none" data-path="trang-chu" href="#">ShopNest</a><span class="font-label-micro text-label-micro text-ink-muted uppercase tracking-wider mt-0.5">Sàn TMĐT Tuyển Chọn</span></div></div><div class="hidden md:flex flex-1 max-w-2xl mx-space-md"><div class="w-full flex items-center bg-warm-porcelain border border-border rounded-xl h-11 px-space-xs focus-within:ring-2 focus-within:ring-lacquer-red focus-within:ring-offset-2 transition-all"><button class="flex items-center gap-1 px-space-sm text-ink-muted hover:text-ink font-body-sm text-body-sm border-r border-border h-7 shrink-0 transition-colors" type="button"><span class="material-symbols-outlined text-[18px]">category</span><span class="hidden lg:inline">Tất cả</span><span class="material-symbols-outlined text-[16px]">expand_more</span></button><input class="w-full bg-transparent px-space-sm font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none" placeholder="Tìm laptop, nồi chiên, xe đẩy..." type="text"/><button class="h-8 px-space-md bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain rounded-lg font-body-sm text-body-sm font-medium flex items-center justify-center gap-1 transition-colors shrink-0" type="button"><span class="material-symbols-outlined text-[18px]">search</span><span class="hidden xl:inline">Tìm kiếm</span></button></div></div><div class="flex items-center gap-space-md shrink-0"><nav class="hidden xl:flex items-center gap-space-md" data-active-classes="text-lacquer-red font-semibold"><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="danh-muc" href="#">Danh mục</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="khuyen-mai" href="#">Khuyến mãi</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="shop-viet" href="#">Shop Việt</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="don-hang" href="#">Đơn hàng</a></nav><div class="hidden sm:flex items-center gap-2 border-l border-border pl-space-md"><span class="font-label-code text-label-code text-ink font-semibold">VI</span><span class="text-border font-light">|</span><span class="font-label-code text-label-code text-ink-muted">VND</span></div><a aria-label="Giỏ hàng" class="relative p-2 text-ink hover:text-lacquer-red transition-colors flex items-center justify-center" data-path="gio-hang" href="#"><span class="material-symbols-outlined text-[24px]">shopping_bag</span><span class="absolute top-1 right-0 w-4 h-4 rounded-full bg-lacquer-red text-warm-porcelain font-label-micro text-[10px] flex items-center justify-center font-bold">3</span></a><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]"><div class="flex flex-col w-full">
<!-- Interactive State Simulation Bar (Subtle floating tool in corner) -->
<aside aria-label="Mô phỏng trải nghiệm" class="fixed bottom-5 right-5 z-40 bg-warm-porcelain border border-border px-space-md py-space-xs rounded-full flex items-center gap-3 text-body-sm shadow-sm">
<div class="flex items-center gap-1.5 font-label-micro text-label-micro text-ink-muted uppercase">
<span class="w-2 h-2 rounded-full bg-jade"></span>
<span>Mô phỏng</span>
</div>
<div class="h-4 w-px bg-border"></div>
<button class="font-body-sm text-body-sm text-ink hover:text-lacquer-red font-medium transition-colors" id="sim-auth-btn" onclick="toggleAuthState()" type="button">
      Khách vãng lai <span class="text-ink-faint text-xs ml-1">(Bấm đổi)</span>
</button>
</aside>
<!-- Section 1: Editorial Hero (7/5 Asymmetric Split) -->
<section class="w-full px-gutter lg:px-margin pt-8 pb-12 bg-surface">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center">
<!-- Left Column (7 cols) -->
<div class="lg:col-span-7 flex flex-col justify-center">
<!-- Eyebrow -->
<div class="flex items-center gap-2 mb-4">
<span class="w-2 h-2 rounded-full bg-lacquer-red"></span>
<span class="font-label-micro text-label-micro uppercase text-ink-muted tracking-[0.12em]">
            Mọi thứ cho tổ ấm Việt
          </span>
</div>
<!-- Headline with inline editorial photography -->
<h1 class="font-display-xl text-display-xl text-ink tracking-tight mb-6 leading-none">
          Chọn 
          <span class="inline-block align-middle mx-1">
<img alt="Laptop tối giản" class="h-11 w-20 rounded-xl object-cover border border-border inline-block" data-alt="Editorial close-up of a sleek ultra-thin graphite grey laptop resting quietly on a warm oak timber desk with soft morning daylight, fine craft aesthetic, warm porcelain and rice paper tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsyW1bsBg0xzD3K06aru5soOwDjgABqPn-RkqiOtgLqqYnJXsVG7Pjx03LZa8WFvp0iRoGFNWKEjePoCgar1z01HWKA2CxzC3aOizT7xAkguV-L25a9asBybACWyk-4Z9F6Ht9RD2rVa-ObmfYhyhCNfNKNZG6z5Z9rDt7TBc6i43qy97UL4KIIGhQkXQ2Wf5ysRMImhErdRgAAvVONKrqDNjksE8B7-NQWh9HcQ"/>
</span>
          đồ thật kỹ,<br/>
          sống 
          <span class="inline-block align-middle mx-1">
<img alt="Gốm mộc nếp nhà" class="h-11 w-20 rounded-xl object-cover border border-border inline-block" data-alt="Warm artisanal dining table scene featuring glazed ceramic earthy bowls, woven natural bamboo placemats, and soft morning steam, muted natural lighting in traditional modern Vietnamese home." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVMcvCqF04Jz7V91a1EifemD_REeZxkUScY4RTrAGfGEeahL5k-x1jX-mlA-LWEbRckSOt1v07VFSd6LOgnAJFvNocF1wHcH-eMKspOEi1sreQuUNmsvjuOdAFkNsdvkTqtC05lYVr44m-Ar6OnenjsjynYFD-vOBwO_Ns5aiMmCNnK5F3hdCAwbTP9UGrM22zLi2GVCGx442PuO7c7C9znFw9cOUT5dCR6qT7xw"/>
</span>
          thật êm.
        </h1>
<!-- Subcopy constrained to 52ch -->
<p class="font-body-lg text-body-lg text-ink-muted max-w-[52ch] mb-8 leading-relaxed">
          Đồ điện tử, gia dụng, nhà cửa, mẹ &amp; bé, thời trang và làm đẹp từ các shop Việt đã kiểm duyệt kỹ lưỡng nguồn cội và độ bền.
        </p>
<!-- Primary Action & Trust Markers -->
<div class="flex flex-col sm:flex-row sm:items-center gap-space-lg">
<a class="h-12 px-7 bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain rounded-xl font-body-md text-body-md font-medium inline-flex items-center justify-center gap-2 transition-all active:translate-y-px group w-fit" data-path="kham-pha" href="#">
<span>Xem chợ hôm nay</span>
<span class="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
</a>
<div class="flex items-center gap-3 text-body-sm font-body-sm text-ink-muted">
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-jade text-[18px]">verified</span>
<span class="font-medium text-ink">1.200+</span> Shop Việt tuyển
            </div>
<span class="text-border">·</span>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-jade text-[18px]">format_image_left</span>
<span>100% kiểm định nguồn gốc</span>
</div>
</div>
</div>
</div>
<!-- Right Column (5 cols): Asymmetric Merchandising Bento Grid -->
<div class="lg:col-span-5 grid grid-cols-2 gap-space-sm">
<!-- Bento Cell 1: Tech -->
<div class="group relative rounded-[20px] bg-warm-porcelain border border-border overflow-hidden p-3 transition-all hover:border-lacquer-red/40">
<div class="aspect-[4/3] w-full rounded-xl overflow-hidden bg-surface-container mb-3">
<img alt="Thiết bị làm việc mỏng nhẹ" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" data-alt="Editorial still life of a sleek silver ultra-thin laptop on raw linen fabric next to handcrafted ceramic coffee mug, warm muted tones, rice paper background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvzZjs3s0n50xX-WJIYvuF_CiKd-YP4PxvvdBX_fr_eXXssUn93TW69RMBoyHZo7ev51YUGi0vEumbfFaSBONZO8y6z5w6T44FMV1xmKNy-enteePwHlhlftPKbm6MS5qojyF097uMNaU4MCkcDekvM9lZaqxqiI7_-JlSsagSaBq2iF_vHcDinhpCKln7L9QbzDo5SbH_Op0cOWD_GfbL00aOMVvCnnKaG0BvCA"/>
</div>
<div class="flex items-baseline justify-between">
<div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block">Điện tử</span>
<h3 class="font-headline-3 text-sm font-semibold text-ink">Bàn làm việc êm</h3>
</div>
<span class="font-label-code text-label-code text-ink-muted text-xs">384 món</span>
</div>
</div>
<!-- Bento Cell 2: Kitchen -->
<div class="group relative rounded-[20px] bg-warm-porcelain border border-border overflow-hidden p-3 transition-all hover:border-lacquer-red/40">
<div class="aspect-[4/3] w-full rounded-xl overflow-hidden bg-surface-container mb-3">
<img alt="Nồi chiên không dầu hơi nước" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" data-alt="Modern matte off-white air fryer cooker sitting neatly on a textured beige quartz kitchen counter with natural steam softly drifting, soft indoor ambiance." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu2SezTaHXAX5fWpq1f8YV-Bdpg4VkL807JnjXlKdWvgHPFXH0s7GGbsQ6ofesOjuMqW2Qic4UsiqZwHKRPQEwwRrmCtT3lUHSW9vGMbdfj4lln1M1OHtuL4mFViNvLoYPwwQeO3biu7-rzhRjmRmTPfZFDbt1fJRv5YeRjrnxr409B5vXa7KCFs2nR8bloXBxPqWpoKG7OUIROrjB0QdaU9pBVF9SGy7D_d3zFg"/>
</div>
<div class="flex items-baseline justify-between">
<div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block">Gia dụng</span>
<h3 class="font-headline-3 text-sm font-semibold text-ink">Bếp nếp nhà</h3>
</div>
<span class="font-label-code text-label-code text-ink-muted text-xs">512 món</span>
</div>
</div>
<!-- Bento Cell 3: Mother & Baby -->
<div class="group relative rounded-[20px] bg-warm-porcelain border border-border overflow-hidden p-3 transition-all hover:border-lacquer-red/40">
<div class="aspect-[4/3] w-full rounded-xl overflow-hidden bg-surface-container mb-3">
<img alt="Xe đẩy em bé gọn nhẹ" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" data-alt="Ultra lightweight minimalist baby stroller folded cleanly against a cream plaster wall with a soft organic cotton baby blanket draped beside it, gentle editorial lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB6K0-swyt7YnhP1orqGSDube4gQ9HveGRlLIQ67ggAxW8NcC36ACvizC7uUxDjV7KJ7Vauk5moZRbFUiyJgd8A3qxF_9uhstIZinBCJba2YZ0HXVklKU_e9fcHHnbj89xx8u9L595R4t05EesqObLt7dUKspwMhySoqOvtTpf-fKLCtCdu9UDpDVtRZ1oMLdAJdRCJv0y53uY9Y0ZArVL_zEemqUYnAfe9Hw_lg"/>
</div>
<div class="flex items-baseline justify-between">
<div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block">Mẹ &amp; Bé</span>
<h3 class="font-headline-3 text-sm font-semibold text-ink">Chăm bé dịu lành</h3>
</div>
<span class="font-label-code text-label-code text-ink-muted text-xs">290 món</span>
</div>
</div>
<!-- Bento Cell 4: Fashion -->
<div class="group relative rounded-[20px] bg-warm-porcelain border border-border overflow-hidden p-3 transition-all hover:border-lacquer-red/40">
<div class="aspect-[4/3] w-full rounded-xl overflow-hidden bg-surface-container mb-3">
<img alt="Vải sợi tự nhiên mộc" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" data-alt="Folded raw unbleached cotton t-shirt with organic weave texture lying on natural textured timber, minimal editorial fashion still life, warm natural sunlight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuApuzYy9XXZb3_LK2t-MOWRJs9s_A_F4k7w8fB2dVRpFcfKO-yVcfMekQL0gQKmxP0e4042VUehKe9auC0ncOeboZz_irLw8B51q4epWJdTH5Uf2qFc9sPawuAZRDnoaZ87AxqiKDQHEDYVSXe7ZNryiW7EMVJc_6CAIKUJDtyiShzYiOP2-cdv2GjNEGe78FYAoQJsUua-V9M07EIWQ0hFDtaBHoM6VzmT5iV8lg"/>
</div>
<div class="flex items-baseline justify-between">
<div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block">Thời trang</span>
<h3 class="font-headline-3 text-sm font-semibold text-ink">Mặc mộc bền năm</h3>
</div>
<span class="font-label-code text-label-code text-ink-muted text-xs">640 món</span>
</div>
</div>
</div>
</div>
</section>
<!-- Section 2: Utility Strip (Warm Porcelain Ground, Structural Dividers) -->
<section class="w-full px-gutter lg:px-margin my-2">
<div class="w-full bg-warm-porcelain border border-border rounded-2xl py-3.5 px-6 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-border">
<div class="flex items-center gap-3 pt-2 md:pt-0">
<span class="material-symbols-outlined text-lacquer-red text-[22px] shrink-0">local_shipping</span>
<div class="flex flex-col">
<span class="font-body-sm text-body-sm font-semibold text-ink leading-tight">Freeship từ 299.000 ₫</span>
<span class="font-label-micro text-label-micro text-ink-muted mt-0.5">Trợ phí vận chuyển toàn quốc</span>
</div>
</div>
<div class="flex items-center gap-3 pt-2 md:pt-0 md:pl-6">
<span class="material-symbols-outlined text-lacquer-red text-[22px] shrink-0">credit_card</span>
<div class="flex flex-col">
<span class="font-body-sm text-body-sm font-semibold text-ink leading-tight">Trả góp 0% linh hoạt</span>
<span class="font-label-micro text-label-micro text-ink-muted mt-0.5">Thủ tục duyệt nhanh 3 phút</span>
</div>
</div>
<div class="flex items-center gap-3 pt-2 md:pt-0 md:pl-6">
<span class="material-symbols-outlined text-lacquer-red text-[22px] shrink-0">storefront</span>
<div class="flex flex-col">
<span class="font-body-sm text-body-sm font-semibold text-ink leading-tight">100% Shop Việt chính hiệu</span>
<span class="font-label-micro text-label-micro text-ink-muted mt-0.5">Nguồn gốc kiểm duyệt rõ ràng</span>
</div>
</div>
<div class="flex items-center gap-3 pt-2 md:pt-0 md:pl-6">
<span class="material-symbols-outlined text-lacquer-red text-[22px] shrink-0">bolt</span>
<div class="flex flex-col">
<span class="font-body-sm text-body-sm font-semibold text-ink leading-tight">Giao nhanh 2h nội thành</span>
<span class="font-label-micro text-label-micro text-ink-muted mt-0.5">Áp dụng Hà Nội &amp; TP.HCM</span>
</div>
</div>
</div>
</section>
<!-- Section 3: Danh Mục Chủ Lực (6 Six Curated Category Tiles) -->
<section class="w-full px-gutter lg:px-margin mt-12">
<div class="flex items-end justify-between pb-4 border-b border-border mb-6">
<div>
<span class="font-label-micro text-label-micro uppercase text-lacquer-red tracking-wider block mb-1">Hệ thống sản phẩm</span>
<h2 class="font-headline-1 text-headline-1 text-ink">Danh mục chủ lực</h2>
</div>
<a class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red flex items-center gap-1 transition-colors pb-1" href="#">
<span>Tất cả danh mục</span>
<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-sm">
<!-- Cat 1 -->
<a class="group flex flex-col bg-warm-porcelain border border-border rounded-2xl p-3.5 transition-all hover:border-lacquer-red" href="#">
<div class="aspect-square w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Điện tử &amp; công nghệ" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Editorial tech product photography showing premium closed-back studio headphones resting next to minimalist keyboard on clean wood surface, soft ambient illumination." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxIYIzxlqhQjutJzEpzyPxojc9gui4myAHDSgL2BYnk86jnqQ15yQ7GUCgd8hlIlFCp4MTxSDbgs1yxwRpQkwQyz4UbsyuxPIECn_Hlmf_nxCp32FD1HHKuIz_JXp_7Sz_7NkM4EPDmbg6uTlcmCfo19HXa-_-59wdmTSE2HrxMbic8cb2enlafn0SYPVsWd33SVZpEqTfWUKL5C7LNCge4oZEwEBwYF6zMO2tgQ"/>
<span class="absolute bottom-2 left-2 w-7 h-7 rounded-lg bg-warm-porcelain/90 backdrop-blur flex items-center justify-center text-ink">
<span class="material-symbols-outlined text-[16px]">devices</span>
</span>
</div>
<h3 class="font-headline-3 text-body-md font-semibold text-ink group-hover:text-lacquer-red transition-colors line-clamp-1">Điện tử &amp; Công nghệ</h3>
<p class="font-body-sm text-xs text-ink-muted line-clamp-1 mt-0.5">Laptop, tai nghe, màn hình</p>
<span class="font-label-code text-xs text-ink-faint mt-2">1.840 món</span>
</a>
<!-- Cat 2 -->
<a class="group flex flex-col bg-warm-porcelain border border-border rounded-2xl p-3.5 transition-all hover:border-lacquer-red" href="#">
<div class="aspect-square w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Gia dụng &amp; nhà bếp" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Aesthetic matte ceramic kettle and induction cooker in a warm architectural Vietnamese kitchen, warm beige and white stone countertop, daylight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaj7aMPLPLgL7geaLxdna4JTovQWTnk_OoNKd4avb2fON4GSdKgvNAxu61-wKFT1nyWKwuEQvhNqzqfFDmzRAk0TM78oUgCCAnBQwaOI-AeANsCdIPlSayq-uq5Yn_1h33TxuviFKhBGOr1rYbe2oj8uo297j7Nui5vlhP0D22gMDlbP9tzBQeQq6EWu1xuX3iovu_qhgJx2tqYczLpzJLX5yv3U8RK6bsq6CYZQ"/>
<span class="absolute bottom-2 left-2 w-7 h-7 rounded-lg bg-warm-porcelain/90 backdrop-blur flex items-center justify-center text-ink">
<span class="material-symbols-outlined text-[16px]">skillet</span>
</span>
</div>
<h3 class="font-headline-3 text-body-md font-semibold text-ink group-hover:text-lacquer-red transition-colors line-clamp-1">Gia dụng &amp; Nhà bếp</h3>
<p class="font-body-sm text-xs text-ink-muted line-clamp-1 mt-0.5">Nồi chiên, máy lọc, nướng</p>
<span class="font-label-code text-xs text-ink-faint mt-2">2.410 món</span>
</a>
<!-- Cat 3 -->
<a class="group flex flex-col bg-warm-porcelain border border-border rounded-2xl p-3.5 transition-all hover:border-lacquer-red" href="#">
<div class="aspect-square w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Nhà cửa &amp; trang trí" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Woven rattan lounge chair beside a sculpted oak timber side table and handmade ceramic lamp with linen shade, peaceful Vietnamese living space." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx5hkXd-8YljcoEyEUjfKssNnjtmZ0aqHo2Xuoc3itaeHJYw4jMP3u8OkbyYUBGOns6UA98bw0teTclrr1DF2NpbsxaftNo3og18kRM6jkn9n3JLjtaKoQaOLrkDQAtc86q6-FEe1q9Q_FyDKoP_VjTqrHCrc9GHMJnIzc6zKvg1E_zj6snj2dxrsSRgA--Seat1IEr1BDUJJ-gOeIbj-8oL0EXVmpGSrgZ06HwA"/>
<span class="absolute bottom-2 left-2 w-7 h-7 rounded-lg bg-warm-porcelain/90 backdrop-blur flex items-center justify-center text-ink">
<span class="material-symbols-outlined text-[16px]">chair</span>
</span>
</div>
<h3 class="font-headline-3 text-body-md font-semibold text-ink group-hover:text-lacquer-red transition-colors line-clamp-1">Nhà cửa &amp; Trang trí</h3>
<p class="font-body-sm text-xs text-ink-muted line-clamp-1 mt-0.5">Bàn ghế gỗ sồi, gốm mộc</p>
<span class="font-label-code text-xs text-ink-faint mt-2">3.120 món</span>
</a>
<!-- Cat 4 -->
<a class="group flex flex-col bg-warm-porcelain border border-border rounded-2xl p-3.5 transition-all hover:border-lacquer-red" href="#">
<div class="aspect-square w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Mẹ &amp; bé" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Organic cotton baby clothing set, wooden natural rattle, and soft organic muslin diaper folded neatly on linen cloth, gentle nursery mood." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRrjI062pyjWZcLlo6cof6HIJZ11AbCj9IBnOcDN6ZVwS8iQ76cSKIzCZp-iC1Jucqd1yD3YtVC7grIL1hlp2EU83b1HQN5d96qzyYsEyDgkv9z4cYHUd-vz13gVdBeJscl0H0N9mpTWJ_Oy40MnWAa0Pb06UNrSDsY6NB5UEiLbVvHaSxD4Fu3Ad5pTtZh9Nj54sUR8JUDiaGHQIsXABYHHD8oTTGj1z1NAtYTA"/>
<span class="absolute bottom-2 left-2 w-7 h-7 rounded-lg bg-warm-porcelain/90 backdrop-blur flex items-center justify-center text-ink">
<span class="material-symbols-outlined text-[16px]">child_friendly</span>
</span>
</div>
<h3 class="font-headline-3 text-body-md font-semibold text-ink group-hover:text-lacquer-red transition-colors line-clamp-1">Mẹ &amp; Bé</h3>
<p class="font-body-sm text-xs text-ink-muted line-clamp-1 mt-0.5">Xe đẩy, tã sữa hữu cơ</p>
<span class="font-label-code text-xs text-ink-faint mt-2">980 món</span>
</a>
<!-- Cat 5 -->
<a class="group flex flex-col bg-warm-porcelain border border-border rounded-2xl p-3.5 transition-all hover:border-lacquer-red" href="#">
<div class="aspect-square w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Thời trang &amp; phụ kiện" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Artisanal canvas tote bag and folded washed linen garments on an authentic wooden work table, natural earthy dye palette, minimalist fashion." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgX6EeuJhTOGIVBp_cP5G8XUPWuLcMJwijKssiOUsphPGJEqAigrMY_PaF5b5SyDH7fZsv-fY0Y59eqgnfyaB2bt6IHretBCGy9sMr_hD7ylq_f-fsnzz9eqPnBSu3sWBEhGrbBLB8hL268tD4k63DBcsXw46qJDxp5O3yNd0c43DBSob2whTrHGayhrxd6sFguryY5E2zxfIKytkVZdrdD-dKVz7sXFaRy2XW4A"/>
<span class="absolute bottom-2 left-2 w-7 h-7 rounded-lg bg-warm-porcelain/90 backdrop-blur flex items-center justify-center text-ink">
<span class="material-symbols-outlined text-[16px]">apparel</span>
</span>
</div>
<h3 class="font-headline-3 text-body-md font-semibold text-ink group-hover:text-lacquer-red transition-colors line-clamp-1">Thời trang &amp; Vải mộc</h3>
<p class="font-body-sm text-xs text-ink-muted line-clamp-1 mt-0.5">Đũi tự nhiên, cotton chải</p>
<span class="font-label-code text-xs text-ink-faint mt-2">1.540 món</span>
</a>
<!-- Cat 6 -->
<a class="group flex flex-col bg-warm-porcelain border border-border rounded-2xl p-3.5 transition-all hover:border-lacquer-red" href="#">
<div class="aspect-square w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Làm đẹp &amp; chăm sóc" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Amber glass bottles containing herbal botanical facial serum next to fresh centella leaves on damp ceramic tray, Vietnamese clean skincare aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTyYt5rIf-BRXHrqOZvqsio7INDKO0qkBUv484kjCLwbuftfDrORIBl5hO7b7PLdGZUh14Obq3VfhAalgj8qpNGPhV76ZRD8yHLAU-SuR1mYhU57xc73JmBv7az2Vo9ITS3EhNHihGyT7ZylChmQAKrSG4a4R0K6hAAZ94k8jB_1i9ANtywnvqHulc4OpdVmNGNQgU0L22LL0pvjpJGr0BZgfWcNib5hOPPUAKNg"/>
<span class="absolute bottom-2 left-2 w-7 h-7 rounded-lg bg-warm-porcelain/90 backdrop-blur flex items-center justify-center text-ink">
<span class="material-symbols-outlined text-[16px]">spa</span>
</span>
</div>
<h3 class="font-headline-3 text-body-md font-semibold text-ink group-hover:text-lacquer-red transition-colors line-clamp-1">Làm đẹp &amp; Dưỡng sinh</h3>
<p class="font-body-sm text-xs text-ink-muted line-clamp-1 mt-0.5">Thảo mộc, dược mỹ phẩm</p>
<span class="font-label-code text-xs text-ink-faint mt-2">1.190 món</span>
</a>
</div>
</section>
<!-- Section 4: Flash Sale (Giờ Vàng Tuyển Chọn - Asymmetric 2-column Rail) -->
<section class="w-full px-gutter lg:px-margin mt-14">
<div class="bg-rice-paper border border-border rounded-[24px] p-6 lg:p-8">
<!-- Flash Sale Header Row -->
<div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border gap-4">
<div class="flex items-center gap-3">
<span class="px-2.5 py-1 rounded-md bg-lacquer-red text-warm-porcelain font-label-micro text-label-micro tracking-wider uppercase font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">local_fire_department</span>
            Giờ Vàng Tuyển Chọn
          </span>
<span class="text-ink-muted font-body-sm text-body-sm hidden sm:inline">Số lượng giới hạn trong ngày</span>
</div>
<!-- Live Countdown Timer -->
<div class="flex items-center gap-2">
<span class="font-label-micro text-label-micro text-ink-muted uppercase mr-1">Kết thúc sau</span>
<div class="flex items-center gap-1.5 font-label-code text-label-code">
<span class="px-2 py-1 bg-warm-porcelain border border-border rounded text-ink font-semibold" id="timer-hours">02</span>
<span class="text-lacquer-red font-bold">:</span>
<span class="px-2 py-1 bg-warm-porcelain border border-border rounded text-ink font-semibold" id="timer-minutes">45</span>
<span class="text-lacquer-red font-bold">:</span>
<span class="px-2 py-1 bg-warm-porcelain border border-border rounded text-ink font-semibold" id="timer-seconds">18</span>
</div>
</div>
</div>
<!-- Flash Sale Items Rail -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mt-6">
<!-- Deal Item 1 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3">
<img alt="Laptop ASUS Vivobook 14 OLED" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Editorial product photo of ASUS Vivobook 14 OLED laptop open showing vivid color display, situated on minimalist raw linen fabric and craft timber desk." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt0gBJgORghQjd899v8wBNgwK1KIoVUvGqrFg4tk7X3xrHDUV0LDRy_iHR09yqdf0HeN4bqzkvYy-ZocsrFtDZPPM085xp5FopllQ9s7e-dv3ovDTFyPldQmPhXu0xjQltbQ2oMdAPNX0Xu1PQFHOwuq_lC9Pp1julQ1KtcJH_H_YpJk8NWKZ2OS2yxwfKr_tS-LmyCkKOiPMnAGxKKdpGuBs6UosC43zXL4HpNw"/>
<span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-lacquer-red text-warm-porcelain font-label-code text-xs font-semibold">
                -14%
              </span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">TechNest Flagship</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
              Laptop ASUS Vivobook 14 OLED (M1405VA)
            </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div>
<div class="font-label-code text-body-lg font-semibold text-lacquer-red">14.990.000 ₫</div>
<div class="font-label-code text-xs text-ink-faint line-through">17.500.000 ₫</div>
</div>
<span class="font-label-micro text-[11px] text-ink-muted">Đã bán 38</span>
</div>
</div>
<!-- Deal Item 2 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3">
<img alt="Tai nghe Sony WH-CH720N" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Sony WH-CH720N wireless noise canceling headphones in beige cream finish resting over a smooth wooden mannequin head, soft studio shadows." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVMNZ-llM45POmWlgws-mFw8iS67xBMoYnA-wcGpwmIHBo1ol0eUnVA5LSefGaT6ZeQS62-s2C8qaMuJc-BcRhavuhuNaj2aDDpZApk-bg5yrLtXnPeIYXFlOz6Hf2Svq8czRTY5WtW8P0hs0hovMnlMI4zGIa5q2UNITPS2da3fCdZ7RvfTthWFOVciPLH0gZ9i4WOay61xrX_RvoWl5aLuYCnKXKjEM7fkdCEg"/>
<span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-lacquer-red text-warm-porcelain font-label-code text-xs font-semibold">
                -17%
              </span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">Âm Thanh Việt</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
              Tai nghe chống ồn Sony WH-CH720N không dây
            </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div>
<div class="font-label-code text-body-lg font-semibold text-lacquer-red">2.490.000 ₫</div>
<div class="font-label-code text-xs text-ink-faint line-through">2.990.000 ₫</div>
</div>
<span class="font-label-micro text-[11px] text-ink-muted">Đã bán 72</span>
</div>
</div>
<!-- Deal Item 3 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3">
<img alt="Nồi chiên Lock&amp;Air" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Modern steam air fryer in soft ivory cream color on wooden table with steamed sweet potatoes and roasted chicken inside glass window, editorial lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCF55mopzg_p6B3ilDx5XhhR6edSXeeE8193Rv-Zc65vvQR7kx3AtSFsQCFQBe3UgPWIq1sfL37U2PMq_3FaXrDAlDQaUfNzSJsWO1ZafsHph4Aa4UZmbgBsg9EnhnCynvq7ZYocAub-4ItNf6cp_4to9R4sSkL9HOfC8L1CNqgNjh6n9HFstF_H73y3x64yvU4PZcmoDTmYh9ZOODNGGDkAjy_2ZtTk0md-YQ9A"/>
<span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-lacquer-red text-warm-porcelain font-label-code text-xs font-semibold">
                -28%
              </span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">Bếp Nhà Mình</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
              Nồi chiên không dầu hơi nước Lock&amp;Air 5L
            </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div>
<div class="font-label-code text-body-lg font-semibold text-lacquer-red">1.890.000 ₫</div>
<div class="font-label-code text-xs text-ink-faint line-through">2.650.000 ₫</div>
</div>
<span class="font-label-micro text-[11px] text-ink-muted">Đã bán 114</span>
</div>
</div>
<!-- Deal Item 4 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3">
<img alt="Xe đẩy gấp gọn du lịch" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Compact foldable travel baby stroller standing upright folded compactly beside an earth-toned hallway cabinet, minimalist interior scene." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJqvFTGbtKdY4EQ-wlws4p78feUWXUjTE6GiaewHQkWEriWgQtQ4sTrVqkTqqoJP-GxwzMxKiAlVwfBRDZq28BRxkaGWHNLbTkX8HWnEH8uAakQXa0P7_IFW7tgaFZGZFloOaBfUlueYsModSHUUI-LWnti3iduig5rCdbj21dUQ2-3dkGLeWMLEb_MaA5NROFLY_2g_n6u_v8kbbXDaiZLNAtg1leAur2SB1Vww"/>
<span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-lacquer-red text-warm-porcelain font-label-code text-xs font-semibold">
                -23%
              </span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">Mẹ &amp; Bé An Nhiên</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
              Xe đẩy gấp gọn du lịch Urban Lite siêu nhẹ 4.8kg
            </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div>
<div class="font-label-code text-body-lg font-semibold text-lacquer-red">2.150.000 ₫</div>
<div class="font-label-code text-xs text-ink-faint line-through">2.800.000 ₫</div>
</div>
<span class="font-label-micro text-[11px] text-ink-muted">Đã bán 45</span>
</div>
</div>
</div>
</div>
</section>
<!-- Section 5: Best Sellers (Sản Phẩm Bán Chạy - 4-up Shelf) -->
<section class="w-full px-gutter lg:px-margin mt-16">
<div class="flex items-end justify-between pb-4 border-b border-border mb-6">
<div>
<span class="font-label-micro text-label-micro uppercase text-turmeric tracking-wider block mb-1">Được tin chọn nhiều nhất</span>
<h2 class="font-headline-1 text-headline-1 text-ink">Sản phẩm bán chạy</h2>
</div>
<a class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red flex items-center gap-1 transition-colors pb-1" href="#">
<span>Xem bảng xếp hạng</span>
<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
<!-- Best Seller 1 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="ZenBook 14 OLED" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Editorial presentation of Asus ZenBook 14 OLED on a solid walnut desk, fine typography display, crisp reflection, subtle ceramic decor in the background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRvJd3JVBsj8OBcUPNSTj1T79A1hPODJbcSHfDHm_Kcku6PjXyXHqSqMBx7yy2ZRKL-W2QTqSgvphw4yQvye1nj46Inu9xzOAfHn3Dx6o3rS7YfNEnxPhKLXgHQyRXEClqmUS3SkJ1Dme28rBav_hFqrZdnVr0sLVoYmeBVv1i-Zcd-tezfeAWMVDJRS_g-tgQLMt9ENydEfRSzHBigbmBy6d45qbGkiy97ogk7A"/>
<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-warm-porcelain/90 backdrop-blur font-label-micro text-[11px] text-ink flex items-center gap-1">
<span class="material-symbols-outlined text-turmeric text-[13px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>4.9 (84)</span>
</span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">TechNest Official</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
            Laptop mỏng nhẹ ZenBook 14 OLED (Intel Core Ultra 7)
          </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div class="font-label-code text-body-lg font-semibold text-ink">
            24.890.000 ₫
          </div>
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink flex items-center justify-center transition-colors" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
<!-- Best Seller 2 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Nồi chiên không dầu LockAir 7L" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="High-capacity 7L LockAir air fryer in deep matte slate grey sitting on handcrafted raw timber bench, architectural kitchen, warm indirect lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvhxIm5rV80VVMVj79FsKrs_KuVGylQzSw2eWj17ulzS059pydtkavK4tT6zTQR5TB7lpnWwLSxPJLbiusO7u6MYjDcQEKvrNt5gidSSaw8VO-WPA8sUjtcY0SrX5Zh0ml9dObdewRNypFZzV1060yOwrGEj0Fjp6NkAv7Fmk6Mq6r9XvW0-1xvP6ybhOyK3xkx1locZph3IWLLs56gK1wlRJ3qgkmNwYYHgx9Tg"/>
<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-warm-porcelain/90 backdrop-blur font-label-micro text-[11px] text-ink flex items-center gap-1">
<span class="material-symbols-outlined text-turmeric text-[13px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>4.8 (212)</span>
</span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">Bếp Nhà Mình</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
            Nồi chiên không dầu đối lưu nhiệt LockAir dung tích 7L
          </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div class="font-label-code text-body-lg font-semibold text-ink">
            3.490.000 ₫
          </div>
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink flex items-center justify-center transition-colors" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
<!-- Best Seller 3 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Xe đẩy Urban Lite" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Premium urban baby stroller in deep olive green fabric with leather handlebar, serene living room interior with soft natural textures." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3H6L3ZYD2whbJf5pCeas5tl0qNsAOuEgfSlFAex8B9VZKc742dglCmC5BBrOwFULy5DSPgu8ZhcJQ3i7_LKatwLb2OvLYALBdhYPZ8Gv6C2YWHKyZZUMZoBUbWlOApL4eSH8pI0LYl0oskRyKqqtCnhOljqYhIbjqQvfD4ia5hAilCoW8eZgLhGvjVDsGAxLp9Anxf5dGtNzMSkZ7H-G5ofDCwrt4XzZT40hYEA"/>
<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-warm-porcelain/90 backdrop-blur font-label-micro text-[11px] text-ink flex items-center gap-1">
<span class="material-symbols-outlined text-turmeric text-[13px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>5.0 (59)</span>
</span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">Mẹ &amp; Bé An Nhiên</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
            Xe đẩy gấp gọn đa năng Urban Lite giảm xóc siêu êm
          </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div class="font-label-code text-body-lg font-semibold text-ink">
            2.850.000 ₫
          </div>
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink flex items-center justify-center transition-colors" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
<!-- Best Seller 4 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Serum Centella B5" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Frosted dropper bottle of botanical Centella B5 skin repair serum standing on river stone slab, water droplet reflections, Vietnamese herbal cosmetics." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2bCIlICSyvdouCisBWc0nrvnXe0XEUHXfENhE6YIpWBKBaU5B_ld97wrVDd6T2hy0_dkE8jJ1csFQXGCu2yxcJ2GXdfHp8V3Gj_YUABImYnsqimVNAEzYwkfXqoA48aduRwkU9_-vnc7mm-cHsTbTZjDlRRdDoYjKWLxx-__iwG7UMnjjP73x7rs5lIHWwv-S-4WqJZkiQFa0Gr8e7ucn_2pUrdgG7NpvyREYNw"/>
<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-warm-porcelain/90 backdrop-blur font-label-micro text-[11px] text-ink flex items-center gap-1">
<span class="material-symbols-outlined text-turmeric text-[13px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span>4.9 (348)</span>
</span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">Lá Beauty Việt</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
            Serum phục hồi rau má Centella B5 50ml hữu cơ
          </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div class="font-label-code text-body-lg font-semibold text-ink">
            420.000 ₫
          </div>
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink flex items-center justify-center transition-colors" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
</div>
</section>
<!-- Section 6: Editorial Narrative Accent (Split Curated Story) -->
<section class="w-full px-gutter lg:px-margin mt-16">
<div class="bg-raw-linen border border-border rounded-[24px] p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
<div class="lg:col-span-6 flex flex-col justify-center">
<span class="font-label-micro text-label-micro uppercase text-lacquer-red tracking-wider mb-2">Tiêu chí tuyển hàng Nếp</span>
<h2 class="font-headline-1 text-headline-1 text-ink mb-4 leading-tight">
          Chỉ giữ lại những gì đáng giá cho đời sống mỗi ngày.
        </h2>
<p class="font-body-md text-body-md text-ink-muted leading-relaxed mb-6">
          Ở ShopNest, mỗi nhà bán hàng phải trải qua quy trình xác minh 3 lớp: hồ sơ giấy phép xưởng sản xuất, kiểm nghiệm độ an toàn vật liệu, và cam kết hậu mãi minh bạch. Chúng tôi từ chối sản phẩm kém bền để bảo vệ sự an tâm trong căn nhà bạn.
        </p>
<div class="flex items-center gap-6 font-label-code text-label-code text-ink">
<div>
<span class="block text-2xl font-bold text-ink">100%</span>
<span class="font-label-micro text-ink-muted uppercase">Hồ sơ pháp lý</span>
</div>
<div class="h-8 w-px bg-border"></div>
<div>
<span class="block text-2xl font-bold text-ink">7 ngày</span>
<span class="font-label-micro text-ink-muted uppercase">Đổi trả tận cửa</span>
</div>
<div class="h-8 w-px bg-border"></div>
<div>
<span class="block text-2xl font-bold text-ink">24/7</span>
<span class="font-label-micro text-ink-muted uppercase">Kỹ thuật viên trợ giá</span>
</div>
</div>
</div>
<div class="lg:col-span-6">
<div class="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-border bg-warm-porcelain">
<img alt="Xưởng thủ công tuyển chọn ShopNest" class="w-full h-full object-cover" data-alt="Vietnamese craftsman carefully inspecting the joinery of an oak dining chair in a naturally lit, clean woodworking atelier, warm timber shavings, serene focus." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSIzcGrR7b0yadJG10h5pI_fUX6yWoSKM3Q5I2FIjL1t7YSZC2S85J3Wfatoabk6PyG4CIdP1z5KWdOWmEkUHK2qb2YvQHCZW78yrW9CiCbEw0yEXLO2Y6kNkDag3wsPDlaLAQaAbIT9KAC4971ZVgjwqaYJKHUS7LbN-F3xdvYqAGpMOip_iQY3D5EJTPgIR8hBx93K_XwbLBgleE9bJ--RzUMa3R_xY91gJaWA"/>
</div>
</div>
</div>
</section>
<!-- Section 7: Suggested Products (Gợi Ý Cho Tổ Ấm - 4-up Shelf) -->
<section class="w-full px-gutter lg:px-margin mt-16">
<div class="flex items-end justify-between pb-4 border-b border-border mb-6">
<div>
<span class="font-label-micro text-label-micro uppercase text-jade tracking-wider block mb-1">Tinh tuyển theo sở thích</span>
<h2 class="font-headline-1 text-headline-1 text-ink">Gợi ý cho tổ ấm</h2>
</div>
<a class="font-body-sm text-body-sm text-ink hover:text-lacquer-red flex items-center gap-1 transition-colors pb-1" href="#">
<span>Xem tất cả</span>
<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
<!-- Suggestion 1 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Áo thun cotton dệt mộc" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Natural undyed organic cotton crewneck t-shirt draped naturally over wooden bench, rich fabric weave texture visible, editorial sunlight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDax8-rMxkIfK7PCM2kZCfPKwofnUpyCxu03EQQVf5FT2gsSl5194zDeOMBtlhm3h8IbSp9boYOAK0i6fPmdriLpZWtj4W3eduveTihOyar6todp4n7-eoWM-nO5B0nKg6soqOIU6HiZ-4i-ssCKZ-RFMXFBjZcUW1MVC-LZcdBsfE3O6xABU_ecYaMquEvsccvGnOWAoWHm8di9pUEs_RA8blRZB5Zs49VES3Y6A"/>
<span class="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-warm-porcelain/90 backdrop-blur font-label-micro text-[11px] text-ink">
              Sợi tự nhiên
            </span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">Mộc Studio</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
            Áo thun cổ tròn cotton chải kỹ dệt mộc định lượng cao
          </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div class="font-label-code text-body-lg font-semibold text-ink">
            290.000 ₫
          </div>
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink flex items-center justify-center transition-colors" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
<!-- Suggestion 2 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Tã bỉm quần hữu cơ Nano" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Clean minimal package design of organic breathable baby diapers with bamboo fiber texture background in warm nursery lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL6zMwsywX1Sj3ltM5j0NOpMXHU_wUL6w4R7PUUep673qJ8mBDVnNC63-NpWfVdvQtelIWqCu0sabQsXpMRrDPQFVg6GuFrTCewsrPc-LHDAnlw3zSmi2nKq3bv7E_ztRjdUqtKewrzzzHoaVyKZWofc4pJtLY3XyRg6lcOOGTDh4Qp1XaLUD3M3iii9R1RZH-z8F_BvcZ71mNRyq04FjZPxGLwo2-xHYR8znBbA"/>
<span class="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-warm-porcelain/90 backdrop-blur font-label-micro text-[11px] text-ink">
              Chứng nhận Eco
            </span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">An Nhiên Care</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
            Tã bỉm quần hữu cơ màng thở Nano (Bịch 56 miếng)
          </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div class="font-label-code text-body-lg font-semibold text-ink">
            385.000 ₫
          </div>
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink flex items-center justify-center transition-colors" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
<!-- Suggestion 3 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Tai nghe V-Acoustic" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="V-Acoustic over-ear wireless headphones in warm matte charcoal with soft memory foam ear cushions on carved wood block." src="https://lh3.googleusercontent.com/aida-public/AB6AXuApSDq1lYvgX0PaMiTqMWYhCHgjlDj3_P-Mmo2WfK3tpX0DwhAKZlpzTO8fT3JErfZQZeLDuFdXDznOgo-94pJQiVDwrz-ePMdaw34BIM8Ftyrb7fCT_wU-YjTWUoaDoaGHfB70ZMzloyb82SG9haXnQ_Odf_slJT31n5KLlhnTktfc7gjKQ-n0nrEEWYyYA066mADcfPPPzhTStpVv3oIaqufD-CWaFZy3cZ5QZw"/>
<span class="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-warm-porcelain/90 backdrop-blur font-label-micro text-[11px] text-ink">
              Pin 40 giờ
            </span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">SoundCraft VN</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
            Tai nghe chụp không dây over-ear V-Acoustic chống ồn
          </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div class="font-label-code text-body-lg font-semibold text-ink">
            1.190.000 ₫
          </div>
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink flex items-center justify-center transition-colors" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
<!-- Suggestion 4 -->
<div class="group bg-warm-porcelain border border-border rounded-[20px] p-3.5 flex flex-col justify-between transition-all hover:border-lacquer-red">
<div>
<div class="aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-container mb-3 relative">
<img alt="Đèn bàn gốm men mờ" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" data-alt="Handcrafted matte cream ceramic desk lamp glowing with cozy warm 2700K amber light on a solid oak bookshelf, Vietnamese craft lifestyle." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEDE6IovnYNkeuvagOuIPISPZp_cjdIfQ0W2GVzDUh_50INymLBojf4tjFpxYcpz7z8QUcKXCrL3o5U1qMWlfFR1t8k8U_MLmaNti3pCqnEdJOMsz-96v1DxGyA0CFeSFw-_enreeZ0mXI7MCrT4hDNIKgLoelVeaWoi2sXO_TgjEwTDYbAgJ7UIYnK6jtM1HUXA4W7Cm7kCXOWbJvAjUc92kiA4quPaVW_4Mjsw"/>
<span class="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-warm-porcelain/90 backdrop-blur font-label-micro text-[11px] text-ink">
              Gốm thủ công
            </span>
</div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase block tracking-wider">Gốm Nếp</span>
<h3 class="font-headline-3 text-body-md font-semibold text-ink mt-1 line-clamp-2 group-hover:text-lacquer-red transition-colors">
            Đèn bàn làm việc gốm men mờ bóng râm ánh vàng ấm
          </h3>
</div>
<div class="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
<div class="font-label-code text-body-lg font-semibold text-ink">
            750.000 ₫
          </div>
<button class="w-8 h-8 rounded-lg bg-surface-container hover:bg-lacquer-red hover:text-warm-porcelain text-ink flex items-center justify-center transition-colors" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
</button>
</div>
</div>
</div>
</section>
<!-- Section 8: Trust Strip (4 Core Guarantees with Clean 1px Borders) -->
<section class="w-full px-gutter lg:px-margin mt-16 mb-4">
<div class="w-full border-t border-b border-border py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<div class="flex items-start gap-3.5">
<div class="w-10 h-10 rounded-xl bg-warm-porcelain border border-border flex items-center justify-center shrink-0 text-lacquer-red">
<span class="material-symbols-outlined text-[22px]">verified_user</span>
</div>
<div>
<h4 class="font-headline-3 text-body-md font-semibold text-ink">Shop đã kiểm duyệt</h4>
<p class="font-body-sm text-xs text-ink-muted mt-1 leading-relaxed">
            100% hồ sơ giấy phép xưởng và nguồn gốc minh bạch trước khi mở bán.
          </p>
</div>
</div>
<div class="flex items-start gap-3.5">
<div class="w-10 h-10 rounded-xl bg-warm-porcelain border border-border flex items-center justify-center shrink-0 text-lacquer-red">
<span class="material-symbols-outlined text-[22px]">assignment_return</span>
</div>
<div>
<h4 class="font-headline-3 text-body-md font-semibold text-ink">Đổi trả 7 ngày</h4>
<p class="font-body-sm text-xs text-ink-muted mt-1 leading-relaxed">
            Nhận bồi hoàn hoặc đổi sản phẩm mới ngay tại cửa nếu sai lệch cam kết.
          </p>
</div>
</div>
<div class="flex items-start gap-3.5">
<div class="w-10 h-10 rounded-xl bg-warm-porcelain border border-border flex items-center justify-center shrink-0 text-lacquer-red">
<span class="material-symbols-outlined text-[22px]">package_2</span>
</div>
<div>
<h4 class="font-headline-3 text-body-md font-semibold text-ink">Giao toàn quốc</h4>
<p class="font-body-sm text-xs text-ink-muted mt-1 leading-relaxed">
            Quy cách đóng gói chống sốc chèn lót giấy tái sinh bảo vệ môi trường.
          </p>
</div>
</div>
<div class="flex items-start gap-3.5">
<div class="w-10 h-10 rounded-xl bg-warm-porcelain border border-border flex items-center justify-center shrink-0 text-lacquer-red">
<span class="material-symbols-outlined text-[22px]">lock</span>
</div>
<div>
<h4 class="font-headline-3 text-body-md font-semibold text-ink">Thanh toán bảo mật</h4>
<p class="font-body-sm text-xs text-ink-muted mt-1 leading-relaxed">
            Mã hóa giao dịch ngân hàng đa tầng, hỗ trợ thanh toán khi nhận hàng.
          </p>
</div>
</div>
</div>
</section>
<!-- Section 9: Client-Side Simulation Script -->
<script>
    let isCustomerLoggedIn = false;

    function toggleAuthState() {
      isCustomerLoggedIn = !isCustomerLoggedIn;
      const btn = document.getElementById('sim-auth-btn');
      if (isCustomerLoggedIn) {
        btn.innerHTML = 'Khách: Nguyễn Thu Hà <span class="text-jade font-semibold text-xs ml-1">(Đã đăng nhập)</span>';
      } else {
        btn.innerHTML = 'Khách vãng lai <span class="text-ink-faint text-xs ml-1">(Bấm đổi)</span>';
      }
    }

    // Live countdown micro-interaction
    (function initFlashSaleTimer() {
      let totalSeconds = 2 * 3600 + 45 * 60 + 18;
      const hoursEl = document.getElementById('timer-hours');
      const minutesEl = document.getElementById('timer-minutes');
      const secondsEl = document.getElementById('timer-seconds');

      if (!hoursEl || !minutesEl || !secondsEl) return;

      setInterval(() => {
        if (totalSeconds <= 0) {
          totalSeconds = 3 * 3600;
        }
        totalSeconds--;

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        hoursEl.textContent = String(h).padStart(2, '0');
        minutesEl.textContent = String(m).padStart(2, '0');
        secondsEl.textContent = String(s).padStart(2, '0');
      }, 1000);
    })();
  </script>
</div></main><footer class="w-full bg-rice-paper border-t border-border mt-margin"><div class="w-full px-gutter lg:px-margin py-margin"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl"><div class="flex flex-col gap-space-sm"><div class="flex items-center gap-2 mb-space-xs"><span class="font-headline-3 text-headline-3 text-ink">ShopNest</span><span class="px-2 py-0.5 rounded-full bg-raw-linen font-label-micro text-label-micro text-ink uppercase">Nếp Sống</span></div><p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">Sàn thương mại điện tử tuyển chọn khắt khe từng vật phẩm cho tổ ấm và đời sống người Việt tinh tế, an tâm và tròn vẹn nếp nhà.</p><div class="mt-space-sm flex flex-col gap-1"><span class="font-label-micro text-label-micro text-ink-faint uppercase tracking-wider">Tổng đài trợ giúp 24/7</span><a class="font-label-code text-label-code text-lacquer-red font-semibold hover:underline" href="tel:19006886">1900 6886</a></div></div><div class="flex flex-col gap-space-sm"><h4 class="font-headline-3 text-headline-3 text-ink mb-space-xs">Dịch vụ &amp; Tiêu chuẩn Nếp</h4><ul class="flex flex-col gap-space-xs font-body-sm text-body-sm text-ink-muted"><li class="flex items-center gap-2"><span class="material-symbols-outlined text-jade text-[18px]">verified</span><span>Kiểm định nguồn gốc 100%</span></li><li class="flex items-center gap-2"><span class="material-symbols-outlined text-jade text-[18px]">published_with_changes</span><span>Đổi trả thuận tiện trong 7 ngày</span></li><li class="flex items-center gap-2"><span class="material-symbols-outlined text-jade text-[18px]">bolt</span><span>Giao siêu tốc nội thành 2h</span></li><li class="flex items-center gap-2"><span class="material-symbols-outlined text-jade text-[18px]">shield_with_heart</span><span>Bảo hành tận tâm trọn vòng đời</span></li></ul></div><div class="flex flex-col gap-space-sm"><h4 class="font-headline-3 text-headline-3 text-ink mb-space-xs">Dành cho đối tác</h4><ul class="flex flex-col gap-space-xs font-body-sm text-body-sm text-ink-muted"><li><a class="hover:text-lacquer-red transition-colors flex items-center justify-between" href="#"><span>Đăng ký Bán hàng cùng ShopNest</span><span class="material-symbols-outlined text-[16px]">north_east</span></a></li><li><a class="hover:text-lacquer-red transition-colors flex items-center justify-between" href="#"><span>Đăng ký Giao hàng &amp; Vận chuyển</span><span class="material-symbols-outlined text-[16px]">north_east</span></a></li><li><a class="hover:text-lacquer-red transition-colors flex items-center justify-between" href="#"><span>Quy chuẩn hàng hóa &amp; Xưởng Việt</span><span class="material-symbols-outlined text-[16px]">arrow_forward</span></a></li><li><a class="hover:text-lacquer-red transition-colors flex items-center justify-between" href="#"><span>Cổng API kết nối kho hàng</span><span class="material-symbols-outlined text-[16px]">code</span></a></li></ul></div><div class="flex flex-col gap-space-sm"><h4 class="font-headline-3 text-headline-3 text-ink mb-space-xs">Bản tin Nếp sống</h4><p class="font-body-sm text-body-sm text-ink-muted">Nhận tinh tuyển khuyến mãi, bộ sưu tập thủ công và cẩm nang sống đẹp.</p><div class="flex items-center gap-2 mt-space-xs"><input class="w-full h-11 px-space-sm bg-warm-porcelain border border-border rounded-xl font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-lacquer-red" placeholder="Nhập email của bạn..." type="email"/><button class="h-11 px-space-md bg-ink hover:bg-lacquer-red text-warm-porcelain rounded-xl font-body-sm text-body-sm font-medium transition-colors shrink-0" type="button">Đăng ký</button></div><div class="flex items-center gap-3 mt-space-xs pt-space-xs border-t border-border"><span class="material-symbols-outlined text-turmeric text-[22px]">workspace_premium</span><span class="font-label-micro text-label-micro text-ink-muted">Chứng nhận sàn TMĐT uy tín Việt Nam</span></div></div></div><div class="mt-space-xl pt-space-md border-t border-border flex flex-col md:flex-row items-center justify-between gap-space-sm text-center md:text-left"><p class="font-body-sm text-body-sm text-ink-faint">© 2025 ShopNest JSC. Hệ thống Nếp Sống Việt. Mọi quyền được bảo lưu.</p><div class="flex items-center gap-space-md font-body-sm text-body-sm text-ink-muted"><a class="hover:text-lacquer-red transition-colors" href="#">Điều khoản sử dụng</a><a class="hover:text-lacquer-red transition-colors" href="#">Chính sách bảo mật</a><a class="hover:text-lacquer-red transition-colors" href="#">Quy chế hoạt động sàn</a></div></div></div></footer></body></html>
```
### S02 - Search and Category
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{colors:{"on-surface":"#1d1c15","secondary-fixed-dim":"#cbc6bf","on-secondary-fixed-variant":"#494641","background":"#fef9ee","jade":"#2F6B57","lacquer-wash":"#F2DCD5","tertiary":"#514b3f","on-primary-fixed-variant":"#891c16","on-primary":"#ffffff","primary-fixed-dim":"#ffb4aa","surface-container-high":"#ede8dd","ink":"#1D1B17","secondary":"#615e59","surface-container-low":"#f8f3e8","on-secondary":"#ffffff","on-error-container":"#93000a","on-error":"#ffffff","on-primary-container":"#ffd9d3","surface-container":"#f2ede2","primary":"#91221a","surface-container-lowest":"#ffffff","outline":"#8c716d","surface-bright":"#fef9ee","inverse-primary":"#ffb4aa","turmeric":"#8A5A1A","secondary-fixed":"#e8e2db","on-secondary-fixed":"#1d1b17","surface-container-highest":"#e7e2d7","error-container":"#ffdad6","logo-blue":"#4991D8","ink-faint":"#9A8F7F","on-tertiary":"#ffffff","surface":"#fef9ee","primary-fixed":"#ffdad5","border":"#DCD1BE","outline-variant":"#dfbfbb","surface-tint":"#aa342a","on-primary-fixed":"#410001","lacquer-red":"#B23A2F","surface-variant":"#e7e2d7","inverse-surface":"#323029","on-tertiary-fixed-variant":"#4b463a","error":"#ba1a1a","brick":"#8B2A24","on-tertiary-container":"#e9e0cf","on-background":"#1d1c15","surface-dim":"#dedacf","inverse-on-surface":"#f5f0e5","lacquer-deep":"#8C2A22","warm-porcelain":"#FFFCF4","on-surface-variant":"#58413e","tertiary-fixed":"#eae2d1","primary-container":"#b23a2f","secondary-container":"#e8e2db","tertiary-fixed-dim":"#cec6b5","ink-muted":"#6B6458","on-tertiary-fixed":"#1f1b11","on-secondary-container":"#67645f","tertiary-container":"#696356","raw-linen":"#EDE4D3","rice-paper":"#F6F1E6"},borderRadius:{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},spacing:{"space-lg":"1.5rem","gutter-mobile":"1rem","space-xs":"0.25rem","space-md":"1rem","space-xl":"2.5rem","space-sm":"0.5rem","margin-mobile":"1.25rem","margin":"3rem","gutter":"1.5rem"},fontFamily:{"label-micro":["Be Vietnam Pro"],"headline-1":["Newsreader"],"display-xl":["Newsreader"],"body-lg":["Be Vietnam Pro"],"body-sm":["Be Vietnam Pro"],"headline-3":["Be Vietnam Pro"],"body-md":["Be Vietnam Pro"],"display-xl-mobile":["Newsreader"],"display-lg":["Newsreader"],"display-lg-mobile":["Newsreader"],"headline-2":["Newsreader"],"label-code":["JetBrains Mono"]},fontSize:{"label-micro":["12px",{"lineHeight":"16px","letterSpacing":"0.12em","fontWeight":"600"}],"headline-1":["36px",{"lineHeight":"40px","letterSpacing":"-0.025em","fontWeight":"600"}],"display-xl":["64px",{"lineHeight":"60px","letterSpacing":"-0.035em","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"body-sm":["14px",{"lineHeight":"21px","fontWeight":"400"}],"headline-3":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}],"body-md":["16px",{"lineHeight":"26px","fontWeight":"400"}],"display-xl-mobile":["40px",{"lineHeight":"40px","letterSpacing":"-0.03em","fontWeight":"600"}],"display-lg":["48px",{"lineHeight":"48px","letterSpacing":"-0.03em","fontWeight":"600"}],"display-lg-mobile":["32px",{"lineHeight":"34px","letterSpacing":"-0.025em","fontWeight":"600"}],"headline-2":["28px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"600"}],"label-code":["14px",{"lineHeight":"20px","fontWeight":"500"}]}}}};</script></head><body class="bg-surface font-body-md text-body-md text-ink antialiased selection:bg-lacquer-wash selection:text-ink"><header class="fixed top-0 w-full z-50 bg-rice-paper/95 backdrop-blur-md border-b border-border"><div class="h-20 w-full px-gutter flex items-center justify-between gap-space-md"><div class="flex items-center gap-space-sm shrink-0"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><div class="flex flex-col"><span class="font-headline-2 text-headline-2 text-ink tracking-tight leading-none">ShopNest</span><span class="font-label-micro text-label-micro text-lacquer-red uppercase tracking-wider mt-0.5">SÀN TMĐT TUYỂN CHỌN</span></div></div><div class="flex-1 max-w-xl mx-space-md hidden md:block"><div class="relative flex items-center w-full"><span class="material-symbols-outlined absolute left-3 text-ink-muted text-[20px] pointer-events-none">search</span><input class="w-full h-11 pl-10 pr-4 bg-warm-porcelain border border-border rounded-xl font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-lacquer-red transition-all" placeholder="Tìm laptop, nồi chiên, xe đẩy..." type="text"/></div></div><div class="flex items-center gap-space-lg shrink-0"><nav class="hidden lg:flex items-center gap-space-md font-body-sm text-body-sm" data-active-classes="text-lacquer-red font-medium border-b border-lacquer-red pb-1"><a class="text-on-surface-variant hover:text-on-surface transition-colors py-1" data-path="danh-muc" href="#">Danh mục</a><a class="text-on-surface-variant hover:text-on-surface transition-colors py-1" data-path="khuyen-mai" href="#">Khuyến mãi</a><a class="text-on-surface-variant hover:text-on-surface transition-colors py-1" data-path="shop-viet" href="#">Shop Việt</a><a class="text-on-surface-variant hover:text-on-surface transition-colors py-1" data-path="don-hang" href="#">Đơn hàng</a></nav><div class="h-5 w-px bg-border hidden sm:block"></div><div class="flex items-center gap-space-sm font-label-code text-label-code text-ink-muted"><span class="hover:text-ink cursor-pointer">VI</span><span class="text-border">/</span><span class="hover:text-ink cursor-pointer">VND</span></div><a class="relative flex items-center justify-center p-2 text-ink hover:text-lacquer-red transition-colors" data-path="gio-hang" href="#"><span class="material-symbols-outlined text-[24px]">shopping_bag</span><span class="absolute 1 top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-lacquer-red text-warm-porcelain rounded-full flex items-center justify-center font-label-micro text-[10px] leading-none font-bold">3</span></a><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]"><div class="flex flex-col w-full bg-surface text-ink pb-space-xl">
<!-- Top Utility Context & Sub-navigation -->
<section class="w-full bg-rice-paper/60 border-b border-border">
<div class="max-w-[1440px] mx-auto px-gutter py-space-sm">
<div class="flex items-center justify-between gap-space-sm flex-wrap">
<!-- Breadcrumbs -->
<nav aria-label="Breadcrumb" class="flex items-center gap-space-xs font-body-sm text-body-sm text-ink-muted">
<a class="hover:text-ink transition-colors" href="#">Trang chủ</a>
<span class="text-ink-faint">/</span>
<a class="hover:text-ink transition-colors" href="#">Kết quả tìm kiếm</a>
<span class="text-ink-faint">/</span>
<span class="text-ink font-medium">Laptop &amp; Thiết bị số</span>
</nav>
<!-- Operational Tag & State Simulator Pill -->
<div class="flex items-center gap-space-sm">
<div class="flex items-center gap-1.5 px-2.5 py-1 bg-warm-porcelain rounded-full border border-border font-label-code text-label-code text-ink-muted">
<span class="w-1.5 h-1.5 rounded-full bg-jade"></span>
<span>Kho vận Nếp: Đồng bộ tức thì</span>
</div>
<!-- Simulation Switcher Pill -->
<div class="hidden sm:flex items-center bg-surface-container rounded-lg p-0.5 border border-border text-ink-muted font-body-sm text-xs">
<button class="px-2.5 py-1 rounded bg-warm-porcelain text-lacquer-red font-medium transition-all shadow-sm" id="btn-state-normal" type="button">Có kết quả</button>
<button class="px-2.5 py-1 rounded text-ink-muted hover:text-ink transition-all" id="btn-state-empty" type="button">Rỗng (0)</button>
<button class="px-2.5 py-1 rounded text-ink-muted hover:text-ink transition-all" id="btn-state-skeleton" type="button">Đang tải</button>
</div>
</div>
</div>
</div>
</section>
<!-- Search Query & Meta Control Bar -->
<section class="w-full border-b border-border bg-rice-paper">
<div class="max-w-[1440px] mx-auto px-gutter py-space-md">
<div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
<!-- Dedicated In-Catalog Search Bar -->
<div class="relative flex-1 max-w-2xl">
<div class="relative flex items-center w-full">
<span class="material-symbols-outlined absolute left-3.5 text-ink-muted text-[22px] pointer-events-none">search</span>
<input class="w-full h-12 pl-11 pr-10 bg-warm-porcelain border border-border rounded-xl font-body-md text-body-md text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-lacquer-red focus:border-lacquer-red transition-all" id="catalog-search-input" placeholder="Tìm theo cấu hình, hãng máy, tên sản phẩm..." type="text" value="laptop"/>
<button class="absolute right-3 w-6 h-6 rounded-full flex items-center justify-center text-ink-muted hover:text-lacquer-red hover:bg-lacquer-wash/50 transition-colors" id="btn-clear-query" title="Xoá tìm kiếm" type="button">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
</div>
<!-- Result Metrics & Layout Display Tools -->
<div class="flex items-center justify-between lg:justify-end gap-space-md flex-wrap">
<div class="flex items-baseline gap-1.5">
<span class="font-body-sm text-body-sm text-ink-muted">Tìm được</span>
<span class="font-label-code text-label-code text-ink font-semibold text-[15px]" id="results-count-badge">1.248</span>
<span class="font-body-sm text-body-sm text-ink-muted">món chuẩn Nếp</span>
</div>
<div class="h-4 w-px bg-border hidden sm:block"></div>
<!-- Sort Dropdown -->
<div class="flex items-center gap-space-xs font-body-sm text-body-sm">
<label class="text-ink-muted shrink-0" for="catalog-sort">Sắp xếp:</label>
<div class="relative">
<select class="appearance-none bg-warm-porcelain border border-border pl-3 pr-8 py-2 rounded-xl text-ink font-medium focus:outline-none focus:ring-1 focus:ring-lacquer-red cursor-pointer" id="catalog-sort">
<option selected="">Phù hợp nhất</option>
<option>Bán chạy nhất</option>
<option>Giá tăng dần</option>
<option>Giá giảm dần</option>
<option>Mới nhất</option>
</select>
<span class="material-symbols-outlined absolute right-2 top-2.5 text-ink-muted pointer-events-none text-[18px]">expand_more</span>
</div>
</div>
<!-- View Switch -->
<div aria-label="Kiểu hiển thị" class="flex items-center bg-surface-container rounded-xl p-1 border border-border" role="group">
<button class="w-8 h-8 rounded-lg bg-warm-porcelain text-lacquer-red flex items-center justify-center transition-all shadow-sm" id="view-grid-btn" title="Hiển thị dạng lưới" type="button">
<span class="material-symbols-outlined text-[20px]">grid_view</span>
</button>
<button class="w-8 h-8 rounded-lg text-ink-muted hover:text-ink flex items-center justify-center transition-all" id="view-list-btn" title="Hiển thị dạng danh sách" type="button">
<span class="material-symbols-outlined text-[20px]">view_list</span>
</button>
</div>
</div>
</div>
<!-- Quick Category Horizontal Switcher Rail -->
<div class="mt-space-md pt-space-sm border-t border-border flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
<span class="font-label-micro text-label-micro text-ink-muted uppercase shrink-0 mr-1">Ngành hàng:</span>
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-lacquer-wash border border-lacquer-red text-lacquer-red shrink-0 transition-colors" type="button">
<span class="w-1.5 h-1.5 rounded-full bg-lacquer-red"></span>
<span>Điện tử &amp; Công nghệ</span>
</button>
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-warm-porcelain border border-border text-ink hover:border-ink-muted shrink-0 transition-colors" type="button">
<span>Gia dụng &amp; Nhà bếp</span>
</button>
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-warm-porcelain border border-border text-ink hover:border-ink-muted shrink-0 transition-colors" type="button">
<span>Nhà cửa &amp; Đời sống</span>
</button>
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-warm-porcelain border border-border text-ink hover:border-ink-muted shrink-0 transition-colors" type="button">
<span>Mẹ &amp; Bé</span>
</button>
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-warm-porcelain border border-border text-ink hover:border-ink-muted shrink-0 transition-colors" type="button">
<span>Thời trang &amp; Phụ kiện</span>
</button>
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-warm-porcelain border border-border text-ink hover:border-ink-muted shrink-0 transition-colors" type="button">
<span>Làm đẹp &amp; Sức khỏe</span>
</button>
</div>
<!-- Active Filter Chips Row -->
<div class="mt-space-sm flex items-center justify-between gap-space-sm flex-wrap pt-2" id="active-filters-bar">
<div class="flex items-center gap-2 flex-wrap">
<span class="font-label-micro text-label-micro text-ink-faint uppercase mr-1">Đang lọc:</span>
<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-warm-porcelain border border-border rounded-lg text-xs font-medium text-ink">
            Điện tử &amp; Công nghệ
            <button class="text-ink-muted hover:text-lacquer-red text-sm leading-none ml-1" type="button">×</button>
</span>
<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-warm-porcelain border border-border rounded-lg text-xs font-medium text-ink">
            Thương hiệu: <span class="font-semibold text-lacquer-red">ASUS</span>
<button class="text-ink-muted hover:text-lacquer-red text-sm leading-none ml-1" type="button">×</button>
</span>
<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-warm-porcelain border border-border rounded-lg text-xs font-medium text-ink">
            Giá: <span class="font-semibold">Dưới 15 triệu</span>
<button class="text-ink-muted hover:text-lacquer-red text-sm leading-none ml-1" type="button">×</button>
</span>
<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-warm-porcelain border border-border rounded-lg text-xs font-medium text-ink">
            Dịch vụ: Giao nhanh 2h
            <button class="text-ink-muted hover:text-lacquer-red text-sm leading-none ml-1" type="button">×</button>
</span>
</div>
<button class="font-body-sm text-xs text-ink-muted hover:text-lacquer-red underline decoration-1 underline-offset-4 transition-colors shrink-0" id="btn-clear-all-filters" type="button">
          Xoá tất cả bộ lọc
        </button>
</div>
</div>
</section>
<!-- Main Catalog Area: 12-Column Grid -->
<main class="w-full max-w-[1440px] mx-auto px-gutter pt-space-lg">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
<!-- LEFT FILTER RAIL (Span 3 cols ~ 280px to 320px) -->
<aside class="lg:col-span-3 flex flex-col w-full bg-rice-paper/40 p-space-md rounded-2xl border border-border lg:sticky lg:top-24">
<div class="flex items-center justify-between pb-space-sm mb-space-xs border-b border-border">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-lacquer-red text-[20px]">tune</span>
<h2 class="font-headline-3 text-headline-3 text-ink">Bộ Lọc Tuyển Chọn</h2>
</div>
<span class="font-label-code text-xs text-ink-muted bg-surface-container px-2 py-0.5 rounded">4 active</span>
</div>
<!-- 1. Danh mục con -->
<div class="py-space-sm border-t border-border">
<div class="flex items-center justify-between cursor-pointer group" onclick="document.getElementById('group-subcats').classList.toggle('hidden')">
<span class="font-body-sm text-body-sm font-semibold text-ink">Danh mục con</span>
<span class="material-symbols-outlined text-ink-muted text-[18px] group-hover:text-ink transition-transform">expand_more</span>
</div>
<div class="mt-2.5 flex flex-col gap-2 font-body-sm text-body-sm" id="group-subcats">
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input checked="" class="w-4 h-4 rounded border-border text-lacquer-red focus:ring-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Laptop văn phòng</span>
</span>
<span class="font-label-code text-xs text-ink-muted">412</span>
</label>
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input class="w-4 h-4 rounded border-border text-lacquer-red focus:ring-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Laptop Gaming &amp; Đồ họa</span>
</span>
<span class="font-label-code text-xs text-ink-muted">218</span>
</label>
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input class="w-4 h-4 rounded border-border text-lacquer-red focus:ring-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Máy tính bảng &amp; 2-in-1</span>
</span>
<span class="font-label-code text-xs text-ink-muted">184</span>
</label>
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input class="w-4 h-4 rounded border-border text-lacquer-red focus:ring-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Phụ kiện &amp; Chuột, Cáp</span>
</span>
<span class="font-label-code text-xs text-ink-muted">434</span>
</label>
</div>
</div>
<!-- 2. Thương hiệu với tìm nhanh bên trong -->
<div class="py-space-sm border-t border-border">
<div class="flex items-center justify-between cursor-pointer group" onclick="document.getElementById('group-brands').classList.toggle('hidden')">
<span class="font-body-sm text-body-sm font-semibold text-ink">Thương hiệu</span>
<span class="material-symbols-outlined text-ink-muted text-[18px] group-hover:text-ink">expand_more</span>
</div>
<div class="mt-2.5 flex flex-col gap-2 font-body-sm text-body-sm" id="group-brands">
<div class="relative mb-1">
<span class="material-symbols-outlined absolute left-2.5 top-2 text-ink-muted text-[16px]">search</span>
<input class="w-full h-8 pl-8 pr-2.5 bg-warm-porcelain border border-border rounded-lg text-xs placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-lacquer-red" placeholder="Tìm tên hãng..." type="text"/>
</div>
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input checked="" class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span class="font-medium text-lacquer-red">ASUS</span>
</span>
<span class="font-label-code text-xs text-ink-muted">328</span>
</label>
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Apple (MacBook)</span>
</span>
<span class="font-label-code text-xs text-ink-muted">142</span>
</label>
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Dell</span>
</span>
<span class="font-label-code text-xs text-ink-muted">265</span>
</label>
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Lenovo</span>
</span>
<span class="font-label-code text-xs text-ink-muted">210</span>
</label>
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>HP</span>
</span>
<span class="font-label-code text-xs text-ink-muted">189</span>
</label>
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Acer</span>
</span>
<span class="font-label-code text-xs text-ink-muted">114</span>
</label>
</div>
</div>
<!-- 3. Khoảng giá (VND) -->
<div class="py-space-sm border-t border-border">
<div class="flex items-center justify-between cursor-pointer group" onclick="document.getElementById('group-price').classList.toggle('hidden')">
<span class="font-body-sm text-body-sm font-semibold text-ink">Khoảng giá (₫)</span>
<span class="material-symbols-outlined text-ink-muted text-[18px] group-hover:text-ink">expand_more</span>
</div>
<div class="mt-2.5 flex flex-col gap-2.5 font-body-sm text-body-sm" id="group-price">
<div class="flex items-center gap-2">
<input class="w-1/2 h-9 px-2 bg-warm-porcelain border border-border rounded-lg text-center font-label-code text-xs text-ink focus:outline-none focus:ring-1 focus:ring-lacquer-red" type="text" value="0"/>
<span class="text-ink-muted text-xs">đến</span>
<input class="w-1/2 h-9 px-2 bg-warm-porcelain border border-border rounded-lg text-center font-label-code text-xs text-ink focus:outline-none focus:ring-1 focus:ring-lacquer-red" type="text" value="15.000.000"/>
</div>
<!-- Quick Price Pills -->
<div class="grid grid-cols-2 gap-1.5 text-xs">
<button class="py-1 px-2 rounded border border-border bg-warm-porcelain hover:bg-lacquer-wash text-ink transition-colors text-left" type="button">Dưới 10tr</button>
<button class="py-1 px-2 rounded border border-lacquer-red bg-lacquer-wash text-lacquer-red font-medium transition-colors text-left" type="button">10 - 15tr</button>
<button class="py-1 px-2 rounded border border-border bg-warm-porcelain hover:bg-lacquer-wash text-ink transition-colors text-left" type="button">15 - 25tr</button>
<button class="py-1 px-2 rounded border border-border bg-warm-porcelain hover:bg-lacquer-wash text-ink transition-colors text-left" type="button">Trên 25tr</button>
</div>
<button class="w-full mt-1 h-8 bg-warm-porcelain hover:bg-lacquer-wash text-lacquer-red font-medium border border-border hover:border-lacquer-red rounded-lg text-xs transition-colors flex items-center justify-center gap-1" type="button">
<span>Áp dụng giá</span>
</button>
</div>
</div>
<!-- 4. Đánh giá kiểm định -->
<div class="py-space-sm border-t border-border">
<div class="flex items-center justify-between cursor-pointer group" onclick="document.getElementById('group-rating').classList.toggle('hidden')">
<span class="font-body-sm text-body-sm font-semibold text-ink">Đánh giá thực tế</span>
<span class="material-symbols-outlined text-ink-muted text-[18px] group-hover:text-ink">expand_more</span>
</div>
<div class="mt-2 flex flex-col gap-1.5 text-xs font-body-sm" id="group-rating">
<label class="flex items-center justify-between cursor-pointer hover:bg-warm-porcelain p-1 rounded">
<div class="flex items-center gap-1.5 text-turmeric">
<div class="flex items-center">
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<span class="text-ink font-medium ml-1">5 sao tuyệt đối</span>
</div>
<span class="font-label-code text-ink-muted">92</span>
</label>
<label class="flex items-center justify-between cursor-pointer hover:bg-warm-porcelain p-1 rounded">
<div class="flex items-center gap-1.5 text-turmeric">
<div class="flex items-center">
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]">star</span>
</div>
<span class="text-ink ml-1">Từ 4 sao trở lên</span>
</div>
<span class="font-label-code text-ink-muted">840</span>
</label>
</div>
</div>
<!-- 5. Nơi bán & Vận chuyển -->
<div class="py-space-sm border-t border-border">
<div class="flex items-center justify-between cursor-pointer group" onclick="document.getElementById('group-location').classList.toggle('hidden')">
<span class="font-body-sm text-body-sm font-semibold text-ink">Nơi bán &amp; Kho hàng</span>
<span class="material-symbols-outlined text-ink-muted text-[18px] group-hover:text-ink">expand_more</span>
</div>
<div class="mt-2.5 flex flex-col gap-2 font-body-sm text-body-sm" id="group-location">
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input checked="" class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Hà Nội (Giao nhanh)</span>
</span>
<span class="font-label-code text-xs text-ink-muted">620</span>
</label>
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>TP. Hồ Chí Minh</span>
</span>
<span class="font-label-code text-xs text-ink-muted">510</span>
</label>
<label class="flex items-center justify-between text-ink cursor-pointer hover:text-lacquer-red">
<span class="flex items-center gap-2">
<input class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Đà Nẵng &amp; Miền Trung</span>
</span>
<span class="font-label-code text-xs text-ink-muted">118</span>
</label>
</div>
</div>
<!-- 6. Dịch vụ & Khuyến mãi ShopNest -->
<div class="py-space-sm border-t border-border">
<div class="flex items-center justify-between cursor-pointer group" onclick="document.getElementById('group-services').classList.toggle('hidden')">
<span class="font-body-sm text-body-sm font-semibold text-ink">Dịch vụ &amp; Tiêu chuẩn</span>
<span class="material-symbols-outlined text-ink-muted text-[18px] group-hover:text-ink">expand_more</span>
</div>
<div class="mt-2.5 flex flex-col gap-2 font-body-sm text-body-sm" id="group-services">
<label class="flex items-center gap-2 text-ink cursor-pointer hover:text-lacquer-red">
<input checked="" class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span class="inline-flex items-center gap-1">
<span class="material-symbols-outlined text-jade text-[16px]">local_shipping</span>
<span>Freeship toàn quốc</span>
</span>
</label>
<label class="flex items-center gap-2 text-ink cursor-pointer hover:text-lacquer-red">
<input checked="" class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span class="inline-flex items-center gap-1">
<span class="material-symbols-outlined text-lacquer-red text-[16px]">bolt</span>
<span class="font-medium text-lacquer-red">Giao nhanh 2h</span>
</span>
</label>
<label class="flex items-center gap-2 text-ink cursor-pointer hover:text-lacquer-red">
<input class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Trả góp 0% lãi suất</span>
</label>
<label class="flex items-center gap-2 text-ink cursor-pointer hover:text-lacquer-red">
<input class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span class="inline-flex items-center gap-1 text-jade">
<span class="material-symbols-outlined text-[16px]">verified</span>
<span>Đã kiểm duyệt xưởng Việt</span>
</span>
</label>
</div>
</div>
<!-- 7. Tình trạng máy -->
<div class="py-space-sm border-t border-border">
<div class="flex items-center justify-between cursor-pointer group" onclick="document.getElementById('group-conditions').classList.toggle('hidden')">
<span class="font-body-sm text-body-sm font-semibold text-ink">Tình trạng</span>
<span class="material-symbols-outlined text-ink-muted text-[18px] group-hover:text-ink">expand_more</span>
</div>
<div class="mt-2.5 flex flex-col gap-2 font-body-sm text-body-sm" id="group-conditions">
<label class="flex items-center gap-2 text-ink cursor-pointer hover:text-lacquer-red">
<input checked="" class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Hàng mới 100% nguyên seal</span>
</label>
<label class="flex items-center gap-2 text-ink cursor-pointer hover:text-lacquer-red">
<input class="w-4 h-4 rounded border-border text-lacquer-red accent-lacquer-red" type="checkbox"/>
<span>Trưng bày thanh lý chính hãng</span>
</label>
</div>
</div>
</aside>
<!-- RIGHT PRODUCT CATALOG (Span 9 cols) -->
<section class="lg:col-span-9 flex flex-col gap-space-lg">
<!-- STATE 1: Normal Results Grid (Default) -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md" id="state-normal-container">
<!-- Product Card 1 (ASUS Vivobook) -->
<article class="group bg-warm-porcelain border border-border rounded-[20px] p-3 flex flex-col justify-between transition-all duration-200 hover:border-lacquer-red/40 hover:-translate-y-0.5">
<div>
<!-- Image Wrap with 4:5 ratio -->
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-rice-paper mb-3">
<img class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" data-alt="Editorial studio photo of a sleek silver ASUS Vivobook laptop standing open on an artisanal light pine wood work desk beside a handmade ceramic tea cup. Warm morning sunlight casts delicate geometric shadows, minimalist Vietnamese aesthetic, crisp clean details in high resolution." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAcrcJxM-X29EzhJ4HFQ9LfAN3YTfA_TzORMqQo_Sy19ZgCeBf999iGSP-mcc8Pyc7gVyUZ27VZWAv8TsrOIoSpgxFac_wWF6BxddKzyBcbvJV2TGWZjYcmFh_IE-gcUAK_rKNIxc8oLGCQY1dBI9UqvG33BLfL3GExa02Rxp-e1oNHsiGBnKWMjXr4uu2jKk6WonSriRCnR213naeobUZnF4G8FR9alRWTyG1mg"/>
<span class="absolute top-2.5 left-2.5 px-2 py-0.5 bg-lacquer-red text-warm-porcelain rounded-full font-label-micro text-[11px] font-bold tracking-wider uppercase">
                  -14%
                </span>
<span class="absolute top-2.5 right-2.5 px-2 py-0.5 bg-warm-porcelain/90 backdrop-blur-sm border border-border text-ink rounded-full font-label-micro text-[10px] uppercase font-semibold flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-jade"></span>Giao 2h
                </span>
</div>
<!-- Shop Meta -->
<div class="flex items-center gap-1.5 mb-1.5">
<span class="px-1.5 py-0.5 bg-lacquer-wash text-lacquer-red rounded font-label-micro text-[10px] font-bold uppercase tracking-wider">Shop Việt</span>
<span class="font-body-sm text-xs text-ink-muted truncate">TechNest Official</span>
</div>
<!-- Title -->
<h3 class="font-headline-3 text-sm font-semibold text-ink line-clamp-2 leading-snug group-hover:text-lacquer-red transition-colors">
                Laptop ASUS Vivobook 14 OLED (M1405VA)
              </h3>
<!-- Spec Chips -->
<p class="mt-1.5 font-label-code text-xs text-ink-muted bg-surface-container/60 p-1.5 rounded-lg line-clamp-2">
                i5-13500H · 16GB RAM · 512GB SSD · 14" 2.8K OLED
              </p>
<div class="mt-2 flex items-center gap-2 text-xs text-ink-muted">
<span class="inline-flex items-center text-turmeric font-semibold">
<span class="material-symbols-outlined text-[14px] mr-0.5" style="font-variation-settings: 'FILL' 1;">star</span>
                  4.9
                </span>
<span>(84 đánh giá)</span>
<span class="text-border">·</span>
<span class="text-ink">BH 24 tháng</span>
</div>
</div>
<!-- Price & Action -->
<div class="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
<div>
<span class="block font-label-code text-sm font-semibold text-lacquer-red">14.990.000 ₫</span>
<span class="block font-label-code text-[11px] text-ink-faint line-through">17.500.000 ₫</span>
</div>
<button class="w-10 h-10 rounded-xl bg-lacquer-wash hover:bg-lacquer-red text-lacquer-red hover:text-warm-porcelain transition-all flex items-center justify-center active:scale-95" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
</button>
</div>
</article>
<!-- Product Card 2 (Dell Inspiron) -->
<article class="group bg-warm-porcelain border border-border rounded-[20px] p-3 flex flex-col justify-between transition-all duration-200 hover:border-lacquer-red/40 hover:-translate-y-0.5">
<div>
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-rice-paper mb-3">
<img class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" data-alt="Modern Dell laptop open at a 45 degree angle on a woven bamboo desk mat, beside a cup of Vietnamese drip coffee. Natural soft window lighting, warm interior styling with raw linen textures, ultra clear product photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXl08840oDY5QCC8kJ9_2tYIyxOgAQhvDosiCSJDN240GD5SWsolJwV9rtMDd1HpCzK1QqwQUFs8ayuYlLRymfGGteU6YT52U5H004ZX9enC5H0Bk43lhuv0TnTRKtKRo17Q3-WvP7bWnNEih8MkrLuXLj7pE51Y8CEPyIAdgGOEq9fzIDtyESqc9ayMOdCf3OxamVVy4SpL5mU2Hg59AeiVlxb3vdZA1fsI30LA"/>
<span class="absolute top-2.5 left-2.5 px-2 py-0.5 bg-surface-container text-ink rounded-full font-label-micro text-[11px] font-semibold tracking-wider">
                  Chính hãng
                </span>
</div>
<div class="flex items-center gap-1.5 mb-1.5">
<span class="px-1.5 py-0.5 bg-lacquer-wash text-lacquer-red rounded font-label-micro text-[10px] font-bold uppercase tracking-wider">Shop Việt</span>
<span class="font-body-sm text-xs text-ink-muted truncate">Laptop24h Chính Hãng</span>
</div>
<h3 class="font-headline-3 text-sm font-semibold text-ink line-clamp-2 leading-snug group-hover:text-lacquer-red transition-colors">
                Laptop Dell Inspiron 14 5430 Silver
              </h3>
<p class="mt-1.5 font-label-code text-xs text-ink-muted bg-surface-container/60 p-1.5 rounded-lg line-clamp-2">
                i5-1335U · 16GB · 512GB · 14" FHD+ WVA
              </p>
<div class="mt-2 flex items-center gap-2 text-xs text-ink-muted">
<span class="inline-flex items-center text-turmeric font-semibold">
<span class="material-symbols-outlined text-[14px] mr-0.5" style="font-variation-settings: 'FILL' 1;">star</span>
                  4.8
                </span>
<span>(112 đánh giá)</span>
<span class="text-border">·</span>
<span class="text-ink">BH 12 tháng</span>
</div>
</div>
<div class="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
<div>
<span class="block font-label-code text-sm font-semibold text-lacquer-red">16.490.000 ₫</span>
<span class="block font-label-code text-[11px] text-ink-faint line-through">18.200.000 ₫</span>
</div>
<button class="w-10 h-10 rounded-xl bg-lacquer-wash hover:bg-lacquer-red text-lacquer-red hover:text-warm-porcelain transition-all flex items-center justify-center active:scale-95" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
</button>
</div>
</article>
<!-- Product Card 3 (Lenovo IdeaPad Slim 5) -->
<article class="group bg-warm-porcelain border border-border rounded-[20px] p-3 flex flex-col justify-between transition-all duration-200 hover:border-lacquer-red/40 hover:-translate-y-0.5">
<div>
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-rice-paper mb-3">
<img class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" data-alt="Slim metallic grey Lenovo laptop displayed vertically and horizontally on a warm travertine surface, subtle shadows, organic rice-paper backdrop, refined tech minimalism with warm porcelain undertones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFLkq6X4qLFAeeWsanawQGOhLObvGDxj954w0ULh6DmROZMYndR75JfBfo_ibLwn_WBUu53TOFlSwPpbx5wHEcwvg0AnXZO6lbHDEqkrGv3emH0RpEcdR-TMDQQ2Vd0_cZqnwGXVhuFeVfnyAa8EmML-OqwXAh2Ai63ktkLQuUKjNXDS8Put4X6NuYCDpgrPn08Ge8ChBcnUU0FzksZu_7PMRYArgJkgHNS3zAXQ"/>
<span class="absolute top-2.5 right-2.5 px-2 py-0.5 bg-warm-porcelain/90 backdrop-blur-sm border border-border text-jade rounded-full font-label-micro text-[10px] uppercase font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[13px]">bolt</span> Sẵn hàng
                </span>
</div>
<div class="flex items-center gap-1.5 mb-1.5">
<span class="px-1.5 py-0.5 bg-lacquer-wash text-lacquer-red rounded font-label-micro text-[10px] font-bold uppercase tracking-wider">Shop Việt</span>
<span class="font-body-sm text-xs text-ink-muted truncate">Máy Tính Việt</span>
</div>
<h3 class="font-headline-3 text-sm font-semibold text-ink line-clamp-2 leading-snug group-hover:text-lacquer-red transition-colors">
                Laptop Lenovo IdeaPad Slim 5 14IAH8
              </h3>
<p class="mt-1.5 font-label-code text-xs text-ink-muted bg-surface-container/60 p-1.5 rounded-lg line-clamp-2">
                i5-12450H · 16GB · 512GB · Màn IPS 100% sRGB
              </p>
<div class="mt-2 flex items-center gap-2 text-xs text-ink-muted">
<span class="inline-flex items-center text-turmeric font-semibold">
<span class="material-symbols-outlined text-[14px] mr-0.5" style="font-variation-settings: 'FILL' 1;">star</span>
                  4.8
                </span>
<span>(76 đánh giá)</span>
<span class="text-border">·</span>
<span class="text-ink">BH 24 tháng</span>
</div>
</div>
<div class="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
<div>
<span class="block font-label-code text-sm font-semibold text-lacquer-red">15.290.000 ₫</span>
<span class="block font-label-code text-[11px] text-ink-faint">Giá niêm yết</span>
</div>
<button class="w-10 h-10 rounded-xl bg-lacquer-wash hover:bg-lacquer-red text-lacquer-red hover:text-warm-porcelain transition-all flex items-center justify-center active:scale-95" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
</button>
</div>
</article>
<!-- Product Card 4 (Apple MacBook Air M2) -->
<article class="group bg-warm-porcelain border border-border rounded-[20px] p-3 flex flex-col justify-between transition-all duration-200 hover:border-lacquer-red/40 hover:-translate-y-0.5">
<div>
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-rice-paper mb-3">
<img class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" data-alt="Midnight blue Apple MacBook Air M2 laptop shown in profile revealing thin silhouette, perched over a smooth terracotta block and dried reeds, clean editorial still life photography with warm studio light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjHMO321wILPe443C8mLiExTExeN4fIXIT_zF6z2QkhVGxl538zOrdSvfH4IIy8Ux9vUSE6TmB1zadjoqErMqCo7mWkYI1BWJ65NWb4fioxlFSqZyTFfNwP_AcdqiP5yB9W1X_6MIYunlQFsGeUZ-hHROWKKR99uryQtKjZmHzgzBanB9W-SzGYXX6mXmw3WsvXgRqlBtek3sbNt-ebW2FTIJfov-nhs0dqhr39Q"/>
<span class="absolute top-2.5 left-2.5 px-2 py-0.5 bg-ink text-warm-porcelain rounded-full font-label-micro text-[11px] font-bold tracking-wider uppercase">
                  Apple VN
                </span>
</div>
<div class="flex items-center gap-1.5 mb-1.5">
<span class="px-1.5 py-0.5 bg-lacquer-wash text-lacquer-red rounded font-label-micro text-[10px] font-bold uppercase tracking-wider">Shop Việt</span>
<span class="font-body-sm text-xs text-ink-muted truncate">TechNest Official</span>
</div>
<h3 class="font-headline-3 text-sm font-semibold text-ink line-clamp-2 leading-snug group-hover:text-lacquer-red transition-colors">
                Apple MacBook Air M2 13.6 inch (2022)
              </h3>
<p class="mt-1.5 font-label-code text-xs text-ink-muted bg-surface-container/60 p-1.5 rounded-lg line-clamp-2">
                Apple M2 · 8GB RAM · 256GB SSD · Liquid Retina
              </p>
<div class="mt-2 flex items-center gap-2 text-xs text-ink-muted">
<span class="inline-flex items-center text-turmeric font-semibold">
<span class="material-symbols-outlined text-[14px] mr-0.5" style="font-variation-settings: 'FILL' 1;">star</span>
                  5.0
                </span>
<span>(245 đánh giá)</span>
<span class="text-border">·</span>
<span class="text-jade font-medium">Bảo hành 12th</span>
</div>
</div>
<div class="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
<div>
<span class="block font-label-code text-sm font-semibold text-lacquer-red">22.990.000 ₫</span>
<span class="block font-label-code text-[11px] text-ink-faint line-through">24.990.000 ₫</span>
</div>
<button class="w-10 h-10 rounded-xl bg-lacquer-wash hover:bg-lacquer-red text-lacquer-red hover:text-warm-porcelain transition-all flex items-center justify-center active:scale-95" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
</button>
</div>
</article>
<!-- Product Card 5 (ASUS Zenbook 14 OLED) -->
<article class="group bg-warm-porcelain border border-border rounded-[20px] p-3 flex flex-col justify-between transition-all duration-200 hover:border-lacquer-red/40 hover:-translate-y-0.5">
<div>
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-rice-paper mb-3">
<img class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" data-alt="Premium ASUS Zenbook with engraved lacquer ceramic lid design, resting on a raw linen runner next to architectural notebooks, calm natural light highlighting the deep blue metallic finish." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG8Q3jVdeVCw8FUEI9xb1ILq1qxMyh34Zhh6ZZm6ASOabbpWP-mBUrtIQ1xXNFU7GiJuki9_kUp1lskqwiDGacO15CQF6ZOgkznXHPwq9FOq0R3oCiFvN4P0HMe8nvp1C-PlAdPx4YZkcS7iL-7KwRiHguF8h_J_FWNmpZQHzg7H0xr1M59MD3GSs38datGQ977bHRd3nrwPzEPHS1I5R-LWr1O123X9_X5ugCFQ"/>
<span class="absolute top-2.5 left-2.5 px-2 py-0.5 bg-jade text-warm-porcelain rounded-full font-label-micro text-[11px] font-bold tracking-wider uppercase">
                  AI Ready
                </span>
</div>
<div class="flex items-center gap-1.5 mb-1.5">
<span class="px-1.5 py-0.5 bg-surface-container text-ink-muted rounded font-label-micro text-[10px] font-bold uppercase tracking-wider">Chính Hãng</span>
<span class="font-body-sm text-xs text-ink-muted truncate">TechNest Official</span>
</div>
<h3 class="font-headline-3 text-sm font-semibold text-ink line-clamp-2 leading-snug group-hover:text-lacquer-red transition-colors">
                Laptop ASUS Zenbook 14 OLED UX3405
              </h3>
<p class="mt-1.5 font-label-code text-xs text-ink-muted bg-surface-container/60 p-1.5 rounded-lg line-clamp-2">
                Intel Core Ultra 7 · 16GB · 1TB · 3K OLED 120Hz
              </p>
<div class="mt-2 flex items-center gap-2 text-xs text-ink-muted">
<span class="inline-flex items-center text-turmeric font-semibold">
<span class="material-symbols-outlined text-[14px] mr-0.5" style="font-variation-settings: 'FILL' 1;">star</span>
                  4.9
                </span>
<span>(59 đánh giá)</span>
<span class="text-border">·</span>
<span class="text-ink">BH 24th tận nơi</span>
</div>
</div>
<div class="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
<div>
<span class="block font-label-code text-sm font-semibold text-lacquer-red">24.890.000 ₫</span>
<span class="block font-label-code text-[11px] text-ink-faint">Đổi mới 30 ngày</span>
</div>
<button class="w-10 h-10 rounded-xl bg-lacquer-wash hover:bg-lacquer-red text-lacquer-red hover:text-warm-porcelain transition-all flex items-center justify-center active:scale-95" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
</button>
</div>
</article>
<!-- Product Card 6 (HP Pavilion 14) -->
<article class="group bg-warm-porcelain border border-border rounded-[20px] p-3 flex flex-col justify-between transition-all duration-200 hover:border-lacquer-red/40 hover:-translate-y-0.5">
<div>
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-rice-paper mb-3">
<img class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" data-alt="Champagne gold HP Pavilion laptop sitting on a clean architectural wooden workstation with stationery and small bonsai plant, warm ambient Vietnamese daylight, crisp studio focus." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJPyNPd4KK0iQBEkNV5WObQzdO4ZUSPZm6Rc2ZJNauxlZ0gI_SU8b8BZKxvF2ovFPzC_XzqRK7OpnaUaC2Anw3QmGSXJKARIzLzZJykBWg8Shahme-TGu3lMpBFzGUIED9__BquFeo5dBExnlwR5N85RDv5y3a9J_HpbkNKgBQnPHF-XCQrA_qB9gQZJCau6XhWIdbo5xM5n1-mYZ8T345Cuxqs1tzEtaSqujxGg"/>
<span class="absolute top-2.5 left-2.5 px-2 py-0.5 bg-lacquer-red text-warm-porcelain rounded-full font-label-micro text-[11px] font-bold tracking-wider uppercase">
                  -10%
                </span>
</div>
<div class="flex items-center gap-1.5 mb-1.5">
<span class="px-1.5 py-0.5 bg-lacquer-wash text-lacquer-red rounded font-label-micro text-[10px] font-bold uppercase tracking-wider">Shop Việt</span>
<span class="font-body-sm text-xs text-ink-muted truncate">Gia Hưng Tech</span>
</div>
<h3 class="font-headline-3 text-sm font-semibold text-ink line-clamp-2 leading-snug group-hover:text-lacquer-red transition-colors">
                Laptop HP Pavilion 14-dv2073TU Vàng Gold
              </h3>
<p class="mt-1.5 font-label-code text-xs text-ink-muted bg-surface-container/60 p-1.5 rounded-lg line-clamp-2">
                i5-1235U · 16GB · 512GB · Phím LED · Mỏng nhẹ
              </p>
<div class="mt-2 flex items-center gap-2 text-xs text-ink-muted">
<span class="inline-flex items-center text-turmeric font-semibold">
<span class="material-symbols-outlined text-[14px] mr-0.5" style="font-variation-settings: 'FILL' 1;">star</span>
                  4.7
                </span>
<span>(63 đánh giá)</span>
<span class="text-border">·</span>
<span class="text-ink">BH 12 tháng</span>
</div>
</div>
<div class="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
<div>
<span class="block font-label-code text-sm font-semibold text-lacquer-red">13.890.000 ₫</span>
<span class="block font-label-code text-[11px] text-ink-faint line-through">15.500.000 ₫</span>
</div>
<button class="w-10 h-10 rounded-xl bg-lacquer-wash hover:bg-lacquer-red text-lacquer-red hover:text-warm-porcelain transition-all flex items-center justify-center active:scale-95" title="Thêm vào giỏ" type="button">
<span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
</button>
</div>
</article>
</div>
<!-- STATE 2: Empty State Container (Hidden by default) -->
<div class="hidden flex-col items-center justify-center py-20 px-4 bg-warm-porcelain border border-border rounded-2xl text-center" id="state-empty-container">
<div class="w-16 h-16 rounded-full bg-lacquer-wash text-lacquer-red flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-[32px]">inventory_2</span>
</div>
<h3 class="font-headline-2 text-headline-2 text-ink mb-2">Không tìm thấy món phù hợp</h3>
<p class="font-body-md text-ink-muted max-w-md mb-6">
            Không có kết quả nào khớp với tất cả bộ lọc đã chọn trong ngành hàng này. Bạn có thể xoá bớt tiêu chí hoặc tìm kiếm từ khoá khác.
          </p>
<div class="flex items-center gap-3">
<button class="h-11 px-6 rounded-xl bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain font-body-sm font-medium transition-colors" id="btn-empty-reset" type="button">
              Xoá toàn bộ bộ lọc
            </button>
<button class="h-11 px-5 rounded-xl border border-border bg-warm-porcelain text-ink hover:bg-rice-paper font-body-sm transition-colors" type="button">
              Về trang danh mục chính
            </button>
</div>
</div>
<!-- STATE 3: Loading Skeleton Container (Hidden by default) -->
<div class="hidden grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md" id="state-skeleton-container">
<!-- 6 skeleton mock cards -->
<div class="bg-warm-porcelain border border-border rounded-[20px] p-3 animate-pulse flex flex-col gap-3">
<div class="w-full aspect-[4/5] bg-surface-container rounded-xl"></div>
<div class="h-3 w-1/3 bg-surface-container rounded"></div>
<div class="h-5 w-4/5 bg-surface-container rounded"></div>
<div class="h-10 w-full bg-surface-container rounded-lg"></div>
<div class="h-8 w-full bg-surface-container rounded-lg mt-2"></div>
</div>
<div class="bg-warm-porcelain border border-border rounded-[20px] p-3 animate-pulse flex flex-col gap-3">
<div class="w-full aspect-[4/5] bg-surface-container rounded-xl"></div>
<div class="h-3 w-1/3 bg-surface-container rounded"></div>
<div class="h-5 w-4/5 bg-surface-container rounded"></div>
<div class="h-10 w-full bg-surface-container rounded-lg"></div>
<div class="h-8 w-full bg-surface-container rounded-lg mt-2"></div>
</div>
<div class="bg-warm-porcelain border border-border rounded-[20px] p-3 animate-pulse flex flex-col gap-3">
<div class="w-full aspect-[4/5] bg-surface-container rounded-xl"></div>
<div class="h-3 w-1/3 bg-surface-container rounded"></div>
<div class="h-5 w-4/5 bg-surface-container rounded"></div>
<div class="h-10 w-full bg-surface-container rounded-lg"></div>
<div class="h-8 w-full bg-surface-container rounded-lg mt-2"></div>
</div>
</div>
<!-- Catalog Pagination Bar -->
<div class="mt-space-sm pt-space-md border-t border-border flex flex-col sm:flex-row items-center justify-between gap-space-md">
<span class="font-label-code text-xs text-ink-muted">
            Hiển thị <span class="text-ink font-semibold">1 – 24</span> trong <span class="text-ink font-semibold">1.248</span> sản phẩm
          </span>
<!-- Number Pagination -->
<div class="flex items-center gap-1">
<button class="w-9 h-9 rounded-lg border border-border bg-warm-porcelain text-ink-muted hover:text-ink hover:border-ink-muted flex items-center justify-center transition-colors" title="Trang trước" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button class="w-9 h-9 rounded-lg bg-lacquer-red text-warm-porcelain font-label-code text-xs font-semibold flex items-center justify-center" type="button">
              1
            </button>
<button class="w-9 h-9 rounded-lg border border-border bg-warm-porcelain text-ink hover:bg-rice-paper font-label-code text-xs flex items-center justify-center transition-colors" type="button">
              2
            </button>
<button class="w-9 h-9 rounded-lg border border-border bg-warm-porcelain text-ink hover:bg-rice-paper font-label-code text-xs flex items-center justify-center transition-colors" type="button">
              3
            </button>
<span class="w-7 text-center font-label-code text-xs text-ink-faint">...</span>
<button class="w-9 h-9 rounded-lg border border-border bg-warm-porcelain text-ink hover:bg-rice-paper font-label-code text-xs flex items-center justify-center transition-colors" type="button">
              52
            </button>
<button class="w-9 h-9 rounded-lg border border-border bg-warm-porcelain text-ink-muted hover:text-ink hover:border-ink-muted flex items-center justify-center transition-colors" title="Trang kế tiếp" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</section>
</div>
</main>
</div>
<script>
  (function initCatalogInteractions() {
    const normalState = document.getElementById('state-normal-container');
    const emptyState = document.getElementById('state-empty-container');
    const skeletonState = document.getElementById('state-skeleton-container');
    const countBadge = document.getElementById('results-count-badge');
    const searchInput = document.getElementById('catalog-search-input');
    const btnClearQuery = document.getElementById('btn-clear-query');
    const btnClearAllFilters = document.getElementById('btn-clear-all-filters');
    const activeFiltersBar = document.getElementById('active-filters-bar');
    const btnEmptyReset = document.getElementById('btn-empty-reset');

    const btnStateNormal = document.getElementById('btn-state-normal');
    const btnStateEmpty = document.getElementById('btn-state-empty');
    const btnStateSkeleton = document.getElementById('btn-state-skeleton');

    const viewGridBtn = document.getElementById('view-grid-btn');
    const viewListBtn = document.getElementById('view-list-btn');

    function setActiveState(mode) {
      // Switch view panels
      if (mode === 'normal') {
        normalState.classList.remove('hidden');
        emptyState.classList.add('hidden');
        skeletonState.classList.add('hidden');
        skeletonState.classList.remove('grid');
        countBadge.textContent = '1.248';
      } else if (mode === 'empty') {
        normalState.classList.add('hidden');
        emptyState.classList.remove('hidden');
        skeletonState.classList.add('hidden');
        skeletonState.classList.remove('grid');
        countBadge.textContent = '0';
      } else if (mode === 'skeleton') {
        normalState.classList.add('hidden');
        emptyState.classList.add('hidden');
        skeletonState.classList.remove('hidden');
        skeletonState.classList.add('grid');
        countBadge.textContent = '...';
      }

      // Update simulation switcher buttons
      [btnStateNormal, btnStateEmpty, btnStateSkeleton].forEach(btn => {
        btn.classList.remove('bg-warm-porcelain', 'text-lacquer-red', 'font-medium', 'shadow-sm');
        btn.classList.add('text-ink-muted');
      });

      if (mode === 'normal') {
        btnStateNormal.classList.add('bg-warm-porcelain', 'text-lacquer-red', 'font-medium', 'shadow-sm');
        btnStateNormal.classList.remove('text-ink-muted');
      } else if (mode === 'empty') {
        btnStateEmpty.classList.add('bg-warm-porcelain', 'text-lacquer-red', 'font-medium', 'shadow-sm');
        btnStateEmpty.classList.remove('text-ink-muted');
      } else if (mode === 'skeleton') {
        btnStateSkeleton.classList.add('bg-warm-porcelain', 'text-lacquer-red', 'font-medium', 'shadow-sm');
        btnStateSkeleton.classList.remove('text-ink-muted');
      }
    }

    if (btnStateNormal) btnStateNormal.addEventListener('click', () => setActiveState('normal'));
    if (btnStateEmpty) btnStateEmpty.addEventListener('click', () => setActiveState('empty'));
    if (btnStateSkeleton) btnStateSkeleton.addEventListener('click', () => setActiveState('skeleton'));

    // Clear search query button
    if (btnClearQuery && searchInput) {
      btnClearQuery.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
      });
    }

    // Reset filters trigger
    function resetFilters() {
      setActiveState('normal');
      if (searchInput) searchInput.value = 'laptop';
      if (activeFiltersBar) {
        activeFiltersBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    if (btnClearAllFilters) btnClearAllFilters.addEventListener('click', resetFilters);
    if (btnEmptyReset) btnEmptyReset.addEventListener('click', resetFilters);

    // Grid vs List view toggle
    if (viewGridBtn && viewListBtn) {
      viewGridBtn.addEventListener('click', () => {
        viewGridBtn.classList.add('bg-warm-porcelain', 'text-lacquer-red', 'shadow-sm');
        viewGridBtn.classList.remove('text-ink-muted');
        viewListBtn.classList.remove('bg-warm-porcelain', 'text-lacquer-red', 'shadow-sm');
        viewListBtn.classList.add('text-ink-muted');

        normalState.classList.remove('grid-cols-1');
        normalState.classList.add('md:grid-cols-2', 'xl:grid-cols-3');
      });

      viewListBtn.addEventListener('click', () => {
        viewListBtn.classList.add('bg-warm-porcelain', 'text-lacquer-red', 'shadow-sm');
        viewListBtn.classList.remove('text-ink-muted');
        viewGridBtn.classList.remove('bg-warm-porcelain', 'text-lacquer-red', 'shadow-sm');
        viewGridBtn.classList.add('text-ink-muted');

        normalState.classList.remove('md:grid-cols-2', 'xl:grid-cols-3');
        normalState.classList.add('grid-cols-1');
      });
    }
  })();
</script></main><footer class="w-full bg-rice-paper border-t border-border mt-space-xl"><div class="w-full px-gutter py-space-xl"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl"><div class="flex flex-col gap-space-sm"><h3 class="font-headline-3 text-headline-3 text-ink">ShopNest Nếp Sống</h3><p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">Không gian hội tụ tinh hoa hàng quán tuyển chọn, giữ vẹn chuẩn mực văn hóa Nếp trong từng trải nghiệm tiêu dùng đương đại.</p><div class="flex items-center gap-space-xs text-ink-faint font-label-code text-label-code"><span class="material-symbols-outlined text-[18px]">verified</span><span>Chứng thực nguồn gốc hàng hóa</span></div></div><div class="flex flex-col gap-space-sm"><h3 class="font-headline-3 text-headline-3 text-ink">Dịch vụ &amp; Tiêu chuẩn Nếp</h3><ul class="flex flex-col gap-space-xs font-body-sm text-body-sm text-ink-muted"><li><a class="hover:text-lacquer-red transition-colors" data-path="chinh-sach-doi-tra" href="#">Chính sách đổi trả 7 ngày</a></li><li><a class="hover:text-lacquer-red transition-colors" data-path="kiem-dinh-chat-luong" href="#">Quy trình kiểm định chất lượng</a></li><li><a class="hover:text-lacquer-red transition-colors" data-path="giao-van-than-thien" href="#">Giao vận bọc lót thân thiện môi trường</a></li><li><a class="hover:text-lacquer-red transition-colors" data-path="tra-cuu-bao-hanh" href="#">Tra cứu bảo hành điện tử</a></li></ul></div><div class="flex flex-col gap-space-sm"><h3 class="font-headline-3 text-headline-3 text-ink">Dành cho đối tác</h3><ul class="flex flex-col gap-space-xs font-body-sm text-body-sm text-ink-muted"><li><a class="hover:text-lacquer-red transition-colors" data-path="dang-ky-ban-hang" href="#">Đăng ký mở gian hàng thủ công &amp; bách hóa</a></li><li><a class="hover:text-lacquer-red transition-colors" data-path="tieu-chuan-nha-cung-cap" href="#">Bộ quy chuẩn đối tác tuyển chọn</a></li><li><a class="hover:text-lacquer-red transition-colors" data-path="cong-thanh-toan-doi-soat" href="#">Hệ thống đối soát doanh thu minh bạch</a></li><li><a class="hover:text-lacquer-red transition-colors" data-path="lien-he-hop-tac" href="#">Liên hệ hợp tác phân phối độc quyền</a></li></ul></div><div class="flex flex-col gap-space-sm"><h3 class="font-headline-3 text-headline-3 text-ink">Bản tin Nếp sống</h3><p class="font-body-sm text-body-sm text-ink-muted">Nhận tuyển tập câu chuyện nghệ nhân và thông báo ưu đãi dành riêng cho thành viên.</p><div class="flex flex-col gap-space-xs"><div class="flex items-center gap-space-xs"><input class="w-full h-11 px-3 bg-warm-porcelain border border-border rounded-lg font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-lacquer-red transition-all" placeholder="Nhập email của bạn..." type="email"/><button class="h-11 px-4 bg-lacquer-red text-warm-porcelain font-body-sm text-body-sm font-medium rounded-lg hover:bg-lacquer-deep active:scale-95 transition-all shrink-0" type="button">Đăng ký</button></div><span class="font-label-micro text-label-micro text-ink-faint">Cam kết không gửi thư rác. Tôn trọng quyền riêng tư.</span></div></div></div><div class="mt-space-xl pt-space-lg border-t border-border flex flex-col sm:flex-row items-center justify-between gap-space-md"><span class="font-body-sm text-body-sm text-ink-muted">© 2025 ShopNest. Chuẩn mực tuyển chọn thuần Việt. Mọi quyền được bảo lưu.</span><div class="flex items-center gap-space-md font-body-sm text-body-sm text-ink-muted"><a class="hover:text-ink transition-colors" data-path="dieu-khoan" href="#">Điều khoản</a><a class="hover:text-ink transition-colors" data-path="bao-mat" href="#">Bảo mật</a><a class="hover:text-ink transition-colors" data-path="tro-giup" href="#">Trợ giúp</a></div></div></div></footer></body></html>
```
### S03 - Chi tiết san phẩm
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={"darkMode":"class","theme":{"extend":{"colors":{"background":"#fef9ee","on-secondary":"#ffffff","lacquer-wash":"#F2DCD5","on-background":"#1d1c15","ink-muted":"#6B6458","surface-bright":"#fef9ee","on-primary":"#ffffff","on-secondary-fixed":"#1d1b17","on-tertiary-fixed-variant":"#4b463a","inverse-primary":"#ffb4aa","on-secondary-container":"#67645f","primary":"#91221a","on-error":"#ffffff","surface":"#fef9ee","surface-tint":"#aa342a","secondary-container":"#e8e2db","tertiary-fixed-dim":"#cec6b5","turmeric":"#8A5A1A","surface-dim":"#dedacf","on-surface":"#1d1c15","surface-container-low":"#f8f3e8","lacquer-red":"#B23A2F","raw-linen":"#EDE4D3","secondary-fixed":"#e8e2db","tertiary-container":"#696356","on-error-container":"#93000a","on-tertiary-fixed":"#1f1b11","brick":"#8B2A24","ink-faint":"#9A8F7F","on-primary-fixed-variant":"#891c16","inverse-on-surface":"#f5f0e5","error-container":"#ffdad6","on-primary-fixed":"#410001","warm-porcelain":"#FFFCF4","logo-blue":"#4991D8","outline":"#8c716d","on-tertiary-container":"#e9e0cf","surface-variant":"#e7e2d7","primary-container":"#b23a2f","on-secondary-fixed-variant":"#494641","tertiary":"#514b3f","outline-variant":"#dfbfbb","on-primary-container":"#ffd9d3","on-tertiary":"#ffffff","error":"#ba1a1a","tertiary-fixed":"#eae2d1","surface-container-highest":"#e7e2d7","lacquer-deep":"#8C2A22","primary-fixed":"#ffdad5","ink":"#1D1B17","rice-paper":"#F6F1E6","secondary-fixed-dim":"#cbc6bf","inverse-surface":"#323029","primary-fixed-dim":"#ffb4aa","secondary":"#615e59","surface-container-lowest":"#ffffff","border":"#DCD1BE","surface-container-high":"#ede8dd","on-surface-variant":"#58413e","surface-container":"#f2ede2","jade":"#2F6B57"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"gutter-mobile":"1rem","space-xs":"0.25rem","gutter":"1.5rem","space-sm":"0.5rem","space-lg":"1.5rem","margin":"3rem","space-xl":"2.5rem","margin-mobile":"1.25rem","space-md":"1rem"},"fontFamily":{"body-sm":["Be Vietnam Pro"],"headline-2":["Newsreader"],"display-lg":["Newsreader"],"body-md":["Be Vietnam Pro"],"label-code":["JetBrains Mono"],"display-xl-mobile":["Newsreader"],"headline-3":["Be Vietnam Pro"],"display-lg-mobile":["Newsreader"],"headline-1":["Newsreader"],"display-xl":["Newsreader"],"body-lg":["Be Vietnam Pro"],"label-micro":["Be Vietnam Pro"]},"fontSize":{"body-sm":["14px",{"lineHeight":"21px","fontWeight":"400"}],"headline-2":["28px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"600"}],"display-lg":["48px",{"lineHeight":"48px","letterSpacing":"-0.03em","fontWeight":"600"}],"body-md":["16px",{"lineHeight":"26px","fontWeight":"400"}],"label-code":["14px",{"lineHeight":"20px","fontWeight":"500"}],"display-xl-mobile":["40px",{"lineHeight":"40px","letterSpacing":"-0.03em","fontWeight":"600"}],"headline-3":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}],"display-lg-mobile":["32px",{"lineHeight":"34px","letterSpacing":"-0.025em","fontWeight":"600"}],"headline-1":["36px",{"lineHeight":"40px","letterSpacing":"-0.025em","fontWeight":"600"}],"display-xl":["64px",{"lineHeight":"60px","letterSpacing":"-0.035em","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"label-micro":["12px",{"lineHeight":"16px","letterSpacing":"0.12em","fontWeight":"600"}]}}}};</script></head><body class="bg-surface font-body-md text-on-surface antialiased"><header class="fixed top-0 left-0 right-0 z-50 bg-warm-porcelain/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="h-20 w-full px-gutter flex items-center justify-between gap-gutter"><div class="flex items-center gap-space-md shrink-0"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><div class="flex flex-col"><span class="font-headline-3 text-headline-3 text-ink tracking-tight">ShopNest</span><span class="font-label-micro text-label-micro uppercase tracking-wider text-ink-muted hidden sm:block">Sàn TMĐT Tuyển Chọn</span></div></div><div class="flex-1 max-w-xl mx-space-md hidden md:block"><form action="#" class="relative flex items-center w-full"><input class="w-full h-11 pl-space-md pr-12 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:bg-warm-porcelain" placeholder="Tìm laptop, nồi chiên, xe đẩy..." type="text"/><button aria-label="Tìm kiếm" class="absolute right-1 top-1 bottom-1 w-9 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-lacquer-deep transition-colors" type="submit"><span class="material-symbols-outlined text-[18px]">search</span></button></form></div><nav class="hidden xl:flex items-center gap-space-lg" data-active-classes="text-primary font-semibold"><a class="font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors" data-path="danh-muc" href="#">Danh mục</a><a class="font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors" data-path="khuyen-mai" href="#">Khuyến mãi</a><a class="font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors" data-path="shop-viet" href="#">Shop Việt</a><a class="font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors" data-path="don-hang" href="#">Đơn hàng</a></nav><div class="flex items-center gap-space-md shrink-0"><div class="hidden lg:flex items-center gap-space-xs font-label-code text-label-code text-ink-muted"><span class="material-symbols-outlined text-[18px] text-ink-faint">language</span><span>VI / VND</span></div><a class="relative p-space-xs text-ink-muted hover:text-ink transition-colors flex items-center" data-path="don-hang" href="#"><span class="material-symbols-outlined text-[24px]">shopping_bag</span><span class="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-lacquer-red text-warm-porcelain font-label-code text-[11px] flex items-center justify-center">3</span></a><div class="flex items-center gap-space-xs"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><span class="font-body-sm text-body-sm text-ink hidden sm:block">Tài khoản</span></div></div></div></header><main class="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]"><div class="flex flex-col w-full">
<!-- Top Breadcrumb & Status Ledger -->
<section class="w-full bg-rice-paper px-gutter py-space-sm border-b border-border/80">
<div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm">
<nav aria-label="Đường dẫn điều hướng" class="flex items-center gap-space-xs font-body-sm text-body-sm text-ink-muted">
<a class="hover:text-lacquer-red transition-colors" href="#">Chợ</a>
<span class="material-symbols-outlined text-[16px] text-ink-faint">chevron_right</span>
<a class="hover:text-lacquer-red transition-colors" href="#">Điện tử &amp; công nghệ</a>
<span class="material-symbols-outlined text-[16px] text-ink-faint">chevron_right</span>
<a class="hover:text-lacquer-red transition-colors" href="#">Laptop &amp; Máy tính</a>
<span class="material-symbols-outlined text-[16px] text-ink-faint">chevron_right</span>
<span class="text-ink font-medium truncate max-w-[280px] sm:max-w-none">Laptop ASUS Vivobook 14 OLED M1405</span>
</nav>
<div class="hidden md:flex items-center gap-space-md font-label-code text-[12px] text-ink-muted">
<span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-jade"></span>Kho kiểm định: Sẵn 14 máy</span>
<span class="text-border">|</span>
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[15px] text-turmeric">verified</span>Ủy quyền ASUS Việt Nam</span>
</div>
</div>
</section>
<!-- Main Product Showcase Grid (7 / 5 Columns) -->
<section class="w-full px-gutter py-space-xl bg-rice-paper/50">
<div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
<!-- Left Column: Gallery & Artifact Inspection (7 cols) -->
<div class="lg:col-span-7 flex flex-col gap-space-md">
<!-- Main Stage Container -->
<div class="relative bg-warm-porcelain rounded-[20px] border border-border p-space-md overflow-hidden group">
<!-- Subtle Verification Tags -->
<div class="absolute top-space-md left-space-md z-10 flex flex-col gap-1.5">
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-jade/10 text-jade font-label-code text-[11px] font-semibold tracking-wide backdrop-blur-sm">
<span class="material-symbols-outlined text-[14px]">verified</span>
              Shop Việt Tuyển Chọn
            </span>
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high/90 text-ink-muted font-label-code text-[11px] font-medium backdrop-blur-sm border border-border/40">
<span class="material-symbols-outlined text-[14px]">shield</span>
              Chính hãng 100% · ASUS VN
            </span>
</div>
<!-- Utility Micro Tools (Top Right) -->
<div class="absolute top-space-md right-space-md z-10 flex items-center gap-1.5">
<button aria-label="Phóng to ảnh" class="h-9 px-3 rounded-lg bg-warm-porcelain/90 hover:bg-lacquer-wash text-ink border border-border font-body-sm text-[13px] flex items-center gap-1.5 transition-colors" id="zoomBtn" type="button">
<span class="material-symbols-outlined text-[18px]">zoom_in</span>
<span class="hidden sm:inline">Phóng to</span>
</button>
<button aria-label="Lưu sản phẩm" class="w-9 h-9 rounded-lg bg-warm-porcelain/90 hover:bg-lacquer-wash text-ink-muted hover:text-lacquer-red border border-border flex items-center justify-center transition-colors" type="button">
<span class="material-symbols-outlined text-[20px]">bookmark_border</span>
</button>
</div>
<!-- 4:5 Master Display Frame -->
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center">
<img alt="Laptop ASUS Vivobook 14 OLED M1405" class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" data-alt="Modern ASUS Vivobook 14 OLED laptop displayed on a warm minimalist wooden desk with natural morning daylight, soft architectural shadows, subtle brushed aluminum texture, crisp OLED 2.8K screen showing gentle geometric art, Vietnamese ceramic tea cup alongside, shot in high editorial clarity with rich tonal depth" id="mainImage" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBScEtfoAuVEQlsVzJnHofl5za7R1AASiF-5r1hdIOaHMi8T1-Kyqvo_QIyqK7LlFuWXzUxoYNOB0L2FKG3PxDY1XsVJTPiTH_zuRve4-xsA_UwSXKp1EGcQYlxlEUVbQ_4OPWlgucrhsiRC6G4H9KFeptjVlApNEHyaxg4GvgLJ8SPuIWIHjEyqFwLnhSZRWdH1nsyW3YoH-qYiuZZgBl6BU3dauasqMP5nd4JpA"/>
<div class="absolute bottom-space-md left-space-md right-space-md flex items-center justify-between text-ink-faint font-label-code text-[11px] bg-warm-porcelain/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/60">
<span>Độ phân giải OLED 2880 x 1800 · DCI-P3 100%</span>
<span class="hidden sm:inline">Ảnh chụp thực tế lô hàng nhập khẩu</span>
</div>
</div>
</div>
<!-- Thumbnail Rail & Gallery Extras -->
<div class="flex items-center justify-between gap-space-sm">
<div class="grid grid-cols-4 gap-space-sm flex-1">
<button class="thumb-btn group relative aspect-square rounded-xl overflow-hidden bg-warm-porcelain border-2 border-lacquer-red p-1 transition-all" onclick="selectThumb(0)" type="button">
<img alt="ASUS Vivobook mặt trước" class="w-full h-full object-cover rounded-lg" data-alt="Direct front angle view of ASUS Vivobook 14 OLED open on a clean desk, highlighting the ultra-thin bezel and glowing vivid display" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnvsNlqtNdQYfnLBMM-lstgXZPZdLIHYdMPNA8hfWN7L16INLUc_JB3bC7hEY6wTZMXUHMAi9ip2OWQvbmMss4Uqfi17innAosaHvF83V2eyGMcuUm1jd4ZXY7z8SIeQnVnPPeD5um7rEFckHzm2C20fOpgmkAAoKSKYZI8tjgl3xGEMJrGEwaVP6A-fqRH6Kq7NY5kjzHGKiFlrxdD0t8SiGmhuHISy1h7CGFvg"/>
<span class="sr-only">Xem ảnh 1: Góc chính diện</span>
</button>
<button class="thumb-btn group relative aspect-square rounded-xl overflow-hidden bg-warm-porcelain border border-border p-1 hover:border-lacquer-red/60 transition-all" onclick="selectThumb(1)" type="button">
<img alt="Bàn phím ASUS ErgoSense" class="w-full h-full object-cover rounded-lg" data-alt="Close-up macro shot of the ASUS ErgoSense keyboard and smooth touchpad, soft warm studio lighting, Vietnamese interior aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKhQlexnDCOR0TNULet9fbV01pmZURHriTxpzclDjEr7SJlXRjEf_OWC4IIvdNUWfMSmHQDqAk_mhvfdAF02ojlazXD8MupTt0iliqRIxurYKj___1fURffYZUOou_QpaRQS0BHyfyDrfS7Py6l4n_3GZyAWEndIY0QyKw4B0nhgMdEuglzq4plxLG6MmmikhRTISsw45wv6bh2HT5M5UhNTLOa8FxTiJ5Oc-29Q"/>
<span class="sr-only">Xem ảnh 2: Bàn phím &amp; Touchpad</span>
</button>
<button class="thumb-btn group relative aspect-square rounded-xl overflow-hidden bg-warm-porcelain border border-border p-1 hover:border-lacquer-red/60 transition-all" onclick="selectThumb(2)" type="button">
<img alt="Độ mỏng thân máy và cổng kết nối" class="w-full h-full object-cover rounded-lg" data-alt="Side profile view showing the slim 17.9mm silver aluminum chassis, USB-C ports, and refined hinge mechanism on linen surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPExNOKOPwNTx3QHRVkUhjwvEWsAW8vs3szpih5HO7Q0TOoIdALTJ9qUEs7tcgdSQTUvWQwcBtHmjBRF9QoU-wawiQ3FsL_cZkKvoUb0-mfOVamNwcecGtz-7em8L22uPr-K2-77dsl-2btIOVm8YjWTlS1M3GQAkMB0u24sA83FNKLk_BqQGPHa7vtVlYj8xWdw2RWcmrzuhbszskm9k4g1CENtanolTFdMmfMg"/>
<span class="sr-only">Xem ảnh 3: Góc cạnh bên &amp; cổng giao tiếp</span>
</button>
<button class="thumb-btn group relative aspect-square rounded-xl overflow-hidden bg-warm-porcelain border border-border p-1 hover:border-lacquer-red/60 transition-all" onclick="selectThumb(3)" type="button">
<img alt="Không gian làm việc văn phòng" class="w-full h-full object-cover rounded-lg" data-alt="Lifestyle shot of a professional workspace with ASUS laptop, linen notebook, and brass pen in a serene Hanoi sunlit study" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAZlch6beehwo6No-Fgt71DJa3XEs-Wbsjpn0t3nGkOqhJPiuv4lWnBwRZoZDYxg9aWYC3AhTjc1zFsR_Lkzd9C9re50B9XW-EE-7ThSG17qsvTHz_hnFzAiLuQTOuT9bV0KmxqhfI1hMJJdIoR-tuifdHn-vWIXgGAt1Fusb-qb74Ku3t1jsBa4TexwVGTKmB_oarzVfPx8EhUjhSSHXRUTQ0Go50oCQA9z92ow"/>
<span class="sr-only">Xem ảnh 4: Không gian sử dụng thực tế</span>
</button>
</div>
<button class="shrink-0 px-3 py-2 rounded-xl bg-warm-porcelain border border-border hover:bg-lacquer-wash text-ink-muted hover:text-ink font-body-sm text-[12px] flex flex-col items-center justify-center gap-0.5 h-full aspect-square text-center transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">photo_library</span>
<span>+6 ảnh</span>
</button>
</div>
<!-- Micro Reassurance Banner -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs">
<div class="p-space-sm rounded-xl bg-warm-porcelain border border-border/70 flex items-center gap-space-sm">
<span class="w-8 h-8 rounded-lg bg-raw-linen flex items-center justify-center text-lacquer-red shrink-0">
<span class="material-symbols-outlined text-[20px]">verified_user</span>
</span>
<div class="flex flex-col min-w-0">
<span class="font-headline-3 text-[13px] text-ink truncate">Bảo hành 24 tháng</span>
<span class="font-body-sm text-[11px] text-ink-muted truncate">Chính hãng tận nơi (ASUS VN)</span>
</div>
</div>
<div class="p-space-sm rounded-xl bg-warm-porcelain border border-border/70 flex items-center gap-space-sm">
<span class="w-8 h-8 rounded-lg bg-raw-linen flex items-center justify-center text-turmeric shrink-0">
<span class="material-symbols-outlined text-[20px]">cycle</span>
</span>
<div class="flex flex-col min-w-0">
<span class="font-headline-3 text-[13px] text-ink truncate">Đổi mới 7 ngày</span>
<span class="font-body-sm text-[11px] text-ink-muted truncate">Miễn phí nếu phát sinh lỗi phần cứng</span>
</div>
</div>
<div class="p-space-sm rounded-xl bg-warm-porcelain border border-border/70 flex items-center gap-space-sm">
<span class="w-8 h-8 rounded-lg bg-raw-linen flex items-center justify-center text-jade shrink-0">
<span class="material-symbols-outlined text-[20px]">local_shipping</span>
</span>
<div class="flex flex-col min-w-0">
<span class="font-headline-3 text-[13px] text-ink truncate">Giao hỏa tốc 2 giờ</span>
<span class="font-body-sm text-[11px] text-ink-muted truncate">Nội thành Hà Nội &amp; TP.HCM</span>
</div>
</div>
</div>
</div>
<!-- Right Column: Sticky Buy Box & Commerce Ledger (5 cols) -->
<div class="lg:col-span-5 flex flex-col gap-space-md lg:sticky lg:top-24">
<!-- Main Order Dossier Card -->
<div class="bg-warm-porcelain rounded-[20px] border border-border p-space-lg flex flex-col gap-space-md">
<!-- Shop Entity Line -->
<div class="flex items-center justify-between pb-space-sm border-b border-border/70">
<div class="flex items-center gap-space-sm">
<div class="w-10 h-10 rounded-lg bg-lacquer-deep text-warm-porcelain font-label-code text-[14px] font-bold flex items-center justify-center">
                TN
              </div>
<div class="flex flex-col">
<div class="flex items-center gap-1.5">
<span class="font-headline-3 text-[15px] text-ink font-semibold">TechNest Official</span>
<span class="w-1.5 h-1.5 rounded-full bg-jade"></span>
<span class="font-label-code text-[11px] text-jade uppercase">Đã kiểm duyệt</span>
</div>
<div class="flex items-center gap-2 font-body-sm text-[12px] text-ink-muted">
<span class="text-turmeric font-semibold flex items-center gap-0.5">
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
                    4.9
                  </span>
<span>·</span>
<span>1.8k theo dõi</span>
</div>
</div>
</div>
<a class="font-body-sm text-[13px] text-lacquer-red hover:text-lacquer-deep underline underline-offset-4 decoration-1 font-medium transition-colors" href="#">
              Xem gian hàng
            </a>
</div>
<!-- Product Title & Social Proof -->
<div class="flex flex-col gap-1.5">
<h1 class="font-headline-3 text-headline-2 text-ink leading-tight">
              Laptop ASUS Vivobook 14 OLED (M1405VA)
            </h1>
<div class="flex flex-wrap items-center gap-space-sm font-label-code text-body-sm text-ink-muted pt-0.5">
<div class="flex items-center text-turmeric font-semibold">
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="ml-1 text-ink">4,8</span>
<span class="text-ink-faint font-normal">/5</span>
</div>
<span class="text-border">·</span>
<a class="hover:text-lacquer-red underline underline-offset-2 transition-colors" href="#reviews-section">126 đánh giá thực tế</a>
<span class="text-border">·</span>
<span class="text-ink-muted">418 đã bán</span>
</div>
</div>
<!-- Pricing Block (JetBrains Mono Emphasis) -->
<div class="p-space-md rounded-xl bg-surface-container-low border border-border/60 flex flex-col gap-1.5">
<div class="flex items-baseline gap-space-sm">
<span class="font-label-code text-[32px] leading-none font-bold text-lacquer-red tracking-tight">
                14.990.000 ₫
              </span>
<span class="font-label-code text-body-sm text-ink-faint line-through">
                16.490.000 ₫
              </span>
<span class="px-2 py-0.5 rounded bg-lacquer-wash text-lacquer-red font-label-code text-[12px] font-semibold">
                -9%
              </span>
</div>
<!-- Installment Clarity -->
<div class="flex items-center gap-1.5 pt-1 text-ink-muted font-body-sm text-[13px]">
<span class="material-symbols-outlined text-[16px] text-jade">credit_card</span>
<span>Trả góp từ <strong class="font-label-code text-ink font-semibold">1.249.000 ₫/tháng</strong> (0% lãi suất qua thẻ hoặc duyệt trực tuyến trong 3 phút).</span>
</div>
</div>
<!-- Variant Selector: Processor & Storage -->
<div class="flex flex-col gap-space-xs pt-1">
<div class="flex items-center justify-between text-ink">
<span class="font-headline-3 text-[14px]">Cấu hình vi xử lý &amp; Bộ nhớ:</span>
<span class="font-label-code text-[12px] text-lacquer-red font-semibold" id="selectedConfigName">i5 · 16GB · 512GB SSD</span>
</div>
<div class="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-1">
<!-- Active Chip 1 -->
<button class="config-chip text-left p-2.5 rounded-xl border-2 border-lacquer-red bg-lacquer-wash/20 flex flex-col gap-0.5 transition-all" onclick="selectConfig(this, 'i5 · 16GB · 512GB SSD', '14.990.000 ₫')" type="button">
<span class="font-headline-3 text-[13px] text-ink font-semibold">i5 · 16GB · 512GB</span>
<span class="font-label-code text-[11px] text-jade font-medium">Sẵn hàng kho</span>
<span class="font-label-code text-[12px] text-lacquer-red font-bold">14.990.000 ₫</span>
</button>
<!-- Option Chip 2 -->
<button class="config-chip text-left p-2.5 rounded-xl border border-border bg-warm-porcelain hover:border-lacquer-red/60 flex flex-col gap-0.5 transition-all" onclick="selectConfig(this, 'i7 · 16GB · 512GB SSD', '17.490.000 ₫')" type="button">
<span class="font-headline-3 text-[13px] text-ink font-semibold">i7 · 16GB · 512GB</span>
<span class="font-label-code text-[11px] text-ink-muted">+2.500.000 ₫</span>
<span class="font-label-code text-[12px] text-ink font-medium">17.490.000 ₫</span>
</button>
<!-- Out of Stock Chip 3 -->
<button class="text-left p-2.5 rounded-xl border border-border/50 bg-raw-linen/40 opacity-60 cursor-not-allowed flex flex-col gap-0.5 line-through" disabled="" type="button">
<span class="font-headline-3 text-[13px] text-ink-muted">Ryzen 7 · 1TB</span>
<span class="font-label-code text-[11px] text-brick">Tạm hết hàng</span>
<span class="font-label-code text-[12px] text-ink-faint">Liên hệ shop</span>
</button>
</div>
</div>
<!-- Color / Finish Selector -->
<div class="flex flex-col gap-space-xs">
<span class="font-headline-3 text-[14px] text-ink">Màu sắc hoàn thiện:</span>
<div class="flex items-center gap-space-sm">
<button class="color-chip active flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-lacquer-red bg-warm-porcelain text-ink font-body-sm text-[13px] font-medium transition-all" onclick="selectColor(this, 'Bạc Ánh Trăng (Cool Silver)')" type="button">
<span class="w-4 h-4 rounded-full bg-[#D8DDE4] border border-border"></span>
<span>Bạc Ánh Trăng (Cool Silver)</span>
</button>
<button class="color-chip flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:border-lacquer-red/60 bg-warm-porcelain text-ink-muted font-body-sm text-[13px] font-medium transition-all" onclick="selectColor(this, 'Đen Cổ Điển (Indie Black)')" type="button">
<span class="w-4 h-4 rounded-full bg-[#2A2B2E] border border-border"></span>
<span>Đen Cổ Điển (Indie Black)</span>
</button>
</div>
</div>
<!-- Quantity Stepper & Stock Ledger -->
<div class="flex items-center justify-between pt-1">
<div class="flex items-center gap-space-xs">
<span class="font-headline-3 text-[14px] text-ink mr-space-sm">Số lượng:</span>
<div class="flex items-center bg-surface-container-low border border-border rounded-xl h-11 p-1">
<button aria-label="Giảm số lượng" class="w-9 h-9 rounded-lg hover:bg-warm-porcelain text-ink font-bold flex items-center justify-center transition-colors" onclick="adjustQty(-1)" type="button">
<span class="material-symbols-outlined text-[18px]">remove</span>
</button>
<input class="w-12 text-center bg-transparent font-label-code text-body-md font-semibold text-ink focus:outline-none" id="qtyInput" readonly="" type="text" value="1"/>
<button aria-label="Tăng số lượng" class="w-9 h-9 rounded-lg hover:bg-warm-porcelain text-ink font-bold flex items-center justify-center transition-colors" onclick="adjustQty(1)" type="button">
<span class="material-symbols-outlined text-[18px]">add</span>
</button>
</div>
</div>
<div class="text-right">
<span class="font-label-code text-[12px] text-jade font-semibold block">Còn 14 máy</span>
<span class="font-body-sm text-[11px] text-ink-muted block">Hà Nội (8) · TP.HCM (6)</span>
</div>
</div>
<!-- Dual Commerce CTA Buttons -->
<div class="flex flex-col sm:flex-row gap-space-sm pt-2">
<!-- Primary Action -->
<button class="flex-1 h-12 px-space-md rounded-xl bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain font-headline-3 text-[15px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]" id="addToCartBtn" type="button">
<span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
<span>Thêm vào giỏ hàng</span>
</button>
<!-- Secondary Fast-buy -->
<button class="flex-1 h-12 px-space-md rounded-xl bg-transparent hover:bg-lacquer-wash border border-border text-ink font-headline-3 text-[15px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]" type="button">
<span class="material-symbols-outlined text-[20px] text-lacquer-red">bolt</span>
<span>Mua ngay — Giao nhanh 2h</span>
</button>
</div>
<!-- Delivery Reassurance Ribbon -->
<div class="p-space-sm rounded-xl bg-raw-linen/60 border border-border/60 flex items-start gap-space-sm">
<span class="material-symbols-outlined text-jade text-[20px] shrink-0 mt-0.5">local_shipping</span>
<div class="flex flex-col text-ink font-body-sm text-[13px] leading-relaxed">
<span><strong>Dự kiến nhận hàng:</strong> Giao trong 2–4 ngày tại các tỉnh thành (hoặc chọn Giao hỏa tốc 2 giờ tại Hà Nội &amp; TP.HCM).</span>
<span class="text-ink-muted text-[11px] font-label-code pt-0.5">Đóng gói chuẩn Nếp 3 lớp màng khí + thùng carton niêm phong hãng</span>
</div>
</div>
</div>
<!-- Authorized Seal Dossier -->
<div class="px-space-md py-space-sm rounded-xl bg-warm-porcelain/80 border border-border/80 flex items-center justify-between text-ink-muted font-body-sm text-[12px]">
<span class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-jade">verified</span>
            100% hồ sơ giấy phép đại lý ASUS Việt Nam
          </span>
<a class="text-lacquer-red hover:underline font-label-code" href="#">Xem chứng nhận</a>
</div>
</div>
</div>
</section>
<!-- Mid-Page Tab Navigation (Sticky Ledger Bar) -->
<section class="sticky top-20 z-30 w-full bg-warm-porcelain border-y border-border px-gutter">
<div class="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
<div class="flex items-center gap-space-xl font-headline-3 text-[15px] whitespace-nowrap py-3">
<a class="tab-link text-lacquer-red border-b-2 border-lacquer-red pb-3 -mb-3 font-semibold transition-colors" href="#editorial-section">
          Mô tả sản phẩm
        </a>
<a class="tab-link text-ink-muted hover:text-ink pb-3 -mb-3 transition-colors" href="#specs-section">
          Thông số kỹ thuật
        </a>
<a class="tab-link text-ink-muted hover:text-ink pb-3 -mb-3 transition-colors" href="#reviews-section">
          Đánh giá từ người mua (126)
        </a>
<a class="tab-link text-ink-muted hover:text-ink pb-3 -mb-3 transition-colors" href="#related-section">
          Sản phẩm tương tự
        </a>
</div>
<div class="hidden xl:flex items-center gap-space-md py-2">
<span class="font-label-code text-[13px] text-ink font-bold">14.990.000 ₫</span>
<button class="h-9 px-4 rounded-lg bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain font-body-sm text-[13px] font-semibold transition-all" onclick="document.getElementById('addToCartBtn').click()" type="button">
          Mua nhanh
        </button>
</div>
</div>
</section>
<!-- Section 1: Editorial Description (Craft & Utility Focus) -->
<section class="w-full px-gutter py-space-xl bg-warm-porcelain" id="editorial-section">
<div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
<!-- Editorial Text (max 65ch width principle) -->
<div class="lg:col-span-8 flex flex-col gap-space-lg">
<div class="flex flex-col gap-space-sm max-w-[65ch]">
<span class="font-label-micro text-label-micro uppercase tracking-wider text-lacquer-red font-bold">Thiết kế &amp; Trải nghiệm nếp sống</span>
<h2 class="font-headline-1 text-headline-1 text-ink leading-snug">
            Hiệu năng bền bỉ, màn hình OLED rực rỡ cho ngày làm việc êm ả.
          </h2>
<p class="font-body-lg text-body-lg text-ink-muted leading-relaxed">
            Được chế tác cho nhịp làm việc hiện đại đòi hỏi tính tập trung cao độ, ASUS Vivobook 14 OLED M1405VA kết hợp chuẩn mực quang học điện ảnh với khung nhôm hoàn thiện mờ tinh xảo. Từng chi tiết đều hướng đến sự thoải mái, từ bàn phím nâng niu đầu ngón tay cho đến lớp bảo vệ kháng khuẩn bề mặt chuẩn Nhật Bản.
          </p>
</div>
<!-- 3-Column Thoughtful Highlight Ledger -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-sm border-t border-border">
<div class="p-space-md rounded-xl bg-rice-paper/60 border border-border/80 flex flex-col gap-2">
<span class="w-9 h-9 rounded-lg bg-warm-porcelain border border-border flex items-center justify-center text-lacquer-red">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</span>
<h3 class="font-headline-3 text-[16px] text-ink font-semibold">Màn hình OLED 2.8K Eye Care</h3>
<p class="font-body-sm text-body-sm text-ink-muted">
              Đạt chuẩn bảo vệ mắt TÜV Rheinland giảm 70% ánh sáng xanh có hại, giữ đôi mắt thư thái khi biên tập văn bản hoặc xử lý số liệu kéo dài.
            </p>
</div>
<div class="p-space-md rounded-xl bg-rice-paper/60 border border-border/80 flex flex-col gap-2">
<span class="w-9 h-9 rounded-lg bg-warm-porcelain border border-border flex items-center justify-center text-turmeric">
<span class="material-symbols-outlined text-[20px]">memory</span>
</span>
<h3 class="font-headline-3 text-[16px] text-ink font-semibold">Intel Core i5 Thế hệ 13</h3>
<p class="font-body-sm text-body-sm text-ink-muted">
              12 nhân 16 luồng xử lý mượt mà tác vụ kế toán, đồ họa cơ bản và hơn 30 thẻ duyệt web đồng thời mà không tỏa nhiệt gay gắt.
            </p>
</div>
<div class="p-space-md rounded-xl bg-rice-paper/60 border border-border/80 flex flex-col gap-2">
<span class="w-9 h-9 rounded-lg bg-warm-porcelain border border-border flex items-center justify-center text-jade">
<span class="material-symbols-outlined text-[20px]">nature_people</span>
</span>
<h3 class="font-headline-3 text-[16px] text-ink font-semibold">Khung máy gọn nhẹ 1.40 kg</h3>
<p class="font-body-sm text-body-sm text-ink-muted">
              Bản lề mở phẳng 180 độ tiện chia sẻ ý tưởng tại quán cà phê hay bàn trà. Độ mỏng chỉ 17.9 mm nhẹ nhàng trượt vào mọi loại balo nỉ hay túi da.
            </p>
</div>
</div>
<!-- In-depth Craftsmanship Paragraph -->
<div class="p-space-lg rounded-2xl bg-surface-container-low border border-border flex flex-col sm:flex-row gap-space-lg items-center">
<div class="w-full sm:w-1/3 aspect-[4/3] rounded-xl overflow-hidden bg-rice-paper shrink-0 border border-border/60">
<img alt="Công nghệ kháng khuẩn ASUS Antimicrobial Guard" class="w-full h-full object-cover" data-alt="Editorial close-up of the ASUS antibacterial guard coating on silver laptop chassis with soft texture and refined matte finish" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPscW4wGs1TttJ5aDUWfEJMq7ta2mQKk-zmbOKuj2jSI-QzCfcyjDjk6apzyEUFxs3v1vrndNNCwHWtg8ClGIGw7WXj2j-L2qex_Ciwxmx3Ye0xvcJW6qTmfjO4Yt0gMmsNPsR3dawPnTT4j8YsylwP4nRC3xM5zmjRtZ1ZnBDrnbDTdZ8FlTTeVb2KbbZSKP_A1uTV92TebtENlm7O-WOzQMviioF7b82bi7FaA"/>
</div>
<div class="flex flex-col gap-2">
<span class="font-label-code text-[11px] text-lacquer-red font-semibold uppercase tracking-wider">Tiêu chuẩn nếp sạch</span>
<h4 class="font-headline-3 text-[18px] text-ink font-semibold">Lớp phủ kháng khuẩn ASUS Antimicrobial Guard</h4>
<p class="font-body-sm text-body-sm text-ink-muted">
              Bề mặt bàn phím, nút nguồn và chiếu nghỉ tay được xử lý lớp ion bạc đặc biệt ức chế hơn 99% sự sinh sôi của vi khuẩn trong suốt 3 năm, bảo đảm không gian làm việc luôn thanh sạch, tinh khiết.
            </p>
</div>
</div>
</div>
<!-- Quick Inspection Side Box (4 cols) -->
<div class="lg:col-span-4 flex flex-col gap-space-md">
<div class="p-space-lg rounded-2xl bg-rice-paper border border-border flex flex-col gap-space-md">
<h3 class="font-headline-3 text-[16px] text-ink font-semibold flex items-center gap-2">
<span class="material-symbols-outlined text-lacquer-red text-[20px]">fact_check</span>
            Bộ quà tặng chính hãng kèm máy
          </h3>
<ul class="flex flex-col gap-space-sm font-body-sm text-[13px] text-ink">
<li class="flex items-center gap-2">
<span class="material-symbols-outlined text-jade text-[18px]">check_circle</span>
<span>Balo chống sốc ASUS ROG / Vivobook chính hãng (trị giá 450.000 ₫)</span>
</li>
<li class="flex items-center gap-2">
<span class="material-symbols-outlined text-jade text-[18px]">check_circle</span>
<span>Chuột quang không dây công thái học</span>
</li>
<li class="flex items-center gap-2">
<span class="material-symbols-outlined text-jade text-[18px]">check_circle</span>
<span>Bộ sạc nhanh ASUS 65W chân Type-C nhỏ gọn</span>
</li>
<li class="flex items-center gap-2">
<span class="material-symbols-outlined text-jade text-[18px]">check_circle</span>
<span>Gói bản quyền Windows 11 Home SL vĩnh viễn theo máy</span>
</li>
</ul>
<div class="pt-space-sm border-t border-border/80 flex flex-col gap-1 font-label-code text-[12px] text-ink-muted">
<span class="text-ink font-semibold">Hỗ trợ kỹ thuật ShopNest:</span>
<span>Cài đặt phần mềm miễn phí trọn đời qua Ultraviewer</span>
<span>Hỗ trợ vệ sinh, tra keo tản nhiệt miễn phí tại trung tâm ủy quyền</span>
</div>
</div>
<div class="p-space-md rounded-2xl bg-warm-porcelain border border-border flex items-center gap-space-md">
<span class="w-12 h-12 rounded-xl bg-raw-linen flex items-center justify-center text-lacquer-red shrink-0">
<span class="material-symbols-outlined text-[26px]">headset_mic</span>
</span>
<div class="flex flex-col">
<span class="font-headline-3 text-[14px] text-ink font-semibold">Bạn cần tư vấn thêm cấu hình?</span>
<span class="font-body-sm text-[12px] text-ink-muted">Chuyên viên TechNest trực máy 8:00 - 22:00</span>
<a class="font-label-code text-[12px] text-lacquer-red font-semibold hover:underline pt-0.5" href="#">Gọi tư vấn miễn phí: 1800 6868</a>
</div>
</div>
</div>
</div>
</section>
<!-- Section 2: Technical Ledger (Bảng thông số kỹ thuật - Clean Ledger, No Card Soup) -->
<section class="w-full px-gutter py-space-xl bg-rice-paper" id="specs-section">
<div class="max-w-7xl mx-auto flex flex-col gap-space-lg">
<div class="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm pb-space-sm border-b border-border">
<div>
<span class="font-label-micro text-label-micro uppercase tracking-wider text-lacquer-red font-bold">Hồ sơ kỹ thuật chi tiết</span>
<h2 class="font-headline-2 text-headline-2 text-ink">Thông số kỹ thuật chuẩn hóa</h2>
</div>
<span class="font-label-code text-body-sm text-ink-muted">
          Mã sản phẩm: ASUS-M1405VA-KM047W
        </span>
</div>
<!-- Ledger Table (Strict 1px Horizontal Dividers, JetBrains Mono Right-aligned values) -->
<div class="w-full bg-warm-porcelain rounded-2xl border border-border overflow-hidden">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-high/60 border-b border-border font-label-micro text-[11px] text-ink-muted uppercase tracking-wider">
<th class="py-3.5 px-space-lg w-1/3" scope="col">Thành phần phần cứng</th>
<th class="py-3.5 px-space-lg w-2/3" scope="col">Chi tiết kỹ thuật chính hãng</th>
</tr>
</thead>
<tbody class="divide-y divide-border font-body-sm text-body-sm text-ink">
<tr class="hover:bg-rice-paper/40 transition-colors">
<td class="py-3.5 px-space-lg font-medium text-ink-muted flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-faint">memory</span>
                Bộ vi xử lý (CPU)
              </td>
<td class="py-3.5 px-space-lg font-label-code text-[14px] text-ink font-semibold">
                Intel® Core™ i5-13500H (12 nhân, 16 luồng, bộ nhớ đệm 18MB, Turbo Boost 4.70 GHz)
              </td>
</tr>
<tr class="hover:bg-rice-paper/40 transition-colors">
<td class="py-3.5 px-space-lg font-medium text-ink-muted flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-faint">storage</span>
                Bộ nhớ RAM
              </td>
<td class="py-3.5 px-space-lg font-label-code text-[14px]">
                16GB DDR4 3200MHz (8GB Onboard + 8GB SO-DIMM, hỗ trợ nâng cấp tối đa 24GB)
              </td>
</tr>
<tr class="hover:bg-rice-paper/40 transition-colors">
<td class="py-3.5 px-space-lg font-medium text-ink-muted flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-faint">hard_drive</span>
                Ổ cứng lưu trữ
              </td>
<td class="py-3.5 px-space-lg font-label-code text-[14px]">
                512GB M.2 NVMe™ PCIe® 4.0 SSD (Tốc độ đọc lên tới 3500 MB/s)
              </td>
</tr>
<tr class="hover:bg-rice-paper/40 transition-colors">
<td class="py-3.5 px-space-lg font-medium text-ink-muted flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-faint">desktop_windows</span>
                Màn hình hiển thị
              </td>
<td class="py-3.5 px-space-lg font-label-code text-[14px]">
                14.0 inch 2.8K (2880 x 1800) OLED tỷ lệ 16:10, 90Hz, 100% DCI-P3, 600 nits đỉnh HDR, PANTONE® Validated
              </td>
</tr>
<tr class="hover:bg-rice-paper/40 transition-colors">
<td class="py-3.5 px-space-lg font-medium text-ink-muted flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-faint">videocam</span>
                Đồ họa (GPU)
              </td>
<td class="py-3.5 px-space-lg font-label-code text-[14px]">
                Intel® Iris® Xᵉ Graphics tích hợp
              </td>
</tr>
<tr class="hover:bg-rice-paper/40 transition-colors">
<td class="py-3.5 px-space-lg font-medium text-ink-muted flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-faint">scale</span>
                Trọng lượng &amp; Kích thước
              </td>
<td class="py-3.5 px-space-lg font-label-code text-[14px]">
                1.40 kg · Kích thước 31.71 x 22.20 x 1.79 cm (Vỏ nhôm bề mặt nắp máy)
              </td>
</tr>
<tr class="hover:bg-rice-paper/40 transition-colors">
<td class="py-3.5 px-space-lg font-medium text-ink-muted flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-faint">cable</span>
                Cổng kết nối vật lý
              </td>
<td class="py-3.5 px-space-lg font-body-sm text-[13px] text-ink">
                1x USB-C 3.2 Gen 1 (Hỗ trợ cấp nguồn Power Delivery), 2x USB 3.2 Gen 1 Type-A, 1x USB 2.0 Type-A, 1x HDMI 1.4, Giắc âm thanh 3.5mm combo
              </td>
</tr>
<tr class="hover:bg-rice-paper/40 transition-colors">
<td class="py-3.5 px-space-lg font-medium text-ink-muted flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-faint">battery_charging_full</span>
                Pin &amp; Nguồn sạc
              </td>
<td class="py-3.5 px-space-lg font-label-code text-[14px]">
                3-cell Li-ion 50WHrs · Củ sạc 65W AC Adapter đi kèm
              </td>
</tr>
<tr class="hover:bg-rice-paper/40 transition-colors">
<td class="py-3.5 px-space-lg font-medium text-ink-muted flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-faint">gavel</span>
                Chính sách bảo hành
              </td>
<td class="py-3.5 px-space-lg text-ink">
<span class="font-headline-3 text-[14px] text-jade font-semibold">24 tháng chính hãng</span> (Bảo hành tận nơi của ASUS Việt Nam toàn quốc)
              </td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
<!-- Section 3: Customer Reviews (Đánh giá từ người mua thực tế) -->
<section class="w-full px-gutter py-space-xl bg-warm-porcelain" id="reviews-section">
<div class="max-w-7xl mx-auto flex flex-col gap-space-lg">
<div class="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm pb-space-sm border-b border-border">
<div>
<span class="font-label-micro text-label-micro uppercase tracking-wider text-lacquer-red font-bold">Trải nghiệm minh bạch</span>
<h2 class="font-headline-2 text-headline-2 text-ink">Đánh giá từ người mua thực tế (126)</h2>
</div>
<span class="font-body-sm text-[13px] text-ink-muted">Chỉ khách hàng đã nhận máy và xác thực đơn thành công mới được viết đánh giá</span>
</div>
<!-- Rating Summary & Breakdown Grid -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center p-space-lg rounded-2xl bg-rice-paper/80 border border-border">
<!-- Big Number Column -->
<div class="md:col-span-4 flex flex-col items-center justify-center sm:border-r border-border/80 pr-0 md:pr-space-lg text-center">
<span class="font-label-code text-[56px] leading-none font-bold text-ink">4.8</span>
<div class="flex items-center text-turmeric gap-1 my-2">
<span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">star_half</span>
</div>
<span class="font-body-sm text-[13px] text-ink-muted">98% khách hàng hài lòng về màn hình và dịch vụ giao máy</span>
</div>
<!-- Progress Bars Column -->
<div class="md:col-span-8 flex flex-col gap-2">
<!-- 5 star -->
<div class="flex items-center gap-space-sm font-label-code text-[12px] text-ink">
<span class="w-10">5 sao</span>
<div class="flex-1 h-2 rounded-full bg-raw-linen overflow-hidden">
<div class="h-full bg-turmeric rounded-full" style="width: 88%"></div>
</div>
<span class="w-12 text-right text-ink-muted">88% (110)</span>
</div>
<!-- 4 star -->
<div class="flex items-center gap-space-sm font-label-code text-[12px] text-ink">
<span class="w-10">4 sao</span>
<div class="flex-1 h-2 rounded-full bg-raw-linen overflow-hidden">
<div class="h-full bg-turmeric/80 rounded-full" style="width: 10%"></div>
</div>
<span class="w-12 text-right text-ink-muted">10% (14)</span>
</div>
<!-- 3 star -->
<div class="flex items-center gap-space-sm font-label-code text-[12px] text-ink">
<span class="w-10">3 sao</span>
<div class="flex-1 h-2 rounded-full bg-raw-linen overflow-hidden">
<div class="h-full bg-turmeric/50 rounded-full" style="width: 2%"></div>
</div>
<span class="w-12 text-right text-ink-muted">2% (2)</span>
</div>
<!-- 2 star -->
<div class="flex items-center gap-space-sm font-label-code text-[12px] text-ink">
<span class="w-10">2 sao</span>
<div class="flex-1 h-2 rounded-full bg-raw-linen overflow-hidden">
<div class="h-full bg-turmeric/30 rounded-full" style="width: 0%"></div>
</div>
<span class="w-12 text-right text-ink-muted">0% (0)</span>
</div>
<!-- 1 star -->
<div class="flex items-center gap-space-sm font-label-code text-[12px] text-ink">
<span class="w-10">1 sao</span>
<div class="flex-1 h-2 rounded-full bg-raw-linen overflow-hidden">
<div class="h-full bg-turmeric/30 rounded-full" style="width: 0%"></div>
</div>
<span class="w-12 text-right text-ink-muted">0% (0)</span>
</div>
</div>
</div>
<!-- Filter Chips -->
<div class="flex flex-wrap items-center gap-space-xs">
<button class="px-4 py-2 rounded-xl bg-lacquer-red text-warm-porcelain font-body-sm text-[13px] font-medium" type="button">Tất cả (126)</button>
<button class="px-4 py-2 rounded-xl bg-warm-porcelain border border-border text-ink hover:bg-lacquer-wash font-body-sm text-[13px] transition-colors" type="button">Có hình ảnh &amp; video (42)</button>
<button class="px-4 py-2 rounded-xl bg-warm-porcelain border border-border text-ink hover:bg-lacquer-wash font-body-sm text-[13px] transition-colors" type="button">5 sao (110)</button>
<button class="px-4 py-2 rounded-xl bg-warm-porcelain border border-border text-ink hover:bg-lacquer-wash font-body-sm text-[13px] transition-colors" type="button">4 sao (14)</button>
</div>
<!-- Authentic Vietnamese Review Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
<!-- Review 1 -->
<article class="p-space-lg rounded-2xl bg-warm-porcelain border border-border flex flex-col justify-between gap-space-md">
<div class="flex flex-col gap-space-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="w-8 h-8 rounded-full bg-raw-linen flex items-center justify-center font-headline-3 text-[13px] font-bold text-ink">
                  N
                </div>
<div>
<h4 class="font-headline-3 text-[14px] text-ink font-semibold">Nguyễn Hoàng Nam</h4>
<span class="font-label-code text-[11px] text-jade">Đã mua bản i5 16GB</span>
</div>
</div>
<span class="font-label-code text-[11px] text-ink-faint">2 ngày trước</span>
</div>
<div class="flex items-center text-turmeric gap-0.5">
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<p class="font-body-sm text-body-sm text-ink leading-relaxed">
              “Máy nhẹ, màn hình OLED xem phim hay làm bảng tính đều cực kỳ nét và dịu mắt. Giao hàng cẩn thận, bọc chống sốc 3 lớp dày dặn. Bản i5 xử lý Excel nặng không hề bị giật lag.”
            </p>
</div>
<div class="pt-space-xs border-t border-border/60 flex items-center gap-1.5 font-label-code text-[11px] text-ink-muted">
<span class="material-symbols-outlined text-[14px] text-jade">verified</span>
<span>Đã kiểm tra chứng từ mua qua TechNest</span>
</div>
</article>
<!-- Review 2 -->
<article class="p-space-lg rounded-2xl bg-warm-porcelain border border-border flex flex-col justify-between gap-space-md">
<div class="flex flex-col gap-space-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="w-8 h-8 rounded-full bg-raw-linen flex items-center justify-center font-headline-3 text-[13px] font-bold text-ink">
                  L
                </div>
<div>
<h4 class="font-headline-3 text-[14px] text-ink font-semibold">Trần Thị Mai Lan</h4>
<span class="font-label-code text-[11px] text-jade">Đã mua bản i5 16GB</span>
</div>
</div>
<span class="font-label-code text-[11px] text-ink-faint">5 ngày trước</span>
</div>
<div class="flex items-center text-turmeric gap-0.5">
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<p class="font-body-sm text-body-sm text-ink leading-relaxed">
              “Bàn phím gõ êm, độ nảy tốt. Nhân viên TechNest tư vấn cài đặt phần mềm nhiệt tình. Đáng tiền trong tầm giá 15 triệu cho một chiếc máy mỏng nhẹ văn phòng chuẩn mực.”
            </p>
</div>
<div class="pt-space-xs border-t border-border/60 flex items-center gap-1.5 font-label-code text-[11px] text-ink-muted">
<span class="material-symbols-outlined text-[14px] text-jade">verified</span>
<span>Đã kiểm tra chứng từ mua qua TechNest</span>
</div>
</article>
<!-- Review 3 -->
<article class="p-space-lg rounded-2xl bg-warm-porcelain border border-border flex flex-col justify-between gap-space-md">
<div class="flex flex-col gap-space-sm">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="w-8 h-8 rounded-full bg-raw-linen flex items-center justify-center font-headline-3 text-[13px] font-bold text-ink">
                  B
                </div>
<div>
<h4 class="font-headline-3 text-[14px] text-ink font-semibold">Lê Quốc Bảo</h4>
<span class="font-label-code text-[11px] text-jade">Đã mua bản i7</span>
</div>
</div>
<span class="font-label-code text-[11px] text-ink-faint">1 tuần trước</span>
</div>
<div class="flex items-center text-turmeric gap-0.5">
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<p class="font-body-sm text-body-sm text-ink leading-relaxed">
              “Thiết kế thanh lịch, màu bạc sáng đẹp. Pin dùng tác vụ văn phòng được tầm 6-7 tiếng liên tục. Màn hình 90Hz cuộn tài liệu cảm giác mượt mà hơn hẳn dòng máy cũ.”
            </p>
</div>
<div class="pt-space-xs border-t border-border/60 flex items-center gap-1.5 font-label-code text-[11px] text-ink-muted">
<span class="material-symbols-outlined text-[14px] text-jade">verified</span>
<span>Đã kiểm tra chứng từ mua qua TechNest</span>
</div>
</article>
</div>
<div class="flex justify-center pt-space-sm">
<a class="inline-flex items-center gap-1.5 font-headline-3 text-[15px] text-lacquer-red hover:text-lacquer-deep underline underline-offset-4 decoration-1 font-semibold transition-colors" href="#">
          Xem tất cả 126 đánh giá chi tiết
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
</section>
<!-- Section 4: Related Products (4-up Shelf: Laptops & Modern Office Hardware) -->
<section class="w-full px-gutter py-space-xl bg-rice-paper" id="related-section">
<div class="max-w-7xl mx-auto flex flex-col gap-space-lg">
<div class="flex items-center justify-between pb-space-sm border-b border-border">
<div>
<span class="font-label-micro text-label-micro uppercase tracking-wider text-lacquer-red font-bold">Cùng phân khúc tuyển chọn</span>
<h2 class="font-headline-2 text-headline-2 text-ink">Thiết bị máy tính &amp; Phụ kiện đồng hành</h2>
</div>
<a class="hidden sm:inline-flex items-center gap-1 font-body-sm text-[14px] text-ink-muted hover:text-lacquer-red transition-colors" href="#">
          Xem toàn bộ danh mục
          <span class="material-symbols-outlined text-[16px]">chevron_right</span>
</a>
</div>
<!-- 4-Up Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
<!-- Product 1 -->
<div class="group bg-warm-porcelain rounded-[20px] border border-border p-space-sm flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low mb-space-sm">
<img alt="Laptop Dell Inspiron 14 5430" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Dell Inspiron 14 5430 silver metal laptop on a modern minimal wooden table, high resolution studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClZaQZxXZB7dOo_50xNc3QSyTiY7QlteJHfgqLI-QxSCxBBPSbwxkVuh6jqsKrCnQ6-5_NFrgz15aDOByWi-EXr4eJJog9ZzFOZcWMBOkUAi-H64DESz9JReR6eU8WUQfzU8eCbs4xesXGlPSdaFyWo4B-Nv3hJY1980YZPiMb5NgYqBwJ306dsxNefcPz--m_IHOdpLXBuEFPb3_ae7zyFFT4nlQBTW82uYz6FQ"/>
<span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-warm-porcelain/90 font-label-code text-[11px] text-ink-muted border border-border/40">Laptop24h</span>
</div>
<div class="flex flex-col gap-1">
<span class="font-label-micro text-[11px] uppercase tracking-wider text-ink-muted">Dell Official</span>
<h3 class="font-headline-3 text-[15px] text-ink group-hover:underline line-clamp-2">
              Laptop Dell Inspiron 14 5430 (i5-1335U · 16GB)
            </h3>
<div class="flex items-baseline justify-between pt-1">
<span class="font-label-code text-[16px] font-bold text-lacquer-red">16.490.000 ₫</span>
<span class="font-label-code text-[11px] text-jade">Sẵn hàng</span>
</div>
</div>
</div>
<!-- Product 2 -->
<div class="group bg-warm-porcelain rounded-[20px] border border-border p-space-sm flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low mb-space-sm">
<img alt="Laptop Lenovo IdeaPad Slim 5" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Lenovo IdeaPad Slim 5 14IAH8 slim notebook shown closed and angled on architectural concrete desk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDno8m7-9iZfjIRnv2Qd-kPYyUTg9TYsCr_K5BUtgN-aRZDCP9OZF-jF2qCOUf2uKYhTL_AH3q16rN5OOEOCCaz_8ZN4VnNwFrom2K9qYI4lgCY2lAXFxOsznYIWLV7b3Hcgy89iB3sIFFSHLeRCUBe2vhV_Qznngl4jCtHkpOX9baBmnv8zo3UueDVxENyAWgCHkNYaPVZZeBCwimOI3yFPRTA_OIkzIsOhXJzew"/>
<span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-warm-porcelain/90 font-label-code text-[11px] text-ink-muted border border-border/40">Máy Tính Việt</span>
</div>
<div class="flex flex-col gap-1">
<span class="font-label-micro text-[11px] uppercase tracking-wider text-ink-muted">Lenovo Việt Nam</span>
<h3 class="font-headline-3 text-[15px] text-ink group-hover:underline line-clamp-2">
              Laptop Lenovo IdeaPad Slim 5 14IAH8 (i5-12450H)
            </h3>
<div class="flex items-baseline justify-between pt-1">
<span class="font-label-code text-[16px] font-bold text-lacquer-red">15.290.000 ₫</span>
<span class="font-label-code text-[11px] text-jade">Sẵn hàng</span>
</div>
</div>
</div>
<!-- Product 3 -->
<div class="group bg-warm-porcelain rounded-[20px] border border-border p-space-sm flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low mb-space-sm">
<img alt="Apple MacBook Air M2" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Apple MacBook Air 13.6 inch M2 in midnight finish on a serene Japanese washi paper studio background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8pyzrmRf3nQu9Jq7z9Ytz8YojmEQn0ObJ3bTVAG9t_VPKvCum7iZ1eIZqNM0SPzbRbnh_rueWhob1IgxVRI1_vnIzmnoeum0HYpOQWpj7Zvmc5Eq7dvY8W4y1yHxZ9wrf_okonNXeAtOS_AoGR_dNZ882PKIqhED700rQsav0ToJ7bQQs_G-VE74RKYkCX59mIjFU7yhW9GwvZTaSaaGQpeRcUn8b2hYxCSPGpg"/>
<span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-warm-porcelain/90 font-label-code text-[11px] text-ink-muted border border-border/40">TechNest Official</span>
</div>
<div class="flex flex-col gap-1">
<span class="font-label-micro text-[11px] uppercase tracking-wider text-ink-muted">Apple VN (AAR)</span>
<h3 class="font-headline-3 text-[15px] text-ink group-hover:underline line-clamp-2">
              Apple MacBook Air 13.6 inch M2 (8GB / 256GB SSD)
            </h3>
<div class="flex items-baseline justify-between pt-1">
<span class="font-label-code text-[16px] font-bold text-lacquer-red">22.990.000 ₫</span>
<span class="font-label-code text-[11px] text-turmeric">Kho TP.HCM</span>
</div>
</div>
</div>
<!-- Product 4 -->
<div class="group bg-warm-porcelain rounded-[20px] border border-border p-space-sm flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
<div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low mb-space-sm">
<img alt="Chuột không dây ASUS SmartO MD200" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Ergonomic ASUS SmartO MD200 wireless mouse resting beside fine ceramic coffee cup on linen desk mat" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSycjvXgODQzDU2Tb7r0GE79XpskwDYAcRoC-WBCnP7rMoJ4WdW4lPor5hRp1RjKfyWTQ-svgcgB4HcdQPUHf_x1OZQVuaPTnt2CyB1E6pgo2dVxgyEGO9EJ8TH5MlcCSmq3ToCjJUhS8r-Qc6k3cDr2tLtohWSpzONn1F2KmEbP_u3YudfSl-kvcaMsK_zCE23uycFTtJ2JKwf5AzugT0-cVTu7QY816_IpupFg"/>
<span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-warm-porcelain/90 font-label-code text-[11px] text-ink-muted border border-border/40">TechNest Official</span>
</div>
<div class="flex flex-col gap-1">
<span class="font-label-micro text-[11px] uppercase tracking-wider text-ink-muted">Phụ kiện công thái học</span>
<h3 class="font-headline-3 text-[15px] text-ink group-hover:underline line-clamp-2">
              Chuột không dây ASUS SmartO MD200 (Kháng khuẩn)
            </h3>
<div class="flex items-baseline justify-between pt-1">
<span class="font-label-code text-[16px] font-bold text-lacquer-red">790.000 ₫</span>
<span class="font-label-code text-[11px] text-jade">Sẵn hàng</span>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Interactive Add-To-Cart Notification Simulation (Toast) -->
<div class="fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 pointer-events-none transition-all duration-300 ease-out max-w-md w-[calc(100vw-3rem)]" id="cartToast">
<div class="p-space-md rounded-2xl bg-warm-porcelain border border-border shadow-xl flex items-center justify-between gap-space-md">
<div class="flex items-center gap-space-sm">
<span class="w-10 h-10 rounded-xl bg-jade/10 text-jade flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[22px]">check</span>
</span>
<div class="flex flex-col">
<span class="font-headline-3 text-[14px] text-ink font-semibold">Đã thêm vào giỏ hàng!</span>
<span class="font-body-sm text-[12px] text-ink-muted truncate max-w-[200px]">1x Laptop ASUS Vivobook 14 OLED</span>
</div>
</div>
<div class="flex items-center gap-2">
<a class="h-9 px-3.5 rounded-lg bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain font-headline-3 text-[13px] font-semibold flex items-center gap-1 transition-colors whitespace-nowrap" href="#">
<span>Xem giỏ (1)</span>
</a>
<button aria-label="Đóng thông báo" class="w-8 h-8 rounded-lg hover:bg-rice-paper text-ink-muted flex items-center justify-center transition-colors" onclick="hideToast()" type="button">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
</div>
</div>
</div>
<script>
  // Image gallery selection logic
  function selectThumb(index) {
    const thumbs = document.querySelectorAll('.thumb-btn');
    thumbs.forEach((t, i) => {
      if (i === index) {
        t.classList.remove('border-border');
        t.classList.add('border-lacquer-red', 'border-2');
      } else {
        t.classList.remove('border-lacquer-red', 'border-2');
        t.classList.add('border-border');
      }
    });
  }

  // Variant selector chip logic
  function selectConfig(btn, name, price) {
    document.querySelectorAll('.config-chip').forEach(el => {
      el.classList.remove('border-2', 'border-lacquer-red', 'bg-lacquer-wash/20');
      el.classList.add('border', 'border-border', 'bg-warm-porcelain');
    });
    btn.classList.remove('border', 'border-border', 'bg-warm-porcelain');
    btn.classList.add('border-2', 'border-lacquer-red', 'bg-lacquer-wash/20');
    
    document.getElementById('selectedConfigName').textContent = name;
  }

  // Color selection logic
  function selectColor(btn, colorName) {
    document.querySelectorAll('.color-chip').forEach(el => {
      el.classList.remove('border-2', 'border-lacquer-red');
      el.classList.add('border', 'border-border', 'text-ink-muted');
    });
    btn.classList.remove('border', 'border-border', 'text-ink-muted');
    btn.classList.add('border-2', 'border-lacquer-red', 'text-ink');
  }

  // Quantity stepper
  function adjustQty(delta) {
    const input = document.getElementById('qtyInput');
    let val = parseInt(input.value, 10) || 1;
    val = Math.max(1, Math.min(14, val + delta));
    input.value = val;
  }

  // Toast simulation
  let toastTimer = null;
  const toast = document.getElementById('cartToast');
  
  function showToast() {
    clearTimeout(toastTimer);
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
    toastTimer = setTimeout(() => {
      hideToast();
    }, 4500);
  }

  function hideToast() {
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
  }

  document.getElementById('addToCartBtn').addEventListener('click', showToast);
</script></main><footer class="w-full bg-rice-paper pt-margin pb-space-xl text-ink"><div class="w-full px-gutter max-w-7xl mx-auto"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl pb-margin"><div class="space-y-space-md"><div class="flex items-center gap-space-xs"><img alt="ShopnestLogo.png" class="h-6 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><span class="font-headline-3 text-headline-3 text-ink">ShopNest</span></div><p class="font-headline-2 text-[20px] italic text-ink-muted leading-relaxed">Nếp sống tinh tế trong từng lựa chọn tiêu dùng thường nhật.</p><p class="font-body-sm text-body-sm text-ink-muted">Sàn thương mại điện tử tuyển chọn các thương hiệu Việt chuẩn mực và thiết bị gia dụng tinh hoa.</p></div><div class="space-y-space-md"><h4 class="font-label-micro text-label-micro uppercase tracking-wider text-ink">Dịch vụ &amp; Tiêu chuẩn</h4><ul class="space-y-space-sm font-body-sm text-body-sm text-ink-muted"><li><a class="hover:text-lacquer-red transition-colors" href="#">Tiêu chuẩn kiểm định Nếp</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Giao hàng hỏa tốc nội đô</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Chính sách đổi trả 30 ngày</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Bảo hành chính hãng</a></li></ul></div><div class="space-y-space-md"><h4 class="font-label-micro text-label-micro uppercase tracking-wider text-ink">Dành cho đối tác</h4><ul class="space-y-space-sm font-body-sm text-body-sm text-ink-muted"><li><a class="hover:text-lacquer-red transition-colors" href="#">Mở gian hàng Shop Việt</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Quy chuẩn nhà sản xuất thủ công</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Cổng kết nối tiếp thị liên kết</a></li><li><a class="hover:text-lacquer-red transition-colors" href="#">Trung tâm quản trị nhà bán lẻ</a></li></ul></div><div class="space-y-space-md"><h4 class="font-label-micro text-label-micro uppercase tracking-wider text-ink">Bản tin Nếp sống</h4><p class="font-body-sm text-body-sm text-ink-muted">Đăng ký nhận bài viết văn hóa tiêu dùng và danh sách ưu đãi tuyển chọn hàng tuần.</p><div class="flex items-center gap-space-xs"><input class="h-10 px-space-md rounded bg-warm-porcelain font-body-sm text-body-sm text-ink placeholder:text-ink-faint flex-1 focus:outline-none" placeholder="Email của bạn..." type="email"/><button class="h-10 px-space-md rounded bg-primary text-on-primary font-body-sm text-body-sm hover:bg-lacquer-deep transition-colors" type="button">Gửi</button></div></div></div><div class="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-ink-muted"><p>© 2025 ShopNest. Sàn TMĐT Tuyển Chọn Nếp Sống Việt. Mọi quyền được bảo lưu.</p><div class="flex items-center gap-space-lg font-label-code text-label-code"><span>Chính sách bảo mật</span><span>Điều khoản dịch vụ</span><span>Chứng nhận Bộ Công Thương</span></div></div></div></footer></body></html>
```
### S04 - Giỏ hàng
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{colors:{"error":"#ba1a1a","lacquer-wash":"#F2DCD5","outline-variant":"#dfbfbb","tertiary-fixed-dim":"#cec6b5","outline":"#8c716d","lacquer-deep":"#8C2A22","ink-faint":"#9A8F7F","warm-porcelain":"#FFFCF4","inverse-surface":"#323029","on-tertiary-fixed-variant":"#4b463a","ink":"#1D1B17","surface-tint":"#aa342a","on-secondary-fixed":"#1d1b17","on-error-container":"#93000a","surface-dim":"#dedacf","secondary-fixed":"#e8e2db","on-tertiary-container":"#e9e0cf","inverse-on-surface":"#f5f0e5","surface-bright":"#fef9ee","tertiary-container":"#696356","primary-fixed":"#ffdad5","secondary-fixed-dim":"#cbc6bf","surface-container-highest":"#e7e2d7","primary":"#91221a","logo-blue":"#4991D8","tertiary":"#514b3f","lacquer-red":"#B23A2F","rice-paper":"#F6F1E6","surface":"#fef9ee","on-secondary-container":"#67645f","brick":"#8B2A24","on-secondary":"#ffffff","on-tertiary":"#ffffff","surface-container":"#f2ede2","turmeric":"#8A5A1A","jade":"#2F6B57","on-secondary-fixed-variant":"#494641","background":"#fef9ee","error-container":"#ffdad6","surface-container-high":"#ede8dd","on-primary-fixed-variant":"#891c16","surface-variant":"#e7e2d7","on-tertiary-fixed":"#1f1b11","on-primary-fixed":"#410001","secondary-container":"#e8e2db","border":"#DCD1BE","primary-container":"#b23a2f","on-primary":"#ffffff","on-surface-variant":"#58413e","tertiary-fixed":"#eae2d1","inverse-primary":"#ffb4aa","surface-container-lowest":"#ffffff","raw-linen":"#EDE4D3","on-surface":"#1d1c15","secondary":"#615e59","ink-muted":"#6B6458","on-error":"#ffffff","primary-fixed-dim":"#ffb4aa","on-background":"#1d1c15","on-primary-container":"#ffd9d3","surface-container-low":"#f8f3e8"},borderRadius:{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},spacing:{"space-xl":"2.5rem","margin":"3rem","gutter-mobile":"1rem","space-lg":"1.5rem","space-xs":"0.25rem","space-md":"1rem","margin-mobile":"1.25rem","gutter":"1.5rem","space-sm":"0.5rem"},fontFamily:{"body-md":["Be Vietnam Pro"],"body-sm":["Be Vietnam Pro"],"display-lg-mobile":["Newsreader"],"label-micro":["Be Vietnam Pro"],"display-xl-mobile":["Newsreader"],"headline-1":["Newsreader"],"headline-2":["Newsreader"],"headline-3":["Be Vietnam Pro"],"display-xl":["Newsreader"],"label-code":["JetBrains Mono"],"body-lg":["Be Vietnam Pro"],"display-lg":["Newsreader"]},fontSize:{"body-md":["16px",{"lineHeight":"26px","fontWeight":"400"}],"body-sm":["14px",{"lineHeight":"21px","fontWeight":"400"}],"display-lg-mobile":["32px",{"lineHeight":"34px","letterSpacing":"-0.025em","fontWeight":"600"}],"label-micro":["12px",{"lineHeight":"16px","letterSpacing":"0.12em","fontWeight":"600"}],"display-xl-mobile":["40px",{"lineHeight":"40px","letterSpacing":"-0.03em","fontWeight":"600"}],"headline-1":["36px",{"lineHeight":"40px","letterSpacing":"-0.025em","fontWeight":"600"}],"headline-2":["28px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"600"}],"headline-3":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}],"display-xl":["64px",{"lineHeight":"60px","letterSpacing":"-0.035em","fontWeight":"600"}],"label-code":["14px",{"lineHeight":"20px","fontWeight":"500"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"display-lg":["48px",{"lineHeight":"48px","letterSpacing":"-0.03em","fontWeight":"600"}]}}}};</script></head><body class="bg-rice-paper font-body-md text-on-surface antialiased"><header class="fixed top-0 left-0 w-full z-50 bg-rice-paper/95 backdrop-blur-md border-b border-border"><div class="h-20 w-full px-gutter flex items-center justify-between gap-gutter"><div class="flex items-center gap-space-lg flex-shrink-0"><a class="flex items-center gap-space-sm" data-path="trang-chu" href="#"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><span class="font-headline-2 text-headline-2 tracking-tight text-ink">ShopNest</span></a><nav class="hidden xl:flex items-center gap-space-md" data-active-classes="text-lacquer-red font-semibold"><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="danh-muc" href="#">Danh mục</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="khuyen-mai" href="#">Khuyến mãi</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="shop-viet" href="#">Shop Việt</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="don-hang" href="#">Đơn hàng</a></nav></div><div class="flex-1 max-w-xl hidden md:block"><div class="relative flex items-center"><input class="w-full h-11 pl-space-md pr-12 rounded-lg bg-warm-porcelain border border-border text-body-sm font-body-sm text-ink placeholder-ink-faint focus:outline-none focus:border-lacquer-red transition-colors" placeholder="Tìm kiếm đồ gốm, lụa là, đồ thủ công mỹ nghệ..." type="text"/><button class="absolute right-space-sm h-8 w-8 flex items-center justify-center text-ink-muted hover:text-lacquer-red" type="button"><span class="material-symbols-outlined text-[20px]">search</span></button></div></div><div class="flex items-center gap-space-md flex-shrink-0"><div class="hidden sm:flex items-center gap-space-xs text-ink-muted hover:text-ink cursor-pointer px-space-xs py-1 rounded"><span class="material-symbols-outlined text-[18px]">language</span><span class="font-label-code text-label-code text-ink">VI / VND</span></div><a class="relative p-space-xs text-on-surface-variant hover:text-lacquer-red transition-colors flex items-center" data-path="gio-hang" href="#"><span class="material-symbols-outlined text-[24px]">shopping_bag</span><span class="absolute -top-1 -right-1 bg-lacquer-red text-warm-porcelain font-label-code text-[11px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">3</span></a><div class="h-5 w-px bg-border hidden sm:block"></div><a class="flex items-center gap-space-xs pl-space-xs" data-path="tai-khoan" href="#"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><span class="hidden lg:inline font-body-sm text-body-sm text-ink font-medium">Tài khoản</span></a></div></div></header><main class="w-full pt-20 bg-rice-paper min-h-screen"><div class="flex flex-col w-full">
<!-- Interactive State Controller (Simulation Panel) -->
<aside aria-label="Bộ chuyển đổi kịch bản kiểm thử" class="w-full bg-raw-linen border-b border-border py-2.5 px-gutter">
<div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-body-sm font-body-sm">
<div class="flex items-center gap-space-xs text-ink-muted">
<span class="material-symbols-outlined text-[18px] text-turmeric">tune</span>
<span class="font-label-micro uppercase tracking-wider text-ink">Mô phỏng trạng thái giỏ:</span>
</div>
<div aria-label="Chọn kịch bản giỏ hàng" class="flex flex-wrap items-center gap-1.5" role="group">
<button class="px-3 py-1 rounded bg-warm-porcelain text-lacquer-red font-semibold border border-lacquer-red text-xs transition-colors" id="btn-state-default" onclick="setCartState('default')" type="button">
          Mặc định (3 món)
        </button>
<button class="px-3 py-1 rounded bg-warm-porcelain text-ink-muted hover:text-ink border border-border text-xs transition-colors" id="btn-state-updating" onclick="setCartState('updating')" type="button">
          Đang tính toán
        </button>
<button class="px-3 py-1 rounded bg-warm-porcelain text-ink-muted hover:text-ink border border-border text-xs transition-colors" id="btn-state-promo" onclick="setCartState('invalid-promo')" type="button">
          Mã voucher sai
        </button>
<button class="px-3 py-1 rounded bg-warm-porcelain text-ink-muted hover:text-ink border border-border text-xs transition-colors" id="btn-state-modal" onclick="openDeleteDialog()" type="button">
          Hộp thoại xóa
        </button>
<button class="px-3 py-1 rounded bg-warm-porcelain text-ink-muted hover:text-ink border border-border text-xs transition-colors" id="btn-state-empty" onclick="setCartState('empty')" type="button">
          Giỏ trống
        </button>
</div>
</div>
</aside>
<!-- Main Viewport Canvas -->
<main class="w-full max-w-7xl mx-auto px-gutter py-space-lg">
<!-- Breadcrumb & Page Head -->
<header class="mb-space-lg">
<nav aria-label="Đường dẫn trang" class="flex items-center gap-space-xs text-ink-muted font-body-sm text-body-sm mb-space-xs">
<a class="hover:text-lacquer-red transition-colors" href="#">Trang chủ</a>
<span class="text-border">/</span>
<span aria-current="page" class="text-ink font-medium">Giỏ hàng</span>
</nav>
<div class="flex flex-wrap items-baseline gap-space-sm">
<h1 class="font-body-md font-bold text-[32px] leading-tight tracking-tight text-ink">
          Giỏ hàng
        </h1>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-label-code font-semibold bg-raw-linen text-ink border border-border" id="header-count-badge">
          3 món
        </span>
</div>
</header>
<!-- Content Workspace: 8/4 Grid -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start" id="cart-content-grid">
<!-- 8 COLUMNS: Ledger View -->
<section aria-label="Danh sách món hàng" class="lg:col-span-8 flex flex-col">
<!-- Table Control Toolbar -->
<div class="flex items-center justify-between pb-space-sm border-b border-border">
<label class="flex items-center gap-space-xs cursor-pointer select-none">
<input checked="" class="w-4 h-4 rounded border-border text-lacquer-red focus:ring-lacquer-red accent-lacquer-red" id="select-all" onchange="toggleSelectAll(this)" type="checkbox"/>
<span class="font-body-sm text-body-sm text-ink font-medium">Chọn tất cả (3 sản phẩm)</span>
</label>
<button class="text-ink-muted hover:text-brick text-body-sm font-body-sm transition-colors flex items-center gap-1" onclick="openDeleteDialog('all')" type="button">
<span class="material-symbols-outlined text-[18px]">delete_sweep</span>
<span>Xóa các món đã chọn</span>
</button>
</div>
<!-- Ledger Items Container -->
<div class="divide-y divide-border" id="ledger-items-list">
<!-- Item 1: ASUS Laptop -->
<article class="py-space-md flex flex-col sm:flex-row items-start gap-space-md transition-opacity duration-150" id="cart-item-1">
<div class="pt-2">
<input aria-label="Chọn Laptop ASUS Vivobook 14" checked="" class="item-checkbox w-4 h-4 rounded border-border text-lacquer-red focus:ring-lacquer-red accent-lacquer-red" type="checkbox"/>
</div>
<!-- 80x100px image container -->
<a class="w-20 h-[100px] flex-shrink-0 rounded-xl overflow-hidden bg-warm-porcelain border border-border relative group" href="#">
<img alt="Laptop ASUS Vivobook 14 OLED góc nghiêng màu bạc" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDgkLLQFuCjCLKt2qvSG1pi21TLAj763h1bCV2AOi2pSEVT8LQzj2RE7CMIJYrCYHxIB4LuXdIdm-A6m974T6Fv0H_BShoN1crYpFTSmEGtbr0AQwcW7hmpPiM1j9x4rqK0tVjCu_rEtrm334w0GF4T1E3hpH9mJEA233ZiiTswAxexi4-1gdJL3bUTMMmxKkNhwoZwnfz_8_Zsiza0AV5q854X1gXgz7G9nH-ZQ"/>
</a>
<!-- Content Details -->
<div class="flex-1 min-w-0">
<div class="flex flex-wrap items-center gap-space-xs mb-1">
<span class="font-label-micro uppercase text-ink-muted tracking-wider">TechNest Official</span>
<span class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[11px] font-medium bg-raw-linen text-jade border border-border">
<span class="material-symbols-outlined text-[13px]">verified</span> Shop Việt
                </span>
</div>
<h2 class="font-body-md text-body-md font-semibold text-ink line-clamp-2 hover:text-lacquer-red transition-colors">
<a href="#">Laptop ASUS Vivobook 14 OLED (M1405VA)</a>
</h2>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">
                Cấu hình: i5 · 16GB · 512GB | Màu: Bạc Ánh Trăng
              </p>
<!-- Price & Stepper row -->
<div class="mt-3 flex flex-wrap items-center justify-between gap-space-sm">
<div class="flex items-baseline gap-2">
<span class="font-label-code text-body-sm text-ink font-semibold">14.990.000 ₫</span>
<span class="font-label-code text-xs text-ink-faint line-through">16.490.000 ₫</span>
</div>
<div class="flex items-center gap-space-md">
<!-- Stepper -->
<div class="flex items-center border border-border rounded-lg bg-warm-porcelain h-9 overflow-hidden">
<button aria-label="Giảm số lượng" class="w-9 h-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-raw-linen transition-colors" onclick="updateQty('qty-1', -1)" type="button">
<span class="material-symbols-outlined text-[16px]">remove</span>
</button>
<input class="w-10 h-full text-center font-label-code text-body-sm text-ink bg-transparent border-x border-border focus:outline-none" id="qty-1" readonly="" type="text" value="1"/>
<button aria-label="Tăng số lượng" class="w-9 h-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-raw-linen transition-colors" onclick="updateQty('qty-1', 1)" type="button">
<span class="material-symbols-outlined text-[16px]">add</span>
</button>
</div>
<!-- Subtotal -->
<div class="w-32 text-right">
<span class="font-label-code text-body-md font-bold text-ink" id="subtotal-1">14.990.000 ₫</span>
</div>
<!-- Trash CTA -->
<button aria-label="Xóa món" class="text-ink-faint hover:text-brick p-1.5 rounded transition-colors" onclick="openDeleteDialog('item-1')" title="Xóa món" type="button">
<span class="material-symbols-outlined text-[20px]">delete_outline</span>
</button>
</div>
</div>
</div>
</article>
<!-- Item 2: Sony Headphones -->
<article class="py-space-md flex flex-col sm:flex-row items-start gap-space-md transition-opacity duration-150" id="cart-item-2">
<div class="pt-2">
<input aria-label="Chọn Tai nghe Sony WH-CH720N" checked="" class="item-checkbox w-4 h-4 rounded border-border text-lacquer-red focus:ring-lacquer-red accent-lacquer-red" type="checkbox"/>
</div>
<!-- 80x100px image container -->
<a class="w-20 h-[100px] flex-shrink-0 rounded-xl overflow-hidden bg-warm-porcelain border border-border relative group" href="#">
<img alt="Tai nghe Sony chụp tai màu đen nhám trên nền xám" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBZSpyacQ6qNwO0NaGrDOImc-hMtG7bTVb1E4Vgi5dUn_IlOZXZlOEBVfIymU_5Zr-Mtdfz7jnePPxjD0Lcid70qFiW_yKQfbxsbYlPVnMvLt9jaKUfRwE5rAgcMiYGEkoapeqdHrpyxaXblLPhIhxs3gpPlyr_JeB6JIgFhsbiwbjzFE4bPBIvj_qHV_A-BAQzc8cbEvtce2Enwzwk3PgU8wMIjCtGUijVPLDcw"/>
</a>
<!-- Content Details -->
<div class="flex-1 min-w-0">
<div class="flex flex-wrap items-center gap-space-xs mb-1">
<span class="font-label-micro uppercase text-ink-muted tracking-wider">TechNest Official</span>
<span class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[11px] font-medium bg-raw-linen text-jade border border-border">
<span class="material-symbols-outlined text-[13px]">verified</span> Shop Việt
                </span>
</div>
<h2 class="font-body-md text-body-md font-semibold text-ink line-clamp-2 hover:text-lacquer-red transition-colors">
<a href="#">Tai nghe không dây chống ồn Sony WH-CH720N</a>
</h2>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">
                Màu sắc: Đen Cổ Điển · Bảo hành 12 tháng chính hãng
              </p>
<!-- Price & Stepper row -->
<div class="mt-3 flex flex-wrap items-center justify-between gap-space-sm">
<div class="flex items-baseline gap-2">
<span class="font-label-code text-body-sm text-ink font-semibold">2.490.000 ₫</span>
</div>
<div class="flex items-center gap-space-md">
<!-- Stepper -->
<div class="flex items-center border border-border rounded-lg bg-warm-porcelain h-9 overflow-hidden">
<button aria-label="Giảm số lượng" class="w-9 h-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-raw-linen transition-colors" onclick="updateQty('qty-2', -1)" type="button">
<span class="material-symbols-outlined text-[16px]">remove</span>
</button>
<input class="w-10 h-full text-center font-label-code text-body-sm text-ink bg-transparent border-x border-border focus:outline-none" id="qty-2" readonly="" type="text" value="1"/>
<button aria-label="Tăng số lượng" class="w-9 h-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-raw-linen transition-colors" onclick="updateQty('qty-2', 1)" type="button">
<span class="material-symbols-outlined text-[16px]">add</span>
</button>
</div>
<!-- Subtotal -->
<div class="w-32 text-right">
<span class="font-label-code text-body-md font-bold text-ink" id="subtotal-2">2.490.000 ₫</span>
</div>
<!-- Trash CTA -->
<button aria-label="Xóa món" class="text-ink-faint hover:text-brick p-1.5 rounded transition-colors" onclick="openDeleteDialog('item-2')" title="Xóa món" type="button">
<span class="material-symbols-outlined text-[20px]">delete_outline</span>
</button>
</div>
</div>
</div>
</article>
<!-- Item 3: Organic Baby Diapers -->
<article class="py-space-md flex flex-col sm:flex-row items-start gap-space-md transition-opacity duration-150" id="cart-item-3">
<div class="pt-2">
<input aria-label="Chọn Tã bỉm quần hữu cơ sợi tre" checked="" class="item-checkbox w-4 h-4 rounded border-border text-lacquer-red focus:ring-lacquer-red accent-lacquer-red" type="checkbox"/>
</div>
<!-- 80x100px image container -->
<a class="w-20 h-[100px] flex-shrink-0 rounded-xl overflow-hidden bg-warm-porcelain border border-border relative group" href="#">
<img alt="Bao bì tã bỉm trẻ em cotton hữu cơ sợi tre tự nhiên" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD14FNfoJ0yY8jDGB0S8Z_1go_FiPcWIfeVaU458lgUMdVp9uEhJaJhXABoe1OqIEugfhtes1IGTeLZjehZIX5JTRnngTpAGUxRFi-z53nc2kSFaskdVVg5SfQf6vsDFFjEbAgjR6fjsDbRC9BRIldnQtsithMRdREQD2njktTXl0uo62zJLu1LVskHXLRXKrvABBbGEQa3fojUSSaA2cmif5Wtykwn-rzbvAIZsQ"/>
</a>
<!-- Content Details -->
<div class="flex-1 min-w-0">
<div class="flex flex-wrap items-center gap-space-xs mb-1">
<span class="font-label-micro uppercase text-ink-muted tracking-wider">Mẹ &amp; Bé An Nhiên</span>
<span class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[11px] font-medium bg-raw-linen text-jade border border-border">
<span class="material-symbols-outlined text-[13px]">verified</span> Shop Việt
                </span>
</div>
<h2 class="font-body-md text-body-md font-semibold text-ink line-clamp-2 hover:text-lacquer-red transition-colors">
<a href="#">Tã bỉm quần hữu cơ sợi tre dịu êm size L</a>
</h2>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">
                Quy cách: Gói 60 miếng (9 - 14kg)
              </p>
<!-- Price & Stepper row -->
<div class="mt-3 flex flex-wrap items-center justify-between gap-space-sm">
<div class="flex items-baseline gap-2">
<span class="font-label-code text-body-sm text-ink font-semibold">289.000 ₫</span>
</div>
<div class="flex items-center gap-space-md">
<!-- Stepper (Qty: 2) -->
<div class="flex items-center border border-border rounded-lg bg-warm-porcelain h-9 overflow-hidden">
<button aria-label="Giảm số lượng" class="w-9 h-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-raw-linen transition-colors" onclick="updateQty('qty-3', -1)" type="button">
<span class="material-symbols-outlined text-[16px]">remove</span>
</button>
<input class="w-10 h-full text-center font-label-code text-body-sm text-ink bg-transparent border-x border-border focus:outline-none" id="qty-3" readonly="" type="text" value="2"/>
<button aria-label="Tăng số lượng" class="w-9 h-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-raw-linen transition-colors" onclick="updateQty('qty-3', 1)" type="button">
<span class="material-symbols-outlined text-[16px]">add</span>
</button>
</div>
<!-- Subtotal -->
<div class="w-32 text-right">
<span class="font-label-code text-body-md font-bold text-ink" id="subtotal-3">578.000 ₫</span>
</div>
<!-- Trash CTA -->
<button aria-label="Xóa món" class="text-ink-faint hover:text-brick p-1.5 rounded transition-colors" onclick="openDeleteDialog('item-3')" title="Xóa món" type="button">
<span class="material-symbols-outlined text-[20px]">delete_outline</span>
</button>
</div>
</div>
</div>
</article>
</div>
<!-- Packaging Policy Banner -->
<div class="mt-space-lg p-space-md bg-warm-porcelain rounded-xl border border-border flex items-start gap-space-sm">
<span class="material-symbols-outlined text-jade text-[22px] flex-shrink-0 mt-0.5">inventory_2</span>
<div>
<p class="font-body-sm text-body-sm font-semibold text-ink">Đóng gói chuẩn Nếp</p>
<p class="font-body-sm text-body-sm text-ink-muted">
              Thùng carton tái chế 3 lớp màng khí bọc lót thân thiện môi trường, khử khuẩn và gia cố nếp gấp trước khi bàn giao đơn vị vận chuyển.
            </p>
</div>
</div>
</section>
<!-- 4 COLUMNS: Sticky Order Summary -->
<aside aria-label="Tóm tắt giỏ hàng" class="lg:col-span-4 sticky top-24">
<div class="bg-warm-porcelain rounded-[20px] border border-border p-6 relative">
<!-- Loading overlay when updating -->
<div class="hidden absolute inset-0 bg-warm-porcelain/80 backdrop-blur-xs rounded-[20px] z-10 flex flex-col items-center justify-center gap-2" id="summary-loader">
<span class="material-symbols-outlined text-lacquer-red animate-spin text-[28px]">autorenew</span>
<span class="font-label-code text-xs text-ink-muted">Đang cập nhật tổng tiền...</span>
</div>
<h2 class="font-body-md font-semibold text-[18px] text-ink mb-space-md">
            Tóm tắt đơn hàng
          </h2>
<!-- Promo Code Section -->
<div class="mb-space-md">
<label class="block font-label-micro uppercase text-ink-muted mb-1.5" for="promo-input">Ưu đãi &amp; Mã giảm giá</label>
<div class="flex gap-2 mb-2">
<input class="flex-1 h-11 px-3 rounded-xl bg-warm-porcelain border border-border text-body-sm font-body-sm text-ink placeholder-ink-faint focus:outline-none focus:border-lacquer-red focus:ring-1 focus:ring-lacquer-red uppercase" id="promo-input" placeholder="Nhập mã khuyến mãi" type="text" value="NEP2025"/>
<button class="h-11 px-4 rounded-xl border border-border text-ink font-body-sm text-body-sm font-medium hover:bg-lacquer-wash transition-colors" onclick="applyPromoCode()" type="button">
                Áp dụng
              </button>
</div>
<!-- Error banner for simulation -->
<p class="hidden font-body-sm text-xs text-brick mt-1 flex items-center gap-1" id="promo-error-msg">
<span class="material-symbols-outlined text-[14px]">error</span>
              Mã khuyến mãi không tồn tại hoặc đã hết lượt áp dụng.
            </p>
<!-- Applied Promo Pill -->
<div class="flex items-center justify-between px-3 py-1.5 rounded-lg bg-raw-linen border border-border" id="applied-promo-pill">
<div class="flex items-center gap-1.5 min-w-0">
<span class="material-symbols-outlined text-[16px] text-lacquer-red">sell</span>
<span class="font-label-code text-xs font-semibold text-ink">NEP2025</span>
<span class="font-body-sm text-xs text-ink-muted truncate">– Giảm 50.000 ₫</span>
</div>
<button aria-label="Xóa mã giảm giá" class="text-ink-muted hover:text-brick p-0.5" onclick="removePromoCode()" type="button">
<span class="material-symbols-outlined text-[16px]">close</span>
</button>
</div>
</div>
<!-- Calculation Ledger Rows -->
<div class="space-y-space-sm pt-space-sm border-t border-border font-body-sm text-body-sm">
<div class="flex items-center justify-between text-ink-muted">
<span>Tạm tính (3 món)</span>
<span class="font-label-code text-ink" id="summary-subtotal">18.058.000 ₫</span>
</div>
<div class="flex items-center justify-between text-ink-muted">
<span>Giảm giá khuyến mãi</span>
<span class="font-label-code text-lacquer-red font-medium" id="summary-discount">-50.000 ₫</span>
</div>
<div class="flex items-center justify-between text-ink-muted">
<span>Phí vận chuyển</span>
<span class="text-ink-faint font-body-sm">Tính ở bước sau</span>
</div>
<div class="pt-space-sm border-t border-border">
<div class="flex items-baseline justify-between">
<span class="font-body-md font-semibold text-ink text-body-md">Tổng cộng</span>
<div class="text-right">
<span class="font-label-code font-bold text-[24px] leading-tight text-ink" id="summary-total">
                    18.008.000 ₫
                  </span>
</div>
</div>
<p class="font-body-sm text-[12px] text-ink-faint text-right mt-1">
                (Đã bao gồm thuế VAT và phí kiểm định)
              </p>
</div>
</div>
<!-- Primary Action CTA -->
<div class="mt-space-lg">
<button class="w-full h-12 bg-lacquer-red hover:bg-lacquer-deep active:scale-[0.99] text-warm-porcelain font-body-md text-body-md font-semibold rounded-xl flex items-center justify-center gap-2 transition-all" id="btn-checkout" type="button">
<span>Thanh toán</span>
<span class="font-label-code font-normal text-sm" id="btn-checkout-amount">(18.008.000 ₫)</span>
</button>
</div>
<!-- Trust & Authenticity Badges -->
<div class="mt-space-md pt-space-md border-t border-border grid grid-cols-1 gap-2 text-ink-muted text-[12px] font-body-sm">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[17px] text-jade">verified_user</span>
<span>Shop Việt chính hiệu 100% xuất xứ minh bạch</span>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[17px] text-turmeric">sync</span>
<span>Đổi trả 7 ngày an tâm tận nhà</span>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[17px] text-ink-muted">lock</span>
<span>Thanh toán bảo mật chuẩn SSL quốc tế</span>
</div>
</div>
</div>
</aside>
</div>
<!-- Empty Basket Fallback View (Hidden by default) -->
<section class="hidden w-full py-20 flex flex-col items-center justify-center text-center" id="cart-empty-view">
<div class="w-20 h-20 rounded-full bg-raw-linen border border-border flex items-center justify-center mb-space-md text-ink-muted">
<span class="material-symbols-outlined text-[36px]">production_quantity_limits</span>
</div>
<h2 class="font-body-md text-headline-2 font-bold text-ink mb-2">Giỏ hàng đang trống</h2>
<p class="font-body-sm text-body-md text-ink-muted max-w-md mb-space-lg">
        Giỏ đang trống. Chọn một món ưng ý để mang nếp sống ấm cúng về tổ ấm nhé.
      </p>
<button class="h-12 px-space-lg bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain font-body-md font-medium rounded-xl transition-colors inline-flex items-center gap-2" onclick="setCartState('default')" type="button">
<span class="material-symbols-outlined text-[20px]">storefront</span>
<span>Xem chợ hôm nay</span>
</button>
</section>
</main>
<!-- Remove Confirmation Dialog Modal -->
<div aria-labelledby="modal-title" aria-modal="true" class="hidden fixed inset-0 z-50 flex items-center justify-center p-gutter bg-ink/40 backdrop-blur-xs" id="delete-modal" role="dialog">
<div class="bg-warm-porcelain rounded-2xl border border-border max-w-md w-full p-6 transform transition-all shadow-xl">
<div class="flex items-start gap-space-sm mb-space-md">
<div class="w-10 h-10 rounded-full bg-lacquer-wash text-lacquer-red flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-[22px]">delete</span>
</div>
<div>
<h3 class="font-body-md text-headline-3 font-bold text-ink" id="modal-title">Xác nhận bỏ sản phẩm?</h3>
<p class="font-body-sm text-body-sm text-ink-muted mt-1">
            Món hàng này sẽ được gỡ khỏi danh sách thanh toán của bạn. Bạn vẫn có thể tìm lại trong lịch sử xem sau.
          </p>
</div>
</div>
<div class="flex items-center justify-end gap-space-sm pt-space-sm border-t border-border">
<button class="h-10 px-4 rounded-lg border border-border text-ink font-body-sm text-body-sm hover:bg-raw-linen transition-colors" onclick="closeDeleteDialog()" type="button">
          Giữ lại
        </button>
<button class="h-10 px-4 rounded-lg bg-brick hover:bg-lacquer-deep text-warm-porcelain font-body-sm text-body-sm font-medium transition-colors" onclick="confirmDeleteAction()" type="button">
          Đồng ý xóa
        </button>
</div>
</div>
</div>
</div>
<script>
  let pendingDeleteTarget = null;

  function toggleSelectAll(masterCheckbox) {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    checkboxes.forEach(cb => cb.checked = masterCheckbox.checked);
  }

  function updateQty(inputId, delta) {
    const input = document.getElementById(inputId);
    if (!input) return;
    let val = parseInt(input.value, 10) || 1;
    val = Math.max(1, Math.min(99, val + delta));
    input.value = val;

    // Trigger brief subtle update animation
    const loader = document.getElementById('summary-loader');
    if (loader) {
      loader.classList.remove('hidden');
      setTimeout(() => loader.classList.add('hidden'), 350);
    }
  }

  function applyPromoCode() {
    const input = document.getElementById('promo-input');
    const errorMsg = document.getElementById('promo-error-msg');
    const pill = document.getElementById('applied-promo-pill');
    const discount = document.getElementById('summary-discount');

    if (!input) return;
    if (input.value.trim().toUpperCase() === 'NEP2025') {
      errorMsg.classList.add('hidden');
      pill.classList.remove('hidden');
      discount.textContent = '-50.000 ₫';
    } else {
      errorMsg.classList.remove('hidden');
      pill.classList.add('hidden');
      discount.textContent = '0 ₫';
    }
  }

  function removePromoCode() {
    const input = document.getElementById('promo-input');
    const pill = document.getElementById('applied-promo-pill');
    const discount = document.getElementById('summary-discount');
    if (input) input.value = '';
    if (pill) pill.classList.add('hidden');
    if (discount) discount.textContent = '0 ₫';
  }

  function openDeleteDialog(target) {
    pendingDeleteTarget = target || 'all';
    const modal = document.getElementById('delete-modal');
    if (modal) modal.classList.remove('hidden');
  }

  function closeDeleteDialog() {
    const modal = document.getElementById('delete-modal');
    if (modal) modal.classList.add('hidden');
    pendingDeleteTarget = null;
  }

  function confirmDeleteAction() {
    closeDeleteDialog();
    if (pendingDeleteTarget === 'all') {
      setCartState('empty');
    } else if (pendingDeleteTarget && pendingDeleteTarget.startsWith('item-')) {
      const el = document.getElementById('cart-' + pendingDeleteTarget);
      if (el) {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 160);
      }
    }
  }

  function setCartState(state) {
    const defaultGrid = document.getElementById('cart-content-grid');
    const emptyView = document.getElementById('cart-empty-view');
    const summaryLoader = document.getElementById('summary-loader');
    const promoInput = document.getElementById('promo-input');
    const promoError = document.getElementById('promo-error-msg');
    const promoPill = document.getElementById('applied-promo-pill');
    const headerCount = document.getElementById('header-count-badge');

    // Reset button styles in switcher
    const buttons = ['default', 'updating', 'promo', 'modal', 'empty'];
    buttons.forEach(k => {
      const btn = document.getElementById('btn-state-' + k);
      if (btn) {
        btn.classList.remove('text-lacquer-red', 'font-semibold', 'border-lacquer-red');
        btn.classList.add('text-ink-muted', 'border-border');
      }
    });

    const activeBtnKey = state === 'invalid-promo' ? 'promo' : state;
    const activeBtn = document.getElementById('btn-state-' + activeBtnKey);
    if (activeBtn) {
      activeBtn.classList.add('text-lacquer-red', 'font-semibold', 'border-lacquer-red');
      activeBtn.classList.remove('text-ink-muted');
    }

    if (state === 'empty') {
      defaultGrid.classList.add('hidden');
      emptyView.classList.remove('hidden');
      if (headerCount) headerCount.textContent = '0 món';
    } else {
      defaultGrid.classList.remove('hidden');
      emptyView.classList.add('hidden');
      if (headerCount) headerCount.textContent = '3 món';

      if (state === 'updating') {
        summaryLoader.classList.remove('hidden');
        setTimeout(() => summaryLoader.classList.add('hidden'), 1500);
      } else {
        summaryLoader.classList.add('hidden');
      }

      if (state === 'invalid-promo') {
        promoInput.value = 'SAIMATROI';
        promoError.classList.remove('hidden');
        promoPill.classList.add('hidden');
      } else {
        promoInput.value = 'NEP2025';
        promoError.classList.add('hidden');
        promoPill.classList.remove('hidden');
      }
    }
  }
</script></main><footer class="w-full bg-raw-linen border-t border-border mt-margin"><div class="w-full px-gutter py-space-xl"><div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-space-lg"><div><div class="flex items-center gap-space-xs mb-space-sm"><span class="font-headline-3 text-headline-3 text-ink">ShopNest</span></div><p class="font-body-sm text-body-sm text-ink-muted max-w-xs mb-space-md">Sàn thương mại điện tử tôn vinh bản sắc chế tác thủ công Việt Nam, nếp sống tinh tế và sự kết nối giữa nghệ nhân cùng người yêu cái đẹp.</p><div class="flex items-center gap-space-sm"><span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-warm-porcelain border border-border text-ink-muted text-xs font-label-code">VN</span><span class="font-label-micro text-label-micro text-ink-muted uppercase">Thủ công &amp; Nghệ nghệ</span></div></div><div><h4 class="font-body-sm text-body-sm font-semibold text-ink uppercase tracking-wider mb-space-sm">Khám Phá</h4><ul class="space-y-space-xs"><li class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors"><a data-path="danh-muc" href="#">Danh mục gốm &amp; trà</a></li><li class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors"><a data-path="shop-viet" href="#">Làng nghề Việt</a></li><li class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors"><a data-path="khuyen-mai" href="#">Ưu đãi định kỳ</a></li><li class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors"><a data-path="bo-suu-tap" href="#">Bộ sưu tập mới</a></li></ul></div><div><h4 class="font-body-sm text-body-sm font-semibold text-ink uppercase tracking-wider mb-space-sm">Trợ Giúp &amp; Pháp Lý</h4><ul class="space-y-space-xs"><li class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors"><a data-path="chinh-sach-van-chuyen" href="#">Chính sách vận chuyển</a></li><li class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors"><a data-path="doi-tra-bao-hanh" href="#">Đổi trả &amp; Bảo hành</a></li><li class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors"><a data-path="dieu-khoan-su-dung" href="#">Điều khoản sử dụng</a></li><li class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors"><a data-path="bao-mat-thong-tin" href="#">Bảo mật thông tin</a></li></ul></div><div><h4 class="font-body-sm text-body-sm font-semibold text-ink uppercase tracking-wider mb-space-sm">Đăng Ký Bản Tin Nếp</h4><p class="font-body-sm text-body-sm text-ink-muted mb-space-sm">Nhận tin về các sản phẩm thủ công tinh hoa và câu chuyện nghệ nhân mỗi tuần.</p><div class="flex gap-space-xs"><input class="flex-1 h-10 px-space-sm rounded-lg bg-warm-porcelain border border-border text-body-sm font-body-sm text-ink placeholder-ink-faint focus:outline-none focus:border-lacquer-red" placeholder="Email của bạn" type="email"/><button class="h-10 px-space-md bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain font-body-sm text-body-sm font-medium rounded-lg transition-colors" type="button">Gửi</button></div></div></div><div class="pt-space-md border-t border-border flex flex-col md:flex-row items-center justify-between gap-space-sm"><p class="font-body-sm text-body-sm text-ink-faint">© 2024 ShopNest. Tinh hoa chế tác Việt. Đã bảo lưu mọi quyền.</p><div class="flex items-center gap-space-md font-body-sm text-body-sm text-ink-faint"><span>Hà Nội • Huế • Sài Gòn</span><span class="font-label-code text-label-code text-ink-muted">v2.4.0</span></div></div></div></footer></body></html>
```
### S05 - Thanh toán
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"turmeric":"#8A5A1A","secondary-fixed-dim":"#cbc6bf","ink":"#1D1B17","ink-faint":"#9A8F7F","outline":"#8c716d","lacquer-wash":"#F2DCD5","brick":"#8B2A24","on-primary-container":"#ffd9d3","outline-variant":"#dfbfbb","surface-container":"#f2ede2","on-surface-variant":"#58413e","on-secondary-container":"#67645f","surface-container-highest":"#e7e2d7","on-error-container":"#93000a","jade":"#2F6B57","surface-dim":"#dedacf","on-tertiary-fixed-variant":"#4b463a","on-primary":"#ffffff","on-error":"#ffffff","secondary-container":"#e8e2db","rice-paper":"#F6F1E6","surface-container-high":"#ede8dd","inverse-surface":"#323029","surface-tint":"#aa342a","on-primary-fixed-variant":"#891c16","primary-fixed":"#ffdad5","surface-variant":"#e7e2d7","primary-container":"#b23a2f","error-container":"#ffdad6","tertiary-fixed":"#eae2d1","secondary":"#615e59","primary":"#91221a","secondary-fixed":"#e8e2db","surface":"#fef9ee","border":"#DCD1BE","tertiary":"#514b3f","surface-container-low":"#f8f3e8","on-tertiary-container":"#e9e0cf","on-secondary":"#ffffff","on-surface":"#1d1c15","on-secondary-fixed":"#1d1b17","surface-bright":"#fef9ee","background":"#fef9ee","on-background":"#1d1c15","on-tertiary-fixed":"#1f1b11","on-tertiary":"#ffffff","lacquer-red":"#B23A2F","primary-fixed-dim":"#ffb4aa","lacquer-deep":"#8C2A22","logo-blue":"#4991D8","inverse-primary":"#ffb4aa","warm-porcelain":"#FFFCF4","inverse-on-surface":"#f5f0e5","error":"#ba1a1a","tertiary-container":"#696356","ink-muted":"#6B6458","on-primary-fixed":"#410001","raw-linen":"#EDE4D3","tertiary-fixed-dim":"#cec6b5","on-secondary-fixed-variant":"#494641","surface-container-lowest":"#ffffff"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"space-sm":"0.5rem","margin":"3rem","space-lg":"1.5rem","gutter":"1.5rem","space-md":"1rem","space-xl":"2.5rem","margin-mobile":"1.25rem","space-xs":"0.25rem","gutter-mobile":"1rem"},"fontFamily":{"headline-3":["Be Vietnam Pro"],"display-xl":["Newsreader"],"body-md":["Be Vietnam Pro"],"headline-2":["Newsreader"],"display-xl-mobile":["Newsreader"],"display-lg":["Newsreader"],"display-lg-mobile":["Newsreader"],"label-code":["JetBrains Mono"],"headline-1":["Newsreader"],"label-micro":["Be Vietnam Pro"],"body-sm":["Be Vietnam Pro"],"body-lg":["Be Vietnam Pro"]},"fontSize":{"headline-3":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}],"display-xl":["64px",{"lineHeight":"60px","letterSpacing":"-0.035em","fontWeight":"600"}],"body-md":["16px",{"lineHeight":"26px","fontWeight":"400"}],"headline-2":["28px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"600"}],"display-xl-mobile":["40px",{"lineHeight":"40px","letterSpacing":"-0.03em","fontWeight":"600"}],"display-lg":["48px",{"lineHeight":"48px","letterSpacing":"-0.03em","fontWeight":"600"}],"display-lg-mobile":["32px",{"lineHeight":"34px","letterSpacing":"-0.025em","fontWeight":"600"}],"label-code":["14px",{"lineHeight":"20px","fontWeight":"500"}],"headline-1":["36px",{"lineHeight":"40px","letterSpacing":"-0.025em","fontWeight":"600"}],"label-micro":["12px",{"lineHeight":"16px","letterSpacing":"0.12em","fontWeight":"600"}],"body-sm":["14px",{"lineHeight":"21px","fontWeight":"400"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}]}}}};</script></head><body class="bg-rice-paper font-body-md text-ink antialiased"><header class="fixed top-0 left-0 w-full z-50 bg-rice-paper/95 backdrop-blur-md border-b border-border"><div class="h-20 w-full px-gutter max-w-7xl mx-auto flex items-center justify-between gap-space-md"><div class="flex items-center gap-space-md"><a class="flex items-center gap-space-sm group" data-path="cart" href="#"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><div class="flex flex-col"><span class="font-headline-3 text-headline-3 text-ink tracking-tight">ShopNest</span><span class="font-label-micro text-label-micro text-ink-muted uppercase tracking-wider">Thanh toán an tâm</span></div></a></div><nav class="hidden md:flex items-center gap-space-md text-body-sm" data-active-classes="text-lacquer-red font-semibold"><a class="text-ink-muted hover:text-ink transition-colors" data-path="cart" href="#">Giỏ hàng</a><span class="text-border font-label-code">/</span><a aria-current="page" class="transition-colors text-lacquer-red font-semibold" data-path="checkout-payment" href="#">Thông tin &amp; Thanh toán</a><span class="text-border font-label-code">/</span><a class="text-ink-muted hover:text-ink transition-colors" data-path="order-confirmation" href="#">Hoàn tất đơn</a></nav><div class="flex items-center gap-space-md"><div class="flex items-center gap-space-xs text-jade py-space-xs px-space-sm bg-warm-porcelain rounded-full border border-border"><span class="material-symbols-outlined text-[18px]">verified_user</span><span class="font-label-micro text-label-micro text-jade uppercase font-semibold hidden sm:inline-block">Thanh toán bảo mật</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-rice-paper min-h-[calc(100vh-140px)]"><div class="flex flex-col w-full">
<!-- Interactive State Simulation Bar (Design System Sandbox) -->
<aside aria-label="Bộ điều khiển kịch bản mẫu" class="w-full bg-raw-linen/70 backdrop-blur-sm border-b border-border py-space-sm px-gutter">
<div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm">
<div class="flex items-center gap-space-xs text-ink-muted">
<span class="material-symbols-outlined text-[16px] text-turmeric">tune</span>
<span class="font-label-micro text-label-micro uppercase tracking-wider text-ink font-semibold">Trạng thái mô phỏng:</span>
</div>
<div class="flex flex-wrap items-center gap-space-xs" id="state-simulator-bar">
<button class="px-3 py-1 rounded-full text-body-sm bg-lacquer-red text-warm-porcelain font-semibold transition-all" data-state-btn="default" type="button">Mặc định (Có địa chỉ lưu)</button>
<button class="px-3 py-1 rounded-full text-body-sm bg-warm-porcelain border border-border text-ink hover:bg-lacquer-wash/50 transition-all" data-state-btn="empty" type="button">Chưa có địa chỉ</button>
<button class="px-3 py-1 rounded-full text-body-sm bg-warm-porcelain border border-border text-ink hover:bg-lacquer-wash/50 transition-all" data-state-btn="error" type="button">Lỗi nhập liệu</button>
<button class="px-3 py-1 rounded-full text-body-sm bg-warm-porcelain border border-border text-ink hover:bg-lacquer-wash/50 transition-all" data-state-btn="processing" type="button">Đang xử lý thanh toán</button>
<button class="px-3 py-1 rounded-full text-body-sm bg-warm-porcelain border border-border text-ink hover:bg-lacquer-wash/50 transition-all" data-state-btn="cod" type="button">Xác nhận COD</button>
</div>
</div>
</aside>
<!-- Main Checkout Area (Desktop 7/5 Asymmetric Grid) -->
<div class="w-full max-w-7xl mx-auto px-gutter py-space-xl">
<!-- Stepper (Strict Minimalist Nếp Lines, No circles or blobs) -->
<nav aria-label="Tiến trình mua hàng" class="mb-space-xl">
<ol class="flex items-center gap-space-lg border-b border-border pb-space-md">
<!-- Step 1: Done -->
<li class="flex items-center gap-space-xs text-ink-muted group cursor-pointer">
<span class="material-symbols-outlined text-[18px] text-jade">check</span>
<span class="font-body-md text-body-md font-medium text-ink-muted">1. Giỏ hàng</span>
</li>
<li class="text-border font-label-code text-body-sm">/</li>
<!-- Step 2: Active -->
<li class="relative flex items-center gap-space-xs">
<span class="font-headline-3 text-headline-3 text-ink">2. Thông tin &amp; Thanh toán</span>
<span class="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-lacquer-red"></span>
</li>
<li class="text-border font-label-code text-body-sm">/</li>
<!-- Step 3: Upcoming -->
<li class="flex items-center gap-space-xs text-ink-faint">
<span class="font-body-md text-body-md">3. Hoàn tất đơn</span>
</li>
</ol>
</nav>
<!-- 7/5 Asymmetric Split -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
<!-- LEFT 7 COLUMNS: Step Sections -->
<section class="lg:col-span-7 flex flex-col gap-space-xl">
<!-- SECTION 1: Delivery Address -->
<div class="flex flex-col gap-space-md">
<div class="flex items-center justify-between border-b border-border pb-space-sm">
<div class="flex items-center gap-space-xs">
<span class="font-label-code text-label-code text-lacquer-red font-semibold">01.</span>
<h2 class="font-headline-2 text-headline-2 text-ink">Địa chỉ giao hàng</h2>
</div>
<button class="text-body-sm font-medium text-lacquer-red hover:text-lacquer-deep underline underline-offset-4 decoration-1 transition-colors" id="btn-toggle-new-address" type="button">
              + Thêm địa chỉ mới
            </button>
</div>
<!-- Option A: Saved Address Card -->
<div class="bg-warm-porcelain rounded-xl border border-border p-space-md transition-all" id="saved-address-card">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
<div class="flex items-center gap-space-sm">
<span class="font-headline-3 text-headline-3 text-ink">Nguyễn Thu Hà</span>
<span class="text-border">·</span>
<span class="font-label-code text-label-code text-ink-muted">0912 345 678</span>
<span class="inline-flex items-center px-2 py-0.5 rounded-full text-label-micro bg-lacquer-wash text-lacquer-deep font-semibold uppercase tracking-wider">Mặc định</span>
</div>
<button class="text-left sm:text-right font-body-sm text-body-sm text-ink-muted hover:text-ink underline underline-offset-4 decoration-border transition-colors" id="btn-edit-address" type="button">
                Thay đổi địa chỉ
              </button>
</div>
<p class="font-body-md text-body-md text-ink-muted mt-space-xs">
              Số 18, Ngõ 42, Phố Tràng Tiền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội
            </p>
</div>
<!-- Address Form (Clean Warm Porcelain Fields) -->
<form class="bg-warm-porcelain rounded-xl border border-border p-space-lg flex flex-col gap-space-md" id="checkout-address-form" novalidate="">
<div class="flex items-center justify-between">
<span class="font-label-micro text-label-micro text-ink-muted uppercase tracking-wider">Chi tiết người nhận hàng</span>
<span class="font-label-code text-body-sm text-ink-faint" id="form-mode-indicator">Đang chỉnh sửa</span>
</div>
<!-- Error Banner (Hidden by default, shown via simulation) -->
<div class="hidden p-space-sm bg-error-container/20 border border-brick/40 rounded-lg flex items-start gap-space-xs text-brick" id="address-error-banner">
<span class="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
<p class="font-body-sm text-body-sm">Vui lòng điền đầy đủ và chính xác các mục có dấu sao (*) bên dưới để đảm bảo đơn hàng được điều phối đúng giờ.</p>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div class="flex flex-col gap-space-xs">
<label class="font-body-sm text-body-sm font-medium text-ink" for="full_name">Họ và tên *</label>
<input class="h-12 px-space-md rounded-xl bg-warm-porcelain border border-border text-ink font-body-md focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:border-transparent transition-all placeholder:text-ink-faint" id="full_name" name="full_name" placeholder="Nhập họ và tên người nhận" required="" type="text" value="Nguyễn Thu Hà"/>
<span class="field-error-msg hidden font-label-micro text-label-micro text-brick">Tên người nhận không được để trống</span>
</div>
<div class="flex flex-col gap-space-xs">
<label class="font-body-sm text-body-sm font-medium text-ink" for="phone_number">Số điện thoại *</label>
<input class="h-12 px-space-md rounded-xl bg-warm-porcelain border border-border text-ink font-label-code focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:border-transparent transition-all placeholder:text-ink-faint" id="phone_number" name="phone_number" placeholder="Ví dụ: 0912 345 678" required="" type="tel" value="0912 345 678"/>
<span class="field-error-msg hidden font-label-micro text-label-micro text-brick">Số điện thoại hợp lệ là bắt buộc</span>
</div>
</div>
<div class="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
<div class="flex flex-col gap-space-xs">
<label class="font-body-sm text-body-sm font-medium text-ink" for="province">Tỉnh / Thành phố *</label>
<select class="h-12 px-space-md rounded-xl bg-warm-porcelain border border-border text-ink font-body-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:border-transparent transition-all" id="province" name="province" required="">
<option selected="" value="HN">Hà Nội</option>
<option value="HCM">TP. Hồ Chí Minh</option>
<option value="DN">Đà Nẵng</option>
<option value="HP">Hải Phòng</option>
</select>
</div>
<div class="flex flex-col gap-space-xs">
<label class="font-body-sm text-body-sm font-medium text-ink" for="district">Quận / Huyện *</label>
<select class="h-12 px-space-md rounded-xl bg-warm-porcelain border border-border text-ink font-body-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:border-transparent transition-all" id="district" name="district" required="">
<option selected="" value="HK">Quận Hoàn Kiếm</option>
<option value="BD">Quận Ba Đình</option>
<option value="DD">Quận Đống Đa</option>
<option value="CG">Quận Cầu Giấy</option>
</select>
</div>
<div class="flex flex-col gap-space-xs">
<label class="font-body-sm text-body-sm font-medium text-ink" for="ward">Phường / Xã *</label>
<select class="h-12 px-space-md rounded-xl bg-warm-porcelain border border-border text-ink font-body-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:border-transparent transition-all" id="ward" name="ward" required="">
<option selected="" value="TT">Phường Tràng Tiền</option>
<option value="LTK">Phường Lý Thái Tổ</option>
<option value="HB">Phường Hàng Bạc</option>
</select>
</div>
</div>
<div class="flex flex-col gap-space-xs">
<label class="font-body-sm text-body-sm font-medium text-ink" for="specific_address">Địa chỉ cụ thể *</label>
<input class="h-12 px-space-md rounded-xl bg-warm-porcelain border border-border text-ink font-body-md focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:border-transparent transition-all placeholder:text-ink-faint" id="specific_address" name="specific_address" placeholder="Số nhà, tên toà nhà, ngõ/ngách, tên đường" required="" type="text" value="Số 18, Ngõ 42, Phố Tràng Tiền"/>
<span class="field-error-msg hidden font-label-micro text-label-micro text-brick">Vui lòng nhập số nhà và ngõ ngách cụ thể</span>
</div>
<div class="flex flex-col gap-space-xs">
<label class="font-body-sm text-body-sm font-medium text-ink" for="delivery_notes">Ghi chú giao hàng (tuỳ chọn)</label>
<input class="h-12 px-space-md rounded-xl bg-warm-porcelain border border-border text-ink font-body-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:border-transparent transition-all placeholder:text-ink-faint" id="delivery_notes" name="delivery_notes" placeholder="Ví dụ: Gọi trước khi giao, gửi bảo vệ toà nhà..." type="text" value="Gọi trước khi giao 15 phút, giao giờ hành chính"/>
</div>
<div class="flex items-center gap-space-sm pt-space-xs">
<input checked="" class="w-4 h-4 rounded border-border text-lacquer-red focus:ring-lacquer-red accent-lacquer-red cursor-pointer" id="set_default_address" name="set_default_address" type="checkbox"/>
<label class="font-body-sm text-body-sm text-ink cursor-pointer select-none" for="set_default_address">Đặt làm địa chỉ giao hàng mặc định cho tài khoản này</label>
</div>
</form>
</div>
<!-- SECTION 2: Shipping Method -->
<div class="flex flex-col gap-space-md">
<div class="flex items-center gap-space-xs border-b border-border pb-space-sm">
<span class="font-label-code text-label-code text-lacquer-red font-semibold">02.</span>
<h2 class="font-headline-2 text-headline-2 text-ink">Phương thức vận chuyển</h2>
</div>
<div aria-label="Lựa chọn đơn vị vận chuyển" class="grid grid-cols-1 gap-space-sm" role="radiogroup">
<!-- Option 1: Standard Shipping (Selected) -->
<label class="shipping-option flex items-start gap-space-md p-space-md rounded-xl bg-lacquer-wash/25 border-2 border-lacquer-red cursor-pointer transition-all">
<div class="pt-0.5">
<input checked="" class="w-4 h-4 accent-lacquer-red cursor-pointer" name="shipping_method" type="radio" value="standard"/>
</div>
<div class="flex flex-col flex-1 min-w-0">
<div class="flex flex-wrap items-center justify-between gap-space-xs">
<span class="font-headline-3 text-headline-3 text-ink">Giao tiêu chuẩn (2–4 ngày)</span>
<div class="flex items-center gap-space-xs">
<span class="font-label-code text-body-sm text-ink-faint line-through">30.000 ₫</span>
<span class="font-label-code text-label-code text-jade font-semibold">Miễn phí (Freeship Nếp)</span>
</div>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-space-xs">
                  Vận chuyển bọc lót chống sốc 3 lớp, giao bởi Đối tác Giao vận Nếp Việt. Bảo hiểm nguyên vẹn kiện hàng 100%.
                </p>
</div>
</label>
<!-- Option 2: Express Shipping -->
<label class="shipping-option flex items-start gap-space-md p-space-md rounded-xl bg-warm-porcelain border border-border hover:border-ink-muted/50 cursor-pointer transition-all">
<div class="pt-0.5">
<input class="w-4 h-4 accent-lacquer-red cursor-pointer" name="shipping_method" type="radio" value="express"/>
</div>
<div class="flex flex-col flex-1 min-w-0">
<div class="flex flex-wrap items-center justify-between gap-space-xs">
<span class="font-headline-3 text-headline-3 text-ink">Giao nhanh hoả tốc (1–2 ngày)</span>
<span class="font-label-code text-label-code text-ink font-semibold">45.000 ₫</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-space-xs">
                  Ưu tiên điều phối trong 24h làm việc. Dành cho người nhận cần hàng gấp trong nội thành và các trục kinh tế.
                </p>
</div>
</label>
</div>
</div>
<!-- SECTION 3: Payment Method -->
<div class="flex flex-col gap-space-md">
<div class="flex items-center gap-space-xs border-b border-border pb-space-sm">
<span class="font-label-code text-label-code text-lacquer-red font-semibold">03.</span>
<h2 class="font-headline-2 text-headline-2 text-ink">Phương thức thanh toán</h2>
</div>
<div aria-label="Hình thức thanh toán" class="flex flex-col gap-space-sm" role="radiogroup">
<!-- Row 1: Stripe Credit/Debit Card (Selected) -->
<div class="payment-method-row rounded-xl border-2 border-lacquer-red bg-lacquer-wash/20 p-space-md transition-all flex flex-col gap-space-md" id="stripe-container">
<label class="flex items-start gap-space-md cursor-pointer">
<div class="pt-0.5">
<input checked="" class="w-4 h-4 accent-lacquer-red cursor-pointer" name="payment_method" type="radio" value="stripe"/>
</div>
<div class="flex flex-col flex-1">
<div class="flex flex-wrap items-center justify-between gap-space-xs">
<span class="font-headline-3 text-headline-3 text-ink">Stripe — Thẻ quốc tế (Visa, Mastercard, JCB)</span>
<div class="flex items-center gap-1.5 opacity-90">
<!-- Visa Tag -->
<span class="px-1.5 py-0.5 rounded text-[10px] font-label-code font-bold bg-white text-[#1A1F71] border border-border">VISA</span>
<!-- Mastercard Circle SVG -->
<span class="px-1.5 py-0.5 rounded text-[10px] font-label-code font-bold bg-white text-[#EB001B] border border-border">MC</span>
<!-- JCB Tag -->
<span class="px-1.5 py-0.5 rounded text-[10px] font-label-code font-bold bg-white text-[#0066B2] border border-border">JCB</span>
</div>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-space-xs">Thanh toán bảo mật trực tiếp qua cổng thanh toán bảo chứng toàn cầu Stripe.</p>
</div>
</label>
<!-- Stripe Nested Form Fields -->
<div class="pt-space-sm border-t border-border/80 flex flex-col gap-space-md" id="stripe-nested-inputs">
<div class="flex flex-col gap-space-xs">
<label class="font-body-sm text-body-sm font-medium text-ink" for="card_number">Số thẻ *</label>
<div class="relative">
<input class="w-full h-12 px-space-md pr-10 rounded-xl bg-warm-porcelain border border-border text-ink font-label-code focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:border-transparent transition-all" id="card_number" placeholder="1234 5678 9012 3456" type="text" value="4242 •••• •••• 4242"/>
<span class="material-symbols-outlined absolute right-3 top-3 text-[20px] text-ink-muted">credit_card</span>
</div>
</div>
<div class="grid grid-cols-2 gap-space-md">
<div class="flex flex-col gap-space-xs">
<label class="font-body-sm text-body-sm font-medium text-ink" for="card_expiry">Ngày hết hạn *</label>
<input class="h-12 px-space-md rounded-xl bg-warm-porcelain border border-border text-ink font-label-code focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:border-transparent transition-all placeholder:text-ink-faint" id="card_expiry" placeholder="MM/YY" type="text" value="12/28"/>
</div>
<div class="flex flex-col gap-space-xs">
<label class="font-body-sm text-body-sm font-medium text-ink" for="card_cvc">Mã bảo mật CVC *</label>
<div class="relative">
<input class="w-full h-12 px-space-md pr-10 rounded-xl bg-warm-porcelain border border-border text-ink font-label-code focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:border-transparent transition-all placeholder:text-ink-faint" id="card_cvc" maxlength="4" placeholder="CVC" type="password" value="888"/>
<span class="material-symbols-outlined absolute right-3 top-3 text-[18px] text-ink-muted" title="3 chữ số sau mặt thẻ">help</span>
</div>
</div>
</div>
<div class="flex items-center gap-space-xs text-ink-muted">
<span class="material-symbols-outlined text-[16px] text-jade">lock</span>
<span class="font-label-micro text-label-micro uppercase tracking-wider text-ink-muted">Thanh toán an toàn mã hoá 256-bit chuẩn PCI-DSS bởi Stripe</span>
</div>
</div>
</div>
<!-- Row 2: Cash on Delivery (COD) -->
<div class="payment-method-row rounded-xl border border-border bg-warm-porcelain p-space-md transition-all flex flex-col gap-space-xs" id="cod-container">
<label class="flex items-start gap-space-md cursor-pointer">
<div class="pt-0.5">
<input class="w-4 h-4 accent-lacquer-red cursor-pointer" name="payment_method" type="radio" value="cod"/>
</div>
<div class="flex flex-col flex-1">
<div class="flex flex-wrap items-center justify-between gap-space-xs">
<span class="font-headline-3 text-headline-3 text-ink">COD — Thanh toán tiền mặt khi nhận hàng</span>
<span class="px-2 py-0.5 rounded text-label-micro bg-raw-linen text-ink font-label-code">Đồng kiểm khi nhận</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-space-xs">
                    Kiểm tra kiện hàng và phụ kiện niêm phong kỹ lưỡng trước khi thanh toán trực tiếp cho nhân viên vận chuyển Nếp.
                  </p>
</div>
</label>
<!-- Hidden COD Instructions shown when selected -->
<div class="hidden mt-space-sm pt-space-sm border-t border-border flex items-start gap-space-xs text-ink-muted font-body-sm text-body-sm" id="cod-notice">
<span class="material-symbols-outlined text-[18px] text-turmeric shrink-0">inventory_2</span>
<p>Khách hàng được quyền mở đồng kiểm bên ngoài và xem tình trạng niêm phong hộp sản phẩm trước khi chuyển tiền mặt.</p>
</div>
</div>
</div>
</div>
</section>
<!-- RIGHT 5 COLUMNS: Sticky Order Summary -->
<aside class="lg:col-span-5 sticky top-24">
<div class="bg-warm-porcelain rounded-[20px] border border-border p-7 flex flex-col gap-space-md">
<!-- Summary Header -->
<div class="flex items-center justify-between border-b border-border pb-space-sm">
<h2 class="font-headline-3 text-headline-3 text-ink">Đơn hàng của bạn (2)</h2>
<a class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red underline underline-offset-4 decoration-border transition-colors" href="#">Sửa giỏ hàng</a>
</div>
<!-- Product Line Items -->
<div class="flex flex-col gap-space-md py-space-xs">
<!-- Item 1 -->
<div class="flex items-center gap-space-md">
<div class="w-16 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-border">
<img class="w-full h-full object-cover" data-alt="A modern slim Asus Vivobook laptop in slate gray sitting cleanly on a warm wooden editorial workspace desk with soft natural window morning lighting and minimalist architectural composition" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoLJdBf1dpu8A9TUar0Mn1F0OX97KfufRDmwYnGNDLqlMFx-psUMgbqrqKk7WF3kB2F6S0vxFb7r2uaQ81qAGDGY9pvZ-obFnqEVgpBuXxBSUTRZlsDp9QPUI0EFg7gdAYdDV1bckoKQoodEHw4jAiSf6yMUj2fupmXk-Xv0OAy10jUrRX3wLanDIbOgy-Crufeg7yYggLRTeFLYzg6ErDtiuA4Scd9kLymeKy6A"/>
</div>
<div class="flex flex-col flex-1 min-w-0">
<h3 class="font-body-md text-body-md font-medium text-ink truncate">Laptop ASUS Vivobook 14 OLED</h3>
<span class="font-body-sm text-body-sm text-ink-muted">i5 · 16GB · 512GB</span>
<div class="flex items-center justify-between mt-1">
<span class="font-label-code text-body-sm text-ink-faint">Số lượng: 1</span>
<span class="font-label-code text-label-code text-ink font-medium">14.990.000 ₫</span>
</div>
</div>
</div>
<!-- Item 2 -->
<div class="flex items-center gap-space-md">
<div class="w-16 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-border">
<img class="w-full h-full object-cover" data-alt="Premium Sony wireless over-ear noise-cancelling headphones in matte black finish displayed on a neutral stone pedestal under soft artistic studio light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDycE5kquK6fvLtKBUUmzH2svUJlygIyuCo2gFlbdxAp0r8ij-CUFZXKMki5_gwgjbZdfucKFvfUBrFvxLyhO_Rnist8FwYc42Sxy2rRit_zyFpXbKL8FnRriG_xn1VO2LwIRUItU9oxXIcNWg_L7aIH6TK3JLlY6lmPEHv8BFqZzIhpHpK8f7_9qyXKcjxx-oXpKGhr5xm6yj46nQo9fEkKHvudKhQp6L91M1zQ"/>
</div>
<div class="flex flex-col flex-1 min-w-0">
<h3 class="font-body-md text-body-md font-medium text-ink truncate">Tai nghe Sony WH-CH720N</h3>
<span class="font-body-sm text-body-sm text-ink-muted">Đen Cổ Điển</span>
<div class="flex items-center justify-between mt-1">
<span class="font-label-code text-body-sm text-ink-faint">Số lượng: 1</span>
<span class="font-label-code text-label-code text-ink font-medium">2.490.000 ₫</span>
</div>
</div>
</div>
</div>
<div class="h-[1px] w-full bg-border"></div>
<!-- Promotion Voucher Input -->
<div class="flex flex-col gap-space-xs">
<span class="font-label-micro text-label-micro uppercase tracking-wider text-ink-muted">Mã khuyến mãi &amp; Giảm giá</span>
<div class="flex gap-space-xs">
<div class="relative flex-1">
<input class="w-full h-11 px-space-md rounded-xl bg-warm-porcelain border border-border text-ink font-label-code focus:outline-none focus:ring-2 focus:ring-lacquer-red text-body-sm uppercase tracking-wide" id="voucher-input" type="text" value="NEP2025"/>
</div>
<button class="h-11 px-space-md rounded-xl bg-raw-linen border border-border text-ink hover:bg-lacquer-wash text-body-sm font-medium transition-colors" type="button">Áp dụng</button>
</div>
<!-- Applied Voucher Chip -->
<div class="flex items-center justify-between px-space-sm py-1 rounded bg-lacquer-wash/40 border border-lacquer-red/20 text-lacquer-deep mt-1">
<span class="font-label-code text-body-sm font-semibold">NEP2025: Giảm 50.000 ₫</span>
<button class="material-symbols-outlined text-[16px] text-ink-muted hover:text-lacquer-red" title="Xoá mã" type="button">close</button>
</div>
</div>
<div class="h-[1px] w-full bg-border"></div>
<!-- Price Calculation Ledger -->
<dl class="flex flex-col gap-space-xs text-body-sm">
<div class="flex items-center justify-between text-ink-muted">
<dt>Tạm tính (2 món)</dt>
<dd class="font-label-code text-ink font-medium">17.480.000 ₫</dd>
</div>
<div class="flex items-center justify-between text-ink-muted">
<dt>Phí vận chuyển dự kiến</dt>
<dd class="font-label-code text-ink font-medium">30.000 ₫</dd>
</div>
<div class="flex items-center justify-between text-jade">
<dt class="flex items-center gap-1">
<span>Ưu đãi vận chuyển (Freeship Nếp)</span>
</dt>
<dd class="font-label-code font-semibold">-30.000 ₫</dd>
</div>
<div class="flex items-center justify-between text-lacquer-red">
<dt>Voucher giảm giá (NEP2025)</dt>
<dd class="font-label-code font-semibold">-50.000 ₫</dd>
</div>
<div class="h-[1px] w-full bg-border my-space-xs"></div>
<div class="flex items-baseline justify-between pt-space-xs">
<div>
<dt class="font-headline-3 text-headline-3 text-ink">Tổng thanh toán</dt>
<p class="font-label-micro text-label-micro text-ink-faint mt-0.5">(Đã bao gồm VAT &amp; phí kiểm định an tâm)</p>
</div>
<dd class="font-label-code text-[24px] leading-tight font-bold text-lacquer-red tracking-tight" id="final-price-display">
                17.430.000 ₫
              </dd>
</div>
</dl>
<!-- Primary Action Button (Only ONE per visible section) -->
<button class="w-full h-[52px] rounded-xl bg-lacquer-red hover:bg-lacquer-deep active:scale-[0.99] text-warm-porcelain font-headline-3 text-headline-3 font-semibold flex items-center justify-center gap-space-xs transition-all cursor-pointer" id="btn-submit-order" type="button">
<span id="btn-order-text">Đặt hàng ngay (17.430.000 ₫)</span>
<span class="hidden material-symbols-outlined text-[20px] animate-spin" id="btn-order-spinner">progress_activity</span>
</button>
<!-- Trust & Value Signifiers (Authentic Nếp Lines, No fake badges) -->
<div class="grid grid-cols-3 gap-2 py-space-xs border-y border-border text-center text-ink-muted">
<div class="flex flex-col items-center gap-1">
<span class="material-symbols-outlined text-[18px] text-turmeric">local_mall</span>
<span class="font-label-micro text-label-micro font-medium">Shop Việt tuyển</span>
</div>
<div class="flex flex-col items-center gap-1 border-x border-border">
<span class="material-symbols-outlined text-[18px] text-jade">assignment_return</span>
<span class="font-label-micro text-label-micro font-medium">Đổi trả 7 ngày</span>
</div>
<div class="flex flex-col items-center gap-1">
<span class="material-symbols-outlined text-[18px] text-ink-muted">verified_user</span>
<span class="font-label-micro text-label-micro font-medium">Mã hoá an toàn</span>
</div>
</div>
<!-- Legal Disclaimer -->
<p class="font-body-sm text-body-sm text-ink-faint text-center leading-relaxed">
            Bằng cách bấm đặt hàng, bạn đồng ý với 
            <a class="text-ink-muted hover:text-ink underline underline-offset-2" href="#">Điều khoản dịch vụ</a> và 
            <a class="text-ink-muted hover:text-ink underline underline-offset-2" href="#">Chính sách bảo mật</a> của ShopNest.
          </p>
</div>
</aside>
</div>
</div>
</div>
<script>
  // Interactive State Simulation & Micro-Interactions Script
  (function initCheckoutInteractions() {
    const simButtons = document.querySelectorAll('#state-simulator-bar button');
    const savedCard = document.getElementById('saved-address-card');
    const addressForm = document.getElementById('checkout-address-form');
    const errorBanner = document.getElementById('address-error-banner');
    const orderBtn = document.getElementById('btn-submit-order');
    const orderBtnText = document.getElementById('btn-order-text');
    const orderSpinner = document.getElementById('btn-order-spinner');
    const formModeInd = document.getElementById('form-mode-indicator');
    const stripeBox = document.getElementById('stripe-container');
    const codBox = document.getElementById('cod-container');
    const stripeInputs = document.getElementById('stripe-nested-inputs');
    const codNotice = document.getElementById('cod-notice');

    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    const shippingRadios = document.querySelectorAll('input[name="shipping_method"]');
    const shippingLabels = document.querySelectorAll('.shipping-option');

    function setActiveSimBtn(activeKey) {
      simButtons.forEach(btn => {
        if (btn.getAttribute('data-state-btn') === activeKey) {
          btn.className = 'px-3 py-1 rounded-full text-body-sm bg-lacquer-red text-warm-porcelain font-semibold transition-all';
        } else {
          btn.className = 'px-3 py-1 rounded-full text-body-sm bg-warm-porcelain border border-border text-ink hover:bg-lacquer-wash/50 transition-all';
        }
      });
    }

    // Shipping selection feedback
    shippingRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        shippingLabels.forEach(lbl => {
          lbl.classList.remove('border-2', 'border-lacquer-red', 'bg-lacquer-wash/25');
          lbl.classList.add('border', 'border-border', 'bg-warm-porcelain');
        });
        const currentLabel = e.target.closest('label');
        if (currentLabel) {
          currentLabel.classList.remove('border', 'border-border', 'bg-warm-porcelain');
          currentLabel.classList.add('border-2', 'border-lacquer-red', 'bg-lacquer-wash/25');
        }
      });
    });

    // Payment Selection Feedback
    function setPaymentMethod(method) {
      if (method === 'stripe') {
        stripeBox.classList.add('border-2', 'border-lacquer-red', 'bg-lacquer-wash/20');
        stripeBox.classList.remove('border', 'border-border', 'bg-warm-porcelain');
        stripeInputs.classList.remove('hidden');

        codBox.classList.remove('border-2', 'border-lacquer-red', 'bg-lacquer-wash/20');
        codBox.classList.add('border', 'border-border', 'bg-warm-porcelain');
        codNotice.classList.add('hidden');
        document.querySelector('input[value="stripe"]').checked = true;
      } else {
        codBox.classList.add('border-2', 'border-lacquer-red', 'bg-lacquer-wash/20');
        codBox.classList.remove('border', 'border-border', 'bg-warm-porcelain');
        codNotice.classList.remove('hidden');

        stripeBox.classList.remove('border-2', 'border-lacquer-red', 'bg-lacquer-wash/20');
        stripeBox.classList.add('border', 'border-border', 'bg-warm-porcelain');
        stripeInputs.classList.add('hidden');
        document.querySelector('input[value="cod"]').checked = true;
      }
    }

    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        setPaymentMethod(e.target.value);
      });
    });

    // State Simulator Handlers
    simButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const state = btn.getAttribute('data-state-btn');
        setActiveSimBtn(state);

        // Reset baseline
        errorBanner.classList.add('hidden');
        document.querySelectorAll('.field-error-msg').forEach(el => el.classList.add('hidden'));
        orderSpinner.classList.add('hidden');
        orderBtn.disabled = false;
        orderBtnText.textContent = "Đặt hàng ngay (17.430.000 ₫)";

        if (state === 'default') {
          savedCard.classList.remove('hidden');
          addressForm.classList.remove('hidden');
          formModeInd.textContent = "Đang chỉnh sửa";
          setPaymentMethod('stripe');
        } else if (state === 'empty') {
          savedCard.classList.add('hidden');
          addressForm.classList.remove('hidden');
          addressForm.reset();
          document.getElementById('full_name').value = '';
          document.getElementById('phone_number').value = '';
          document.getElementById('specific_address').value = '';
          formModeInd.textContent = "Thêm địa chỉ mới";
          setPaymentMethod('stripe');
        } else if (state === 'error') {
          savedCard.classList.add('hidden');
          addressForm.classList.remove('hidden');
          errorBanner.classList.remove('hidden');
          document.querySelectorAll('.field-error-msg').forEach(el => el.classList.remove('hidden'));
          document.getElementById('phone_number').classList.add('border-brick');
          document.getElementById('full_name').classList.add('border-brick');
        } else if (state === 'processing') {
          orderSpinner.classList.remove('hidden');
          orderBtnText.textContent = "Đang xác thực bảo mật Stripe...";
          orderBtn.disabled = true;
        } else if (state === 'cod') {
          setPaymentMethod('cod');
          orderBtnText.textContent = "Xác nhận đặt hàng COD";
        }
      });
    });

    // Toggle manual add address
    const toggleAddBtn = document.getElementById('btn-toggle-new-address');
    if (toggleAddBtn) {
      toggleAddBtn.addEventListener('click', () => {
        savedCard.classList.toggle('hidden');
        addressForm.reset();
        document.getElementById('full_name').value = '';
        document.getElementById('phone_number').value = '';
        document.getElementById('specific_address').value = '';
        formModeInd.textContent = "Địa chỉ nhận hàng mới";
      });
    }

    const editAddressBtn = document.getElementById('btn-edit-address');
    if (editAddressBtn) {
      editAddressBtn.addEventListener('click', () => {
        addressForm.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('full_name').focus();
      });
    }

    // Button submit feedback
    orderBtn.addEventListener('click', () => {
      if (orderBtn.disabled) return;
      orderBtn.disabled = true;
      orderSpinner.classList.remove('hidden');
      orderBtnText.textContent = "Đang kết nối cổng thanh toán...";
      setTimeout(() => {
        orderSpinner.classList.add('hidden');
        orderBtnText.textContent = "Đơn hàng #NEP-98822 thành công!";
        orderBtn.classList.remove('bg-lacquer-red');
        orderBtn.classList.add('bg-jade');
      }, 1500);
    });

  })();
</script></main><footer class="w-full bg-rice-paper border-t border-border mt-auto"><div class="w-full max-w-7xl mx-auto px-gutter py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md text-body-sm text-ink-muted"><div class="flex items-center gap-space-sm"><span class="material-symbols-outlined text-turmeric text-[18px]">support_agent</span><span>Tổng đài CSKH:</span><a class="font-label-code text-label-code text-lacquer-red font-semibold hover:underline" href="tel:19006886">1900 6886</a><span class="text-border">|</span><span class="font-label-micro text-label-micro uppercase">Hỗ trợ 24/7</span></div><div class="flex items-center gap-space-lg font-body-sm text-body-sm"><a class="text-ink-muted hover:text-ink transition-colors" data-path="terms-of-service" href="#">Điều khoản dịch vụ</a><a class="text-ink-muted hover:text-ink transition-colors" data-path="privacy-policy" href="#">Chính sách bảo mật</a><a class="text-ink-muted hover:text-ink transition-colors" data-path="buyer-protection" href="#">Quy chế bảo vệ người mua</a></div><div class="font-label-micro text-label-micro text-ink-faint">© 2025 ShopNest. Bảo lưu mọi quyền.</div></div></footer></body></html>
```
### S06 - Kết quả thanh toán và hoàn tất đơn hàng
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{"colors":{"turmeric":"#8A5A1A","secondary-fixed-dim":"#cbc6bf","ink":"#1D1B17","ink-faint":"#9A8F7F","outline":"#8c716d","lacquer-wash":"#F2DCD5","brick":"#8B2A24","on-primary-container":"#ffd9d3","outline-variant":"#dfbfbb","surface-container":"#f2ede2","on-surface-variant":"#58413e","on-secondary-container":"#67645f","surface-container-highest":"#e7e2d7","on-error-container":"#93000a","jade":"#2F6B57","surface-dim":"#dedacf","on-tertiary-fixed-variant":"#4b463a","on-primary":"#ffffff","on-error":"#ffffff","secondary-container":"#e8e2db","rice-paper":"#F6F1E6","surface-container-high":"#ede8dd","inverse-surface":"#323029","surface-tint":"#aa342a","on-primary-fixed-variant":"#891c16","primary-fixed":"#ffdad5","surface-variant":"#e7e2d7","primary-container":"#b23a2f","error-container":"#ffdad6","tertiary-fixed":"#eae2d1","secondary":"#615e59","primary":"#91221a","secondary-fixed":"#e8e2db","surface":"#fef9ee","border":"#DCD1BE","tertiary":"#514b3f","surface-container-low":"#f8f3e8","on-tertiary-container":"#e9e0cf","on-secondary":"#ffffff","on-surface":"#1d1c15","on-secondary-fixed":"#1d1b17","surface-bright":"#fef9ee","background":"#fef9ee","on-background":"#1d1c15","on-tertiary-fixed":"#1f1b11","on-tertiary":"#ffffff","lacquer-red":"#B23A2F","primary-fixed-dim":"#ffb4aa","lacquer-deep":"#8C2A22","logo-blue":"#4991D8","inverse-primary":"#ffb4aa","warm-porcelain":"#FFFCF4","inverse-on-surface":"#f5f0e5","error":"#ba1a1a","tertiary-container":"#696356","ink-muted":"#6B6458","on-primary-fixed":"#410001","raw-linen":"#EDE4D3","tertiary-fixed-dim":"#cec6b5","on-secondary-fixed-variant":"#494641","surface-container-lowest":"#ffffff"},"borderRadius":{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},"spacing":{"space-sm":"0.5rem","margin":"3rem","space-lg":"1.5rem","gutter":"1.5rem","space-md":"1rem","space-xl":"2.5rem","margin-mobile":"1.25rem","space-xs":"0.25rem","gutter-mobile":"1rem"},"fontFamily":{"headline-3":["Be Vietnam Pro"],"display-xl":["Newsreader"],"body-md":["Be Vietnam Pro"],"headline-2":["Newsreader"],"display-xl-mobile":["Newsreader"],"display-lg":["Newsreader"],"display-lg-mobile":["Newsreader"],"label-code":["JetBrains Mono"],"headline-1":["Newsreader"],"label-micro":["Be Vietnam Pro"],"body-sm":["Be Vietnam Pro"],"body-lg":["Be Vietnam Pro"]},"fontSize":{"headline-3":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}],"display-xl":["64px",{"lineHeight":"60px","letterSpacing":"-0.035em","fontWeight":"600"}],"body-md":["16px",{"lineHeight":"26px","fontWeight":"400"}],"headline-2":["28px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"600"}],"display-xl-mobile":["40px",{"lineHeight":"40px","letterSpacing":"-0.03em","fontWeight":"600"}],"display-lg":["48px",{"lineHeight":"48px","letterSpacing":"-0.03em","fontWeight":"600"}],"display-lg-mobile":["32px",{"lineHeight":"34px","letterSpacing":"-0.025em","fontWeight":"600"}],"label-code":["14px",{"lineHeight":"20px","fontWeight":"500"}],"headline-1":["36px",{"lineHeight":"40px","letterSpacing":"-0.025em","fontWeight":"600"}],"label-micro":["12px",{"lineHeight":"16px","letterSpacing":"0.12em","fontWeight":"600"}],"body-sm":["14px",{"lineHeight":"21px","fontWeight":"400"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}]}}}};</script></head><body class="bg-rice-paper font-body-md text-ink antialiased"><header class="fixed top-0 left-0 w-full z-50 bg-rice-paper/95 backdrop-blur-md border-b border-border"><div class="h-20 w-full px-gutter max-w-7xl mx-auto flex items-center justify-between gap-space-md"><div class="flex items-center gap-space-md"><a class="flex items-center gap-space-sm group" data-path="s05-thanh-toan-shopnest-desktop" href="#"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><div class="flex flex-col"><span class="font-headline-3 text-headline-3 text-ink tracking-tight">ShopNest</span><span class="font-label-micro text-label-micro text-ink-muted uppercase tracking-wider">Thanh toán an tâm</span></div></a></div><nav class="hidden md:flex items-center gap-space-md text-body-sm" data-active-classes="text-lacquer-red font-semibold"><a class="text-ink-muted hover:text-ink transition-colors" data-path="cart" href="#">1. Giỏ hàng</a><span class="text-border font-label-code">/</span><a class="text-ink-muted hover:text-ink transition-colors" data-path="s05-thanh-toan-shopnest-desktop" href="#">2. Thông tin &amp; Thanh toán</a><span class="text-border font-label-code">/</span><a class="text-ink-muted hover:text-ink transition-colors" data-path="s06-ket-qua-thanh-toan-hoan-tat-don-hang" href="#">3. Hoàn tất đơn</a></nav><div class="flex items-center gap-space-md"><div class="flex items-center gap-space-xs text-jade py-space-xs px-space-sm bg-warm-porcelain rounded-full border border-border"><span class="material-symbols-outlined text-[18px]">verified_user</span><span class="font-label-micro text-label-micro text-jade uppercase font-semibold hidden sm:inline-block">Thanh toán bảo mật</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-rice-paper min-h-[calc(100vh-140px)]"><div class="flex flex-col w-full">
<!-- Interactive State Switcher Tool Bar (Tĩnh tại & trang nhã) -->
<div class="w-full bg-raw-linen/60 px-gutter py-space-sm">
<div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-body-sm">
<div class="flex items-center gap-space-xs text-ink-muted">
<span class="material-symbols-outlined text-[18px]">tune</span>
<span class="font-label-micro uppercase tracking-wider text-ink-muted">Mô phỏng phản hồi cổng thanh toán:</span>
</div>
<div class="inline-flex p-1 bg-warm-porcelain rounded-lg gap-1" id="state-tabs">
<button class="px-3 py-1.5 rounded text-body-sm font-medium transition-all bg-rice-paper text-lacquer-red font-semibold" id="tab-success" onclick="switchState('success')" type="button">
          1. Thành công (Stripe)
        </button>
<button class="px-3 py-1.5 rounded text-body-sm font-medium text-ink-muted hover:text-ink transition-all" id="tab-pending" onclick="switchState('pending')" type="button">
          2. Đang chờ (Pending)
        </button>
<button class="px-3 py-1.5 rounded text-body-sm font-medium text-ink-muted hover:text-ink transition-all" id="tab-failure" onclick="switchState('failure')" type="button">
          3. Thất bại (Failure)
        </button>
<button class="px-3 py-1.5 rounded text-body-sm font-medium text-ink-muted hover:text-ink transition-all" id="tab-cod" onclick="switchState('cod')" type="button">
          4. Xác nhận COD
        </button>
</div>
</div>
</div>
<!-- Main Editorial Canvas -->
<div class="w-full max-w-7xl mx-auto px-gutter py-margin">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 items-start">
<!-- CỘT THÔNG BÁO KẾT QUẢ: 560px max, left-aligned, trên nền Giấy Gạo Rice Paper -->
<section class="lg:col-span-5 max-w-[560px] flex flex-col pt-2">
<!-- Breadcrumb / Hierarchy Indicator -->
<div class="flex items-center gap-2 mb-space-md text-ink-muted font-label-micro uppercase tracking-widest">
<span class="font-label-code text-label-code text-ink-faint">ĐƠN HÀNG TRỰC TUYẾN</span>
<span class="text-ink-faint">/</span>
<span class="text-jade font-semibold" id="badge-substatus">GIAO DỊCH HOÀN TẤT</span>
</div>
<!-- Trạng thái 1: SUCCESS (Mặc định) -->
<div class="state-panel flex flex-col" id="state-success">
<!-- Icon tròn Jade Checkmark -->
<div class="w-14 h-14 rounded-full bg-jade/10 flex items-center justify-center mb-space-md">
<span class="material-symbols-outlined text-jade text-[32px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<h1 class="font-headline-1 text-headline-1 text-ink tracking-tight mb-space-xs">
            Đơn hàng đã được đặt
          </h1>
<p class="font-body-md text-body-md text-ink-muted mb-space-lg">
            ShopNest đã tiếp nhận thông tin và người bán sẽ xác nhận đơn trong ít phút.
          </p>
<!-- Order Code Stamp Bar -->
<div class="bg-warm-porcelain p-space-md rounded-xl mb-space-lg flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-micro text-label-micro text-ink-faint uppercase">Mã tham chiếu đơn</span>
<span class="font-label-code text-lg text-ink font-semibold tracking-wide">#SN-24817</span>
</div>
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rice-paper text-ink hover:text-lacquer-red text-body-sm transition-colors" onclick="copyOrderCode('#SN-24817', this)" type="button">
<span class="material-symbols-outlined text-[16px]">content_copy</span>
<span class="font-label-micro uppercase">Sao chép</span>
</button>
</div>
<!-- Notification Notice -->
<div class="flex items-start gap-3 p-4 bg-warm-porcelain/60 rounded-xl mb-space-xl">
<span class="material-symbols-outlined text-ink-muted text-[20px] mt-0.5">mark_email_read</span>
<div class="flex flex-col">
<span class="text-body-sm text-ink font-medium">Xác nhận đơn qua hòm thư điện tử</span>
<span class="text-body-sm text-ink-muted">Bản sao hoá đơn và lộ trình kiện hàng đã gửi tới <strong class="text-ink font-medium">thuha.nguyen@gmail.com</strong>.</span>
</div>
</div>
<!-- CTAs -->
<div class="flex items-center gap-space-md">
<a class="h-12 px-space-lg bg-lacquer-red hover:bg-lacquer-deep active:scale-[0.98] text-warm-porcelain rounded-xl font-body-md font-medium inline-flex items-center justify-center transition-all" href="#">
              Theo dõi đơn
            </a>
<a class="h-12 px-space-lg bg-transparent hover:bg-lacquer-wash text-ink rounded-xl font-body-md font-medium inline-flex items-center justify-center transition-colors" href="#">
              Tiếp tục mua sắm
            </a>
</div>
</div>
<!-- Trạng thái 2: PENDING (Chờ thanh toán) -->
<div class="state-panel hidden flex-col" id="state-pending">
<!-- Icon tròn Turmeric Clock -->
<div class="w-14 h-14 rounded-full bg-turmeric/10 flex items-center justify-center mb-space-md">
<span class="material-symbols-outlined text-turmeric text-[32px]">schedule</span>
</div>
<h1 class="font-headline-1 text-headline-1 text-ink tracking-tight mb-space-xs">
            Đang chờ thanh toán
          </h1>
<p class="font-body-md text-body-md text-ink-muted mb-space-lg">
            Hệ thống đang đồng bộ kết quả xác thực từ cổng quốc tế Stripe. Chúng tôi sẽ cập nhật trạng thái ngay khi có hồi đáp.
          </p>
<!-- Order Code Stamp Bar -->
<div class="bg-warm-porcelain p-space-md rounded-xl mb-space-lg flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-micro text-label-micro text-ink-faint uppercase">Mã tham chiếu đơn</span>
<span class="font-label-code text-lg text-ink font-semibold tracking-wide">#SN-24817</span>
</div>
<span class="inline-flex items-center gap-1.5 px-3 py-1 bg-turmeric/10 text-turmeric text-body-sm rounded-full font-medium">
<span class="w-2 h-2 rounded-full bg-turmeric animate-pulse"></span>
              Đang xác minh
            </span>
</div>
<div class="p-4 bg-warm-porcelain/60 rounded-xl mb-space-xl flex items-start gap-3">
<span class="material-symbols-outlined text-turmeric text-[20px] mt-0.5">info</span>
<div class="flex flex-col text-body-sm">
<span class="text-ink font-medium">Lưu ý về tiến trình xử lý</span>
<span class="text-ink-muted">Nếu bạn đã bị trừ tiền trong tài khoản thẻ nhưng màn hình chưa chuyển, vui lòng chờ trong 1–3 phút hoặc bấm nút kiểm tra lại.</span>
</div>
</div>
<!-- CTAs -->
<div class="flex items-center gap-space-md">
<button class="h-12 px-space-lg bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain rounded-xl font-body-md font-medium inline-flex items-center justify-center transition-all" type="button">
              Xem đơn hàng
            </button>
<button class="h-12 px-space-lg bg-transparent hover:bg-lacquer-wash text-ink rounded-xl font-body-md font-medium inline-flex items-center justify-center transition-colors" onclick="fakeReload()" type="button">
<span class="material-symbols-outlined text-[18px] mr-1.5">refresh</span>
              Kiểm tra lại trạng thái
            </button>
</div>
</div>
<!-- Trạng thái 3: FAILURE (Lỗi thanh toán) -->
<div class="state-panel hidden flex-col" id="state-failure">
<!-- Icon tròn Brick Alert -->
<div class="w-14 h-14 rounded-full bg-brick/10 flex items-center justify-center mb-space-md">
<span class="material-symbols-outlined text-brick text-[32px]">error_outline</span>
</div>
<h1 class="font-headline-1 text-headline-1 text-ink tracking-tight mb-space-xs">
            Thanh toán chưa hoàn tất
          </h1>
<p class="font-body-md text-body-md text-ink-muted mb-space-lg">
            Đơn hàng vẫn được giữ trong <strong>15 phút</strong> để bạn thực hiện lại giao dịch mà không lo hết hàng.
          </p>
<!-- Reason Callout -->
<div class="p-space-md bg-lacquer-wash/50 rounded-xl mb-space-lg flex items-start gap-3">
<span class="material-symbols-outlined text-brick text-[20px] mt-0.5">warning</span>
<div class="flex flex-col">
<span class="font-body-sm font-semibold text-brick">Nguyên nhân khả dĩ:</span>
<span class="text-body-sm text-ink-muted">Thẻ ngân hàng bị từ chối xác thực 3D-Secure hoặc kết nối mạng gián đoạn từ phía cổng thanh toán.</span>
</div>
</div>
<div class="bg-warm-porcelain p-space-md rounded-xl mb-space-xl flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-micro text-label-micro text-ink-faint uppercase">Mã đơn giữ chỗ</span>
<span class="font-label-code text-lg text-ink font-semibold tracking-wide">#SN-24817</span>
</div>
<div class="font-label-code text-sm text-brick bg-brick/10 px-2.5 py-1 rounded">
              Còn lại: 14:38
            </div>
</div>
<!-- CTAs -->
<div class="flex items-center gap-space-md">
<button class="h-12 px-space-lg bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain rounded-xl font-body-md font-medium inline-flex items-center justify-center transition-all" type="button">
              Thử thanh toán lại
            </button>
<button class="h-12 px-space-lg bg-transparent hover:bg-lacquer-wash text-ink rounded-xl font-body-md font-medium inline-flex items-center justify-center transition-colors" onclick="switchState('cod')" type="button">
              Chọn cách khác (COD)
            </button>
</div>
</div>
<!-- Trạng thái 4: COD CONFIRMED -->
<div class="state-panel hidden flex-col" id="state-cod">
<!-- Icon Hộp kiện / Checkmark COD -->
<div class="w-14 h-14 rounded-full bg-jade/10 flex items-center justify-center mb-space-md">
<span class="material-symbols-outlined text-jade text-[32px]">inventory_2</span>
</div>
<h1 class="font-headline-1 text-headline-1 text-ink tracking-tight mb-space-xs">
            Đặt hàng COD thành công
          </h1>
<p class="font-body-md text-body-md text-ink-muted mb-space-lg">
            Đơn hàng đã được chuyển sang chế độ thanh toán tiền mặt trực tiếp khi người giao hàng trao kiện.
          </p>
<!-- Order Code Stamp Bar -->
<div class="bg-warm-porcelain p-space-md rounded-xl mb-space-lg flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-micro text-label-micro text-ink-faint uppercase">Mã tham chiếu đơn</span>
<span class="font-label-code text-lg text-ink font-semibold tracking-wide">#SN-24817</span>
</div>
<button class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rice-paper text-ink hover:text-lacquer-red text-body-sm transition-colors" onclick="copyOrderCode('#SN-24817', this)" type="button">
<span class="material-symbols-outlined text-[16px]">content_copy</span>
<span class="font-label-micro uppercase">Sao chép</span>
</button>
</div>
<!-- Cash on Hand Reminder -->
<div class="p-space-md bg-warm-porcelain rounded-xl mb-space-xl flex flex-col gap-2">
<div class="flex items-center gap-2 text-jade font-medium text-body-sm">
<span class="material-symbols-outlined text-[18px]">verified</span>
<span>Được quyền đồng kiểm khi nhận</span>
</div>
<p class="text-body-sm text-ink-muted leading-relaxed">
              Quý khách vui lòng chuẩn bị đúng số tiền <span class="font-label-code font-semibold text-ink">17.430.000 ₫</span> khi nhận hàng. Được quyền đồng kiểm kiện hàng bên ngoài trước khi thanh toán.
            </p>
</div>
<!-- CTAs -->
<div class="flex items-center gap-space-md">
<a class="h-12 px-space-lg bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain rounded-xl font-body-md font-medium inline-flex items-center justify-center transition-all" href="#">
              Theo dõi đơn
            </a>
<a class="h-12 px-space-lg bg-transparent hover:bg-lacquer-wash text-ink rounded-xl font-body-md font-medium inline-flex items-center justify-center transition-colors" href="#">
              Tiếp tục mua sắm
            </a>
</div>
</div>
<!-- Trust & Security Pillars (Trang nghiêm, tinh giản) -->
<div class="mt-space-xl pt-space-lg grid grid-cols-2 gap-4 text-ink-muted">
<div class="flex items-start gap-2.5">
<span class="material-symbols-outlined text-jade text-[20px] shrink-0">local_shipping</span>
<div class="flex flex-col">
<span class="text-body-sm font-medium text-ink">Đóng gói chuẩn Nếp</span>
<span class="text-xs text-ink-faint">Chống sốc tái chế 3 lớp</span>
</div>
</div>
<div class="flex items-start gap-2.5">
<span class="material-symbols-outlined text-turmeric text-[20px] shrink-0">published_with_changes</span>
<div class="flex flex-col">
<span class="text-body-sm font-medium text-ink">Đổi trả 15 ngày</span>
<span class="text-xs text-ink-faint">Nguyên tem mác niêm phong</span>
</div>
</div>
</div>
</section>
<!-- BẢNG TÓM TẮT ĐƠN HÀNG (Order Summary Ledger Panel) -->
<!-- Bề mặt Warm Porcelain, sổ sách kỷ luật, JetBrains Mono cho số liệu -->
<section class="lg:col-span-7 w-full bg-warm-porcelain rounded-2xl p-space-lg md:p-8">
<!-- Header Panel Sổ sách -->
<div class="flex items-center justify-between pb-space-md">
<div class="flex items-center gap-space-xs">
<span class="material-symbols-outlined text-ink text-[22px]">receipt_long</span>
<h2 class="font-headline-3 text-headline-3 text-ink">Chi tiết sổ sách đơn hàng</h2>
</div>
<span class="font-label-code text-xs text-ink-muted">NGÀY: 28/05/2025 · 14:26 GMT+7</span>
</div>
<!-- 1. Danh sách sản phẩm (Line items) -->
<div class="py-space-md flex flex-col gap-4">
<div class="flex items-center justify-between text-ink-muted font-label-micro uppercase tracking-wider">
<span>Mặt hàng</span>
<span>Thành tiền</span>
</div>
<!-- Item 1: Laptop Asus Vivobook -->
<div class="flex items-start gap-4 py-2">
<div class="w-16 h-20 rounded-lg overflow-hidden bg-rice-paper shrink-0">
<img class="w-full h-full object-cover" data-alt="Minimalist top view of ASUS Vivobook laptop on a textured warm linen fabric surface, warm studio directional lighting, neutral studio background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA56O5nQCxnvSoMrBpfYk4bvjLUPo3B3hLLIHlFtfwKf95aOjSXpXSFO2rl93Hz4zSlgQClduIJ6YwwaDKS2w6K0GnR0NHaiYFUZDeRmJYc5GSxn5_oPLVDASnXYvZwdXsjWV64Ekn9_9iWQIc10ApspTrWk2znadSSrg_ty3BFxFmhKLH_d5UjvjHccOd7wP9mLwCBzcYzp7RSGJvMN6eUxzlG9bKUqaJ73wkT2w"/>
</div>
<div class="flex flex-col flex-1 min-w-0">
<span class="font-label-micro uppercase text-turmeric font-semibold">TechNest Official</span>
<h3 class="font-body-md text-ink font-medium leading-snug line-clamp-1">Laptop ASUS Vivobook 14 OLED (M1405VA)</h3>
<p class="text-xs text-ink-muted mt-0.5">Cấu hình: i5 · 16GB · 512GB SSD</p>
<div class="flex items-center gap-2 mt-1">
<span class="text-xs text-ink-muted">Số lượng: <strong class="text-ink">1</strong></span>
</div>
</div>
<div class="text-right shrink-0">
<span class="font-label-code text-body-md text-ink font-semibold">14.990.000 ₫</span>
</div>
</div>
<!-- Item 2: Tai nghe Sony WH-CH720N -->
<div class="flex items-start gap-4 py-2">
<div class="w-16 h-20 rounded-lg overflow-hidden bg-rice-paper shrink-0">
<img class="w-full h-full object-cover" data-alt="Sony over-ear wireless headphones resting on natural wood desk beside an open book, soft warm daylight, high resolution editorial photograph" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB18_NDnsSChr1ZBJStge1iEZhbn2W05eyOeMWxjr7cJV3odh6Xsk3Gbv_zJYxw6TwbIQ8MCzX-N8BgbQdFkxPd35aDAWMlg4nXJrJOgNWJfz8X4-3Dj8s-f8dF9I13excgwfRMvW0RH_EouByxWXu8OS1vkIFATk2n17OM5Bq19wS9eBg-unRnZLoerTIvVlHxfUI7rrHZN5ITzkV2jRUD4PJSoCii9NmUfrSv_w"/>
</div>
<div class="flex flex-col flex-1 min-w-0">
<span class="font-label-micro uppercase text-turmeric font-semibold">TechNest Official</span>
<h3 class="font-body-md text-ink font-medium leading-snug line-clamp-1">Tai nghe không dây Sony WH-CH720N</h3>
<p class="text-xs text-ink-muted mt-0.5">Màu sắc: Đen nhám (Matte Black)</p>
<div class="flex items-center gap-2 mt-1">
<span class="text-xs text-ink-muted">Số lượng: <strong class="text-ink">1</strong></span>
</div>
</div>
<div class="text-right shrink-0">
<span class="font-label-code text-body-md text-ink font-semibold">2.490.000 ₫</span>
</div>
</div>
</div>
<!-- 2. Thông tin giao nhận & Thanh toán (2-Column Ledger Row) -->
<div class="py-space-md grid grid-cols-1 md:grid-cols-2 gap-space-md text-body-sm">
<!-- Khối Giao nhận -->
<div class="flex flex-col p-4 bg-rice-paper/50 rounded-xl">
<div class="flex items-center gap-1.5 text-ink font-medium mb-2">
<span class="material-symbols-outlined text-[18px] text-ink-muted">pin_drop</span>
<span>Địa chỉ nhận hàng</span>
</div>
<p class="font-semibold text-ink">Nguyễn Thu Hà <span class="font-label-code font-normal text-ink-muted text-xs">· 0912 345 678</span></p>
<p class="text-ink-muted text-xs leading-relaxed mt-1">
              Số 18, Ngõ 42, Phố Tràng Tiền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội
            </p>
<div class="mt-3 pt-2 text-xs flex items-center justify-between text-ink-faint">
<span>Đơn vị giao vận:</span>
<span class="font-medium text-ink">Giao tiêu chuẩn Nếp (2–4 ngày)</span>
</div>
</div>
<!-- Khối Hình thức thanh toán -->
<div class="flex flex-col p-4 bg-rice-paper/50 rounded-xl justify-between">
<div>
<div class="flex items-center gap-1.5 text-ink font-medium mb-2">
<span class="material-symbols-outlined text-[18px] text-ink-muted">credit_card</span>
<span>Phương thức thanh toán</span>
</div>
<div class="flex items-center gap-2 text-ink" id="summary-payment-desc">
<span class="w-8 h-5 bg-warm-porcelain rounded flex items-center justify-center font-label-code text-[11px] font-bold text-ink">VISA</span>
<span class="font-label-code text-sm">•••• 4242 (Stripe gateway)</span>
</div>
</div>
<div class="mt-3 pt-2 text-xs flex items-center justify-between">
<span class="text-ink-faint">Trạng thái ghi nhận:</span>
<span class="font-semibold text-jade font-label-code" id="summary-payment-status">ĐÃ XÁC THỰC</span>
</div>
</div>
</div>
<!-- 3. Bảng kê chi phí minh bạch (Ledger breakdown) -->
<div class="pt-space-md flex flex-col gap-2.5">
<div class="flex items-center justify-between text-body-sm text-ink-muted">
<span>Tạm tính hàng hoá</span>
<span class="font-label-code text-ink">17.480.000 ₫</span>
</div>
<div class="flex items-center justify-between text-body-sm text-ink-muted">
<span>Phí vận chuyển giao tận nơi</span>
<span class="font-label-code text-ink">30.000 ₫</span>
</div>
<div class="flex items-center justify-between text-body-sm">
<span class="text-jade flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">local_offer</span>
              Ưu đãi Freeship Nếp
            </span>
<span class="font-label-code text-jade font-medium">-30.000 ₫</span>
</div>
<div class="flex items-center justify-between text-body-sm">
<span class="text-ink-muted flex items-center gap-1">
<span class="material-symbols-outlined text-[16px] text-lacquer-red">confirmation_number</span>
              Mã giảm giá <span class="font-label-code text-xs px-1.5 py-0.5 rounded bg-rice-paper text-lacquer-red">NEP2025</span>
</span>
<span class="font-label-code text-lacquer-red font-medium">-50.000 ₫</span>
</div>
<!-- Đường chốt sổ sách -->
<div class="pt-3 mt-2 flex items-baseline justify-between">
<div class="flex flex-col">
<span class="font-headline-3 text-headline-3 text-ink">Tổng thanh toán</span>
<span class="text-xs text-ink-faint font-normal">Đã bao gồm thuế GTGT &amp; bảo hiểm kiện hàng</span>
</div>
<div class="text-right">
<span class="font-label-code text-2xl font-bold text-ink" id="ledger-total-amount">17.430.000 ₫</span>
</div>
</div>
</div>
<!-- Footer Note -->
<div class="mt-space-lg pt-4 flex items-center justify-between text-xs text-ink-faint">
<span class="flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">lock</span>
            Mã hoá giao dịch TLS 256-bit
          </span>
<a class="text-ink-muted hover:text-lacquer-red underline decoration-1 underline-offset-4" href="#">Tải biên lai PDF (.pdf)</a>
</div>
</section>
</div>
</div>
</div>
<script>
  function switchState(state) {
    // Hide all state panels
    const states = ['success', 'pending', 'failure', 'cod'];
    states.forEach(s => {
      const panel = document.getElementById('state-' + s);
      const tab = document.getElementById('tab-' + s);
      if (panel) panel.classList.add('hidden');
      if (tab) {
        tab.className = "px-3 py-1.5 rounded text-body-sm font-medium text-ink-muted hover:text-ink transition-all";
      }
    });

    // Show target panel & highlight tab
    const targetPanel = document.getElementById('state-' + state);
    const targetTab = document.getElementById('tab-' + state);
    if (targetPanel) {
      targetPanel.classList.remove('hidden');
      targetPanel.classList.add('flex');
    }
    if (targetTab) {
      targetTab.className = "px-3 py-1.5 rounded text-body-sm font-semibold transition-all bg-rice-paper text-lacquer-red";
    }

    // Dynamic update ledger panel labels
    const badgeSubstatus = document.getElementById('badge-substatus');
    const paymentDesc = document.getElementById('summary-payment-desc');
    const paymentStatus = document.getElementById('summary-payment-status');
    const totalAmount = document.getElementById('ledger-total-amount');

    if (state === 'success') {
      badgeSubstatus.innerText = "GIAO DỊCH HOÀN TẤT";
      badgeSubstatus.className = "text-jade font-semibold";
      paymentDesc.innerHTML = `
        <span class="w-8 h-5 bg-warm-porcelain rounded flex items-center justify-center font-label-code text-[11px] font-bold text-ink">VISA</span>
        <span class="font-label-code text-sm">•••• 4242 (Stripe gateway)</span>
      `;
      paymentStatus.innerText = "ĐÃ XÁC THỰC";
      paymentStatus.className = "font-semibold text-jade font-label-code";
      totalAmount.className = "font-label-code text-2xl font-bold text-ink";
    } else if (state === 'pending') {
      badgeSubstatus.innerText = "ĐANG ĐỒNG BỘ CỔNG";
      badgeSubstatus.className = "text-turmeric font-semibold";
      paymentDesc.innerHTML = `
        <span class="w-8 h-5 bg-warm-porcelain rounded flex items-center justify-center font-label-code text-[11px] font-bold text-ink">VISA</span>
        <span class="font-label-code text-sm">•••• 4242 (Chờ phản hồi)</span>
      `;
      paymentStatus.innerText = "CHỜ DUYỆT (PENDING)";
      paymentStatus.className = "font-semibold text-turmeric font-label-code";
      totalAmount.className = "font-label-code text-2xl font-bold text-ink";
    } else if (state === 'failure') {
      badgeSubstatus.innerText = "GIAO DỊCH LỖI";
      badgeSubstatus.className = "text-brick font-semibold";
      paymentDesc.innerHTML = `
        <span class="w-8 h-5 bg-warm-porcelain rounded flex items-center justify-center font-label-code text-[11px] font-bold text-brick">VISA</span>
        <span class="font-label-code text-sm text-brick">Giao dịch bị từ chối</span>
      `;
      paymentStatus.innerText = "CHƯA THANH TOÁN";
      paymentStatus.className = "font-semibold text-brick font-label-code";
      totalAmount.className = "font-label-code text-2xl font-bold text-brick";
    } else if (state === 'cod') {
      badgeSubstatus.innerText = "GIAO HÀNG THU TIỀN (COD)";
      badgeSubstatus.className = "text-jade font-semibold";
      paymentDesc.innerHTML = `
        <span class="material-symbols-outlined text-[18px] text-turmeric">payments</span>
        <span class="font-body-sm font-medium">Tiền mặt khi giao tận tay (COD)</span>
      `;
      paymentStatus.innerText = "THANH TOÁN KHI NHẬN";
      paymentStatus.className = "font-semibold text-ink font-label-code";
      totalAmount.className = "font-label-code text-2xl font-bold text-lacquer-red";
    }
  }

  function copyOrderCode(code, btn) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `<span class="material-symbols-outlined text-jade text-[16px]">done</span><span class="font-label-micro uppercase text-jade font-semibold">Đã chép</span>`;
      setTimeout(() => {
        btn.innerHTML = originalHtml;
      }, 1800);
    }
  }

  function fakeReload() {
    const btn = event.currentTarget;
    btn.classList.add('opacity-50', 'pointer-events-none');
    setTimeout(() => {
      btn.classList.remove('opacity-50', 'pointer-events-none');
      switchState('success');
    }, 700);
  }
</script></main><footer class="w-full bg-rice-paper border-t border-border mt-auto"><div class="w-full max-w-7xl mx-auto px-gutter py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md text-body-sm text-ink-muted"><div class="flex items-center gap-space-sm"><span class="material-symbols-outlined text-turmeric text-[18px]">support_agent</span><span>Tổng đài CSKH:</span><a class="font-label-code text-label-code text-lacquer-red font-semibold hover:underline" href="tel:19006886">1900 6886</a><span class="text-border">|</span><span class="font-label-micro text-label-micro uppercase">Hỗ trợ 24/7</span></div><div class="flex items-center gap-space-lg font-body-sm text-body-sm"><a class="text-ink-muted hover:text-ink transition-colors" data-path="terms-of-service" href="#">Điều khoản dịch vụ</a><a class="text-ink-muted hover:text-ink transition-colors" data-path="privacy-policy" href="#">Chính sách bảo mật</a><a class="text-ink-muted hover:text-ink transition-colors" data-path="buyer-protection" href="#">Quy chế bảo vệ người mua</a></div><div class="font-label-micro text-label-micro text-ink-faint">© 2025 ShopNest. Bảo lưu mọi quyền.</div></div></footer></body></html>
```
### C01 - Danh sách đơn hàng
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{colors:{"on-primary-fixed":"#410001","inverse-primary":"#ffb4aa","on-surface":"#1d1c15","surface-container":"#f2ede2","secondary":"#615e59","surface-container-highest":"#e7e2d7","surface-container-high":"#ede8dd","surface":"#fef9ee","surface-bright":"#fef9ee","rice-paper":"#F6F1E6","on-surface-variant":"#58413e","tertiary":"#514b3f","on-primary-container":"#ffd9d3","jade":"#2F6B57","outline":"#8c716d","on-secondary-container":"#67645f","lacquer-red":"#B23A2F","error":"#ba1a1a","tertiary-fixed-dim":"#cec6b5","secondary-container":"#e8e2db","on-primary-fixed-variant":"#891c16","background":"#fef9ee","surface-tint":"#aa342a","primary":"#91221a","logo-blue":"#4991D8","ink-faint":"#9A8F7F","border":"#DCD1BE","surface-container-low":"#f8f3e8","on-error-container":"#93000a","surface-dim":"#dedacf","surface-container-lowest":"#ffffff","on-tertiary-container":"#e9e0cf","on-tertiary-fixed":"#1f1b11","brick":"#8B2A24","on-tertiary-fixed-variant":"#4b463a","lacquer-wash":"#F2DCD5","tertiary-fixed":"#eae2d1","primary-fixed-dim":"#ffb4aa","on-secondary-fixed":"#1d1b17","surface-variant":"#e7e2d7","ink":"#1D1B17","primary-fixed":"#ffdad5","on-secondary":"#ffffff","turmeric":"#8A5A1A","on-background":"#1d1c15","raw-linen":"#EDE4D3","tertiary-container":"#696356","outline-variant":"#dfbfbb","ink-muted":"#6B6458","primary-container":"#b23a2f","on-secondary-fixed-variant":"#494641","inverse-surface":"#323029","on-error":"#ffffff","lacquer-deep":"#8C2A22","secondary-fixed-dim":"#cbc6bf","warm-porcelain":"#FFFCF4","secondary-fixed":"#e8e2db","on-tertiary":"#ffffff","error-container":"#ffdad6","inverse-on-surface":"#f5f0e5","on-primary":"#ffffff"},borderRadius:{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},spacing:{"gutter":"1.5rem","margin-mobile":"1.25rem","margin":"3rem","space-xl":"2.5rem","space-xs":"0.25rem","space-md":"1rem","gutter-mobile":"1rem","space-sm":"0.5rem","space-lg":"1.5rem"},fontFamily:{"headline-1":["Newsreader"],"label-micro":["Be Vietnam Pro"],"display-xl":["Newsreader"],"display-lg":["Newsreader"],"headline-2":["Newsreader"],"display-lg-mobile":["Newsreader"],"display-xl-mobile":["Newsreader"],"body-lg":["Be Vietnam Pro"],"body-sm":["Be Vietnam Pro"],"body-md":["Be Vietnam Pro"],"label-code":["JetBrains Mono"],"headline-3":["Be Vietnam Pro"]},fontSize:{"headline-1":["36px",{"lineHeight":"40px","letterSpacing":"-0.025em","fontWeight":"600"}],"label-micro":["12px",{"lineHeight":"16px","letterSpacing":"0.12em","fontWeight":"600"}],"display-xl":["64px",{"lineHeight":"60px","letterSpacing":"-0.035em","fontWeight":"600"}],"display-lg":["48px",{"lineHeight":"48px","letterSpacing":"-0.03em","fontWeight":"600"}],"headline-2":["28px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"600"}],"display-lg-mobile":["32px",{"lineHeight":"34px","letterSpacing":"-0.025em","fontWeight":"600"}],"display-xl-mobile":["40px",{"lineHeight":"40px","letterSpacing":"-0.03em","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"body-sm":["14px",{"lineHeight":"21px","fontWeight":"400"}],"body-md":["16px",{"lineHeight":"26px","fontWeight":"400"}],"label-code":["14px",{"lineHeight":"20px","fontWeight":"500"}],"headline-3":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}]}}}};</script></head><body class="bg-rice-paper text-on-surface font-body-md text-body-md"><header class="fixed top-0 left-0 right-0 z-50 bg-warm-porcelain shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="h-20 w-full max-w-[1440px] mx-auto px-gutter flex items-center justify-between gap-space-lg"><div class="flex items-center gap-space-lg"><a class="flex items-center gap-space-sm" href="#"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><span class="font-headline-2 text-headline-2 text-ink tracking-tight">ShopNest</span></a><nav class="hidden xl:flex items-center gap-space-md ml-space-md" data-active-classes="text-lacquer-red font-semibold"><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="trang-chu" href="#">Trang chủ</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="danh-muc" href="#">Danh mục</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="khuyen-mai" href="#">Khuyến mãi</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="shop-viet" href="#">Shop Việt</a></nav></div><div class="flex-1 max-w-xl mx-space-md hidden md:block"><div class="relative flex items-center w-full"><span class="material-symbols-outlined absolute left-3 text-ink-faint text-[20px]">search</span><input class="w-full h-11 pl-10 pr-4 bg-rice-paper rounded-lg text-ink font-body-sm text-body-sm placeholder:text-ink-faint outline-none focus:ring-1 focus:ring-lacquer-red" placeholder="Tìm kiếm sản phẩm thủ công, gốm sứ, lụa Vạn Phúc..." type="text"/></div></div><div class="flex items-center gap-space-md"><button aria-label="Thông báo" class="p-2 text-ink-muted hover:text-ink transition-colors flex items-center justify-center" type="button"><span class="material-symbols-outlined text-[22px]">notifications</span></button><button aria-label="Giỏ hàng" class="p-2 text-ink-muted hover:text-ink transition-colors flex items-center justify-center" type="button"><span class="material-symbols-outlined text-[22px]">shopping_bag</span></button><div class="flex items-center gap-space-sm pl-space-sm"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div><div class="hidden sm:flex flex-col text-left"><span class="font-body-sm text-body-sm font-semibold text-ink leading-tight">Nguyễn Thu Hà</span><span class="font-label-micro text-label-micro text-ink-muted tracking-wider uppercase">Thành viên Nếp</span></div></div></div></div></header><div class="w-full max-w-[1440px] mx-auto pt-20 px-gutter flex gap-space-lg"><aside class="w-[220px] shrink-0 pt-space-lg pb-space-xl"><div class="bg-warm-porcelain rounded-lg p-space-sm"><div class="px-space-sm py-space-xs font-label-micro text-label-micro uppercase text-ink-faint tracking-widest">Quản lý tài khoản</div><nav class="flex flex-col gap-1 mt-space-sm" data-active-classes="bg-rice-paper text-lacquer-red font-semibold border-l-2 border-lacquer-red"><a class="flex items-center gap-space-sm px-space-sm py-space-sm rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-rice-paper hover:text-on-surface transition-colors" data-path="don-mua" href="#"><span class="material-symbols-outlined text-[18px]">receipt_long</span><span>Đơn mua</span></a><div class="py-1"><div class="px-space-sm py-1 font-body-sm text-body-sm font-semibold text-ink flex items-center gap-space-sm"><span class="material-symbols-outlined text-[18px]">person</span><span>Tài khoản của tôi</span></div><div class="flex flex-col pl-7 gap-1 mt-1"><a class="px-2 py-1.5 rounded font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-rice-paper transition-colors" data-path="ho-so-ca-nhan" href="#">Hồ sơ</a><a class="px-2 py-1.5 rounded font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-rice-paper transition-colors" data-path="dia-chi-giao-hang" href="#">Địa chỉ</a><a class="px-2 py-1.5 rounded font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-rice-paper transition-colors" data-path="doi-mat-khau" href="#">Đổi mật khẩu</a></div></div><a class="flex items-center gap-space-sm px-space-sm py-space-sm rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-rice-paper hover:text-on-surface transition-colors" data-path="kho-voucher-nep" href="#"><span class="material-symbols-outlined text-[18px]">confirmation_number</span><span>Kho voucher Nếp</span></a><a class="flex items-center gap-space-sm px-space-sm py-space-sm rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-rice-paper hover:text-on-surface transition-colors" data-path="thong-bao-he-thong" href="#"><span class="material-symbols-outlined text-[18px]">notifications_none</span><span>Thông báo</span></a><a class="flex items-center gap-space-sm px-space-sm py-space-sm rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-rice-paper hover:text-on-surface transition-colors" data-path="ho-tro-khach-hang" href="#"><span class="material-symbols-outlined text-[18px]">support_agent</span><span>Hỗ trợ khách hàng</span></a></nav></div></aside><main class="flex-1 pt-space-lg pb-space-xl min-w-0 bg-rice-paper"><div class="flex flex-col w-full">
<!-- Interactive State Control Bar (Simulated UI View Switcher) -->
<div class="flex flex-wrap items-center justify-between gap-space-sm bg-warm-porcelain border border-border px-space-md py-space-sm rounded-lg mb-space-md">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-ink-muted text-[18px]">tune</span>
<span class="font-body-sm text-body-sm text-ink-muted font-medium">Mô phỏng trạng thái:</span>
</div>
<div class="flex flex-wrap items-center gap-2">
<button class="px-3 py-1 rounded text-body-sm font-body-sm transition-all bg-rice-paper text-lacquer-red font-semibold border border-lacquer-red/30" id="btn-state-default" onclick="setState('default')" type="button">
        Mặc định (6 đơn)
      </button>
<button class="px-3 py-1 rounded text-body-sm font-body-sm transition-all text-on-surface-variant hover:text-ink hover:bg-rice-paper border border-border" id="btn-state-delivering" onclick="setState('delivering')" type="button">
        Lọc Đang giao (2 đơn)
      </button>
<button class="px-3 py-1 rounded text-body-sm font-body-sm transition-all text-on-surface-variant hover:text-ink hover:bg-rice-paper border border-border" id="btn-state-skeleton" onclick="setState('skeleton')" type="button">
        Đang tải (Skeleton)
      </button>
<button class="px-3 py-1 rounded text-body-sm font-body-sm transition-all text-on-surface-variant hover:text-ink hover:bg-rice-paper border border-border" id="btn-state-empty" onclick="setState('empty')" type="button">
        Đơn rỗng (Chưa có đơn)
      </button>
</div>
</div>
<!-- Account Header Block -->
<section class="bg-warm-porcelain border border-border rounded-xl p-space-md lg:p-space-lg mb-space-md">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-border">
<div class="flex items-center gap-space-sm">
<h1 class="font-headline-3 text-headline-3 font-semibold text-ink">Đơn hàng của bạn</h1>
<span class="font-label-code text-label-code px-2.5 py-0.5 rounded-full bg-rice-paper text-ink-muted font-medium border border-border" id="order-count-badge">
          6 đơn hàng
        </span>
</div>
<!-- Order Search Input -->
<div class="w-full md:w-80 relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint text-[18px]">search</span>
<input class="w-full h-10 pl-9 pr-4 rounded-lg bg-rice-paper border border-border text-body-sm font-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-lacquer-red" id="order-search" oninput="handleSearch(this.value)" placeholder="Tìm theo mã đơn (#SN-...) hoặc tên món..." type="text"/>
</div>
</div>
<!-- Filter Tabs / Chips Row -->
<div class="flex items-center gap-1 sm:gap-2 pt-space-md overflow-x-auto scrollbar-none text-body-sm font-body-sm">
<button class="filter-tab px-3.5 py-1.5 rounded-lg font-medium transition-colors border border-lacquer-red bg-lacquer-wash/50 text-lacquer-red font-semibold whitespace-nowrap" data-filter="all" onclick="setFilterTab('all')" type="button">
        Tất cả (6)
      </button>
<button class="filter-tab px-3.5 py-1.5 rounded-lg font-medium transition-colors border border-transparent text-on-surface-variant hover:text-ink hover:bg-rice-paper whitespace-nowrap" data-filter="pending" onclick="setFilterTab('pending')" type="button">
        Chờ xác nhận (1)
      </button>
<button class="filter-tab px-3.5 py-1.5 rounded-lg font-medium transition-colors border border-transparent text-on-surface-variant hover:text-ink hover:bg-rice-paper whitespace-nowrap" data-filter="shipping" onclick="setFilterTab('shipping')" type="button">
        Đang giao (2)
      </button>
<button class="filter-tab px-3.5 py-1.5 rounded-lg font-medium transition-colors border border-transparent text-on-surface-variant hover:text-ink hover:bg-rice-paper whitespace-nowrap" data-filter="completed" onclick="setFilterTab('completed')" type="button">
        Hoàn thành (2)
      </button>
<button class="filter-tab px-3.5 py-1.5 rounded-lg font-medium transition-colors border border-transparent text-on-surface-variant hover:text-ink hover:bg-rice-paper whitespace-nowrap" data-filter="cancelled" onclick="setFilterTab('cancelled')" type="button">
        Đã huỷ (1)
      </button>
</div>
</section>
<!-- Ledger View Container (Sổ sách đối soát đơn hàng) -->
<section class="bg-warm-porcelain border border-border rounded-xl overflow-hidden mb-space-md">
<!-- Active Ledger Table -->
<div class="overflow-x-auto" id="orders-ledger-table">
<table class="w-full text-left border-collapse min-w-[880px]">
<thead>
<tr class="bg-raw-linen/50 border-b border-border">
<th class="py-3 px-space-md font-label-code text-label-micro uppercase text-ink-muted font-medium w-48">
              Mã đơn &amp; Ngày đặt
            </th>
<th class="py-3 px-space-md font-label-code text-label-micro uppercase text-ink-muted font-medium">
              Sản phẩm &amp; Gian hàng
            </th>
<th class="py-3 px-space-md font-label-code text-label-micro uppercase text-ink-muted font-medium w-36 text-right">
              Tổng tiền
            </th>
<th class="py-3 px-space-md font-label-code text-label-micro uppercase text-ink-muted font-medium w-48">
              Trạng thái
            </th>
<th class="py-3 px-space-md font-label-code text-label-micro uppercase text-ink-muted font-medium w-44 text-right">
              Thao tác
            </th>
</tr>
</thead>
<tbody class="divide-y divide-border font-body-sm text-body-sm" id="ledger-body">
<!-- Order 1: SN-24817 (Đang giao) -->
<tr class="order-row hover:bg-raw-linen/30 transition-colors" data-search="#sn-24817 laptop asus vivobook sony technest" data-status="shipping">
<td class="py-4 px-space-md align-top">
<span class="font-label-code font-semibold text-ink block">#SN-24817</span>
<span class="font-label-code text-label-micro text-ink-faint block mt-0.5">12/11/2026 • 14:26</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="flex items-start gap-3">
<img class="w-[60px] h-[60px] object-cover rounded-lg shrink-0 border border-border" data-alt="Editorial product photo of a sleek ASUS Vivobook laptop resting on a minimalist raw wooden desk alongside soft daylight, Vietnamese design studio aesthetic, natural linen textures, muted warm tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWS8-ZjeZqStGje-h41CixbXoWnreGVr0r65xVX9Ayu-0xfR6QpiQ_XWhJZhayIw-ypamPBhEPfhXvRA3eorfbHjOs0YFNZZ_ZNBxQ6RPf0W6RQ6AMLNvSOvG9kCdNeDCVDK2TFjuMliETdmtXtub4-7qEEZZvBYGCg7KPbAwfymZFCry4Wy3qZiekBzShvwqoeC7B-_kJedL-WxTcjCq9QJQXLiX1aY0a9jL7RQ"/>
<div class="min-w-0">
<div class="font-medium text-ink line-clamp-1">Laptop ASUS Vivobook 14 OLED (M1405VA) - i5/16GB/512GB</div>
<div class="text-ink-muted text-label-micro mt-0.5">+ 1 món khác (Tai nghe Sony WH-CH720N)</div>
<div class="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded bg-rice-paper border border-border text-label-micro text-ink-muted">
<span class="font-medium text-ink">TechNest Official</span>
<span class="text-ink-faint">•</span>
<span class="text-lacquer-red font-medium">Shop Việt</span>
</div>
</div>
</div>
</td>
<td class="py-4 px-space-md align-top text-right">
<span class="font-label-code font-semibold text-ink text-body-md block">17.430.000 ₫</span>
<span class="font-label-code text-label-micro text-ink-faint">2 món</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-turmeric/10 border border-turmeric/20 text-turmeric font-medium text-label-micro">
<span class="w-1.5 h-1.5 rounded-full bg-turmeric"></span>
<span>Đang giao</span>
</div>
<p class="font-body-sm text-label-micro text-ink-muted mt-1 leading-snug">
                Đang vận chuyển qua VNPost
              </p>
</td>
<td class="py-4 px-space-md align-top text-right">
<div class="flex flex-col items-end gap-1.5">
<button class="px-3 py-1 rounded text-label-micro font-medium border border-border text-ink hover:bg-lacquer-wash/60 transition-colors" type="button">
                  Xem chi tiết
                </button>
<button class="text-label-micro text-lacquer-red hover:underline font-medium" type="button">
                  Theo dõi kiện hàng
                </button>
</div>
</td>
</tr>
<!-- Order 2: SN-24802 (Hoàn thành) -->
<tr class="order-row hover:bg-raw-linen/30 transition-colors" data-search="#sn-24802 ta bim huu co an nhien me va be" data-status="completed">
<td class="py-4 px-space-md align-top">
<span class="font-label-code font-semibold text-ink block">#SN-24802</span>
<span class="font-label-code text-label-micro text-ink-faint block mt-0.5">08/11/2026 • 09:15</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="flex items-start gap-3">
<img class="w-[60px] h-[60px] object-cover rounded-lg shrink-0 border border-border" data-alt="Pack of organic bamboo fiber baby diapers, sustainable eco-friendly packaging, delicate warm neutral lighting, textured paper background, Vietnamese artisanal touch." src="https://lh3.googleusercontent.com/aida-public/AB6AXuChJ5LHUFBMLa75NuDUZRTVzXALGzGBzEwxTtljnSg0py1DOm44c-koJDHWbBAGqF1y-luLnTILTVvvTBtw9oARgbN5c56zkTnnBqScejyL9__5UlVdkO4H0-iY-uHZnO7FMCB43PQVEI-f9MQhYAAESWtt_CIKl6Q41Ijg5SzpZWTtRgNbVSe6NN3ajEd5cJaJkvKdpp-AYdmO1_g91paygIcSSdj8ecpqAskzlA"/>
<div class="min-w-0">
<div class="font-medium text-ink line-clamp-1">Tã bỉm quần hữu cơ sợi tre dịu êm size L (60 miếng)</div>
<div class="text-ink-muted text-label-micro mt-0.5">Số lượng: 2 kiện</div>
<div class="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded bg-rice-paper border border-border text-label-micro text-ink-muted">
<span class="font-medium text-ink">Mẹ &amp; Bé An Nhiên</span>
<span class="text-ink-faint">•</span>
<span class="text-lacquer-red font-medium">Shop Việt</span>
</div>
</div>
</div>
</td>
<td class="py-4 px-space-md align-top text-right">
<span class="font-label-code font-semibold text-ink text-body-md block">578.000 ₫</span>
<span class="font-label-code text-label-micro text-ink-faint">Đã thanh toán</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-jade/10 border border-jade/20 text-jade font-medium text-label-micro">
<span class="w-1.5 h-1.5 rounded-full bg-jade"></span>
<span>Hoàn thành</span>
</div>
<p class="font-body-sm text-label-micro text-ink-muted mt-1 leading-snug">
                Đã giao ngày 10/11
              </p>
</td>
<td class="py-4 px-space-md align-top text-right">
<div class="flex flex-col items-end gap-1.5">
<button class="px-3 py-1 rounded text-label-micro font-medium border border-border text-ink hover:bg-lacquer-wash/60 transition-colors" type="button">
                  Xem chi tiết
                </button>
<div class="flex items-center gap-2">
<button class="text-label-micro text-ink-muted hover:text-ink font-medium" type="button">
                    Đánh giá
                  </button>
<span class="text-ink-faint text-label-micro">•</span>
<button class="text-label-micro text-lacquer-red hover:underline font-semibold" type="button">
                    Mua lại
                  </button>
</div>
</div>
</td>
</tr>
<!-- Order 3: SN-24765 (Hoàn thành) -->
<tr class="order-row hover:bg-raw-linen/30 transition-colors" data-search="#sn-24765 bat gom bat trang men ran thu cong gom an nhien" data-status="completed">
<td class="py-4 px-space-md align-top">
<span class="font-label-code font-semibold text-ink block">#SN-24765</span>
<span class="font-label-code text-label-micro text-ink-faint block mt-0.5">02/11/2026 • 18:40</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="flex items-start gap-3">
<img class="w-[60px] h-[60px] object-cover rounded-lg shrink-0 border border-border" data-alt="Handcrafted Bat Trang crackle glaze ceramic bowls, artisanal wood-fired texture, traditional Vietnamese ceramic craft, soft studio lighting on woven reed placemat." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZeXNKQkAUDK3Owlk7buLKoo85TxoyZxPSPQC0tkT-cnJu3MBSvf83LMARtB_vvFqLGRoALCLOb8pMsdi61ASq7KJm4Da01Uq8_zzPcXI7p8jeuh-eFxXXc6od6--VHKODv9XAXpHzWTCDPU5_ZewIO76fMMpkgK6ILv6QWkl2gZ8YRrHE3hd_s-rS0weZ4kV9eHuVQLwyvH5uGzLm02VG1VV9fSgilEjsVU3tSQ"/>
<div class="min-w-0">
<div class="font-medium text-ink line-clamp-1">Bát gốm Bát Tràng men rạn thủ công nung củi</div>
<div class="text-ink-muted text-label-micro mt-0.5">Số lượng: 4 chiếc</div>
<div class="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded bg-rice-paper border border-border text-label-micro text-ink-muted">
<span class="font-medium text-ink">Gốm Bát Tràng An Nhiên</span>
<span class="text-ink-faint">•</span>
<span class="text-lacquer-red font-medium">Shop Việt</span>
</div>
</div>
</div>
</td>
<td class="py-4 px-space-md align-top text-right">
<span class="font-label-code font-semibold text-ink text-body-md block">756.000 ₫</span>
<span class="font-label-code text-label-micro text-ink-faint">Đã thanh toán</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-jade/10 border border-jade/20 text-jade font-medium text-label-micro">
<span class="w-1.5 h-1.5 rounded-full bg-jade"></span>
<span>Hoàn thành</span>
</div>
<p class="font-body-sm text-label-micro text-ink-muted mt-1 leading-snug">
                Đã giao ngày 04/11
              </p>
</td>
<td class="py-4 px-space-md align-top text-right">
<div class="flex flex-col items-end gap-1.5">
<button class="px-3 py-1 rounded text-label-micro font-medium border border-border text-ink hover:bg-lacquer-wash/60 transition-colors" type="button">
                  Xem chi tiết
                </button>
<button class="text-label-micro text-lacquer-red hover:underline font-semibold" type="button">
                  Mua lại
                </button>
</div>
</td>
</tr>
<!-- Order 4: SN-24710 (Đang giao) -->
<tr class="order-row hover:bg-raw-linen/30 transition-colors" data-search="#sn-24710 tai nghe sony wh-ch720n technest" data-status="shipping">
<td class="py-4 px-space-md align-top">
<span class="font-label-code font-semibold text-ink block">#SN-24710</span>
<span class="font-label-code text-label-micro text-ink-faint block mt-0.5">28/10/2026 • 11:05</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="flex items-start gap-3">
<img class="w-[60px] h-[60px] object-cover rounded-lg shrink-0 border border-border" data-alt="Matte black Sony wireless noise cancelling over-ear headphones on a natural tactile ceramic display stand, soft ambient side light, minimal clean setup." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAOaJHAuC2evwiEl024EexaV35SpMtHSUw6rpLzYQc5neYfk-iPNA0fXMRe_XJSefeSMfHrkH5lRuDXtipBz5UwSZ3NiLUUs9wlAxhW-PnRvjHO5flTZLW4eyKF0EI6TV6tqDGvE4y-s6MSznVL1TfYqn04b4g71IAoJNK8ZHwEqgZ8QoBWUlTBStVFP2_PeAvI-b26DuJvhrfaemXF8na4vsG3KLx1CTSttUoAQ"/>
<div class="min-w-0">
<div class="font-medium text-ink line-clamp-1">Tai nghe chống ồn Sony WH-CH720N - Đen Cổ Điển</div>
<div class="text-ink-muted text-label-micro mt-0.5">Bảo hành chính hãng 12 tháng</div>
<div class="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded bg-rice-paper border border-border text-label-micro text-ink-muted">
<span class="font-medium text-ink">TechNest Official</span>
</div>
</div>
</div>
</td>
<td class="py-4 px-space-md align-top text-right">
<span class="font-label-code font-semibold text-ink text-body-md block">2.490.000 ₫</span>
<span class="font-label-code text-label-micro text-ink-faint">Ví ShopNest Pay</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-turmeric/10 border border-turmeric/20 text-turmeric font-medium text-label-micro">
<span class="w-1.5 h-1.5 rounded-full bg-turmeric"></span>
<span>Đang giao</span>
</div>
<p class="font-body-sm text-label-micro text-ink-muted mt-1 leading-snug">
                Dự kiến giao hôm nay
              </p>
</td>
<td class="py-4 px-space-md align-top text-right">
<div class="flex flex-col items-end gap-1.5">
<button class="px-3 py-1 rounded text-label-micro font-medium border border-border text-ink hover:bg-lacquer-wash/60 transition-colors" type="button">
                  Xem chi tiết
                </button>
<button class="text-label-micro text-lacquer-red hover:underline font-medium" type="button">
                  Theo dõi
                </button>
</div>
</td>
</tr>
<!-- Order 5: SN-24690 (Đã huỷ) -->
<tr class="order-row hover:bg-raw-linen/30 transition-colors opacity-85" data-search="#sn-24690 ao thun moc cotton moc studio" data-status="cancelled">
<td class="py-4 px-space-md align-top">
<span class="font-label-code font-semibold text-ink-muted block line-through">#SN-24690</span>
<span class="font-label-code text-label-micro text-ink-faint block mt-0.5">20/10/2026 • 16:30</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="flex items-start gap-3">
<img class="w-[60px] h-[60px] object-cover rounded-lg shrink-0 border border-border grayscale contrast-75" data-alt="Folded natural unbleached raw cotton t-shirt with visible fabric weave texture on an aged bamboo shelf, earthy warm ambient lighting, artisanal textile studio." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiIzJcMxn0fJHwhMcgRyFuYNvxEMZSS0eAo83KOMt5PlcQbPt7H2JEq_rFbnAyGguIpEOI62Twt6oJirgJaGxK1utRLGIuHy1k04RdkdlEVAYYRNndynTWpLFr9PfkVmg6QD1FmK264_J0mzZthTcPMmcuE5JhRoL6Oa3PrAL4SZxradGp_vbcXDKyuvF3oRko0Ge0se98xmZWYA5MWdNA0VJxcuR2efJXTViwKA"/>
<div class="min-w-0">
<div class="font-medium text-ink-muted line-clamp-1">Áo thun cổ tròn cotton chải kỹ dệt mộc định lượng cao</div>
<div class="text-ink-faint text-label-micro mt-0.5">Số lượng: 2 cái • Size XL</div>
<div class="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded bg-rice-paper border border-border text-label-micro text-ink-muted">
<span class="font-medium text-ink-muted">Mộc Studio</span>
<span class="text-ink-faint">•</span>
<span class="text-ink-muted font-medium">Shop Việt</span>
</div>
</div>
</div>
</td>
<td class="py-4 px-space-md align-top text-right">
<span class="font-label-code font-semibold text-ink-muted text-body-md block">580.000 ₫</span>
<span class="font-label-code text-label-micro text-ink-faint">Đã hoàn tiền</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brick/10 border border-brick/20 text-brick font-medium text-label-micro">
<span class="w-1.5 h-1.5 rounded-full bg-brick"></span>
<span>Đã huỷ</span>
</div>
<p class="font-body-sm text-label-micro text-ink-muted mt-1 leading-snug">
                Huỷ bởi người mua
              </p>
</td>
<td class="py-4 px-space-md align-top text-right">
<div class="flex flex-col items-end gap-1.5">
<button class="px-3 py-1 rounded text-label-micro font-medium border border-border text-ink hover:bg-lacquer-wash/60 transition-colors" type="button">
                  Xem chi tiết
                </button>
<button class="text-label-micro text-lacquer-red hover:underline font-semibold" type="button">
                  Mua lại
                </button>
</div>
</td>
</tr>
<!-- Order 6: SN-24831 (Chờ xác nhận) -->
<tr class="order-row hover:bg-raw-linen/30 transition-colors" data-search="#sn-24831 den ban gom men ran gom nep chao giay xep" data-status="pending">
<td class="py-4 px-space-md align-top">
<span class="font-label-code font-semibold text-ink block">#SN-24831</span>
<span class="font-label-code text-label-micro text-ink-faint block mt-0.5">12/11/2026 • 16:02</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="flex items-start gap-3">
<img class="w-[60px] h-[60px] object-cover rounded-lg shrink-0 border border-border" data-alt="Artisanal ceramic table lamp with traditional Vietnamese folded paper shade, crackle glaze ceramic base, warm intimate evening glow on a tactile wooden table." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0XOnrq3yGQwWvy_F09HqwjsSP-mGxdawwHq1aDJNyv_J6iGjJIVaEvB4vWFyvq09n0_HNzuFjJkJFOxQsQ0tzdQKLXaGGf4OZeqPr8mdLyX_pQi7vzOIUbKwA1jBfJdjTXxa0T9DAIYl3K9SWNgpuZC0iIV97tPVMp1zUTRJSTcvnPSp0tEp1q8H6tHtbza2NQLdKT-x39R1nLFJJCbE51LZxZoo6MA-9IBsd1w"/>
<div class="min-w-0">
<div class="font-medium text-ink line-clamp-1">Đèn bàn gốm men rạn chao giấy xếp Nếp</div>
<div class="text-ink-muted text-label-micro mt-0.5">Bản giới hạn xưởng thủ công • Men ngà</div>
<div class="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded bg-rice-paper border border-border text-label-micro text-ink-muted">
<span class="font-medium text-ink">Gốm Nếp</span>
</div>
</div>
</div>
</td>
<td class="py-4 px-space-md align-top text-right">
<span class="font-label-code font-semibold text-ink text-body-md block">790.000 ₫</span>
<span class="font-label-code text-label-micro text-ink-faint">COD (Khi nhận hàng)</span>
</td>
<td class="py-4 px-space-md align-top">
<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-raw-linen border border-border text-ink-muted font-medium text-label-micro">
<span class="w-1.5 h-1.5 rounded-full bg-turmeric"></span>
<span>Chờ xác nhận</span>
</div>
<p class="font-body-sm text-label-micro text-ink-muted mt-1 leading-snug">
                Chờ xưởng đóng gói
              </p>
</td>
<td class="py-4 px-space-md align-top text-right">
<div class="flex flex-col items-end gap-1.5">
<button class="px-3 py-1 rounded text-label-micro font-medium border border-border text-ink hover:bg-lacquer-wash/60 transition-colors" type="button">
                  Xem chi tiết
                </button>
<button class="text-label-micro text-brick hover:underline font-medium" type="button">
                  Huỷ đơn
                </button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Skeleton State Container (Hidden by default) -->
<div class="hidden divide-y divide-border animate-pulse" id="orders-skeleton">
<div class="p-space-md flex items-center justify-between gap-4">
<div class="w-32 h-6 bg-raw-linen rounded"></div>
<div class="flex items-center gap-3 flex-1 max-w-md">
<div class="w-14 h-14 bg-raw-linen rounded-lg shrink-0"></div>
<div class="flex-1 space-y-2">
<div class="w-3/4 h-4 bg-raw-linen rounded"></div>
<div class="w-1/2 h-3 bg-raw-linen rounded"></div>
</div>
</div>
<div class="w-24 h-6 bg-raw-linen rounded"></div>
<div class="w-28 h-6 bg-raw-linen rounded"></div>
<div class="w-24 h-8 bg-raw-linen rounded"></div>
</div>
<div class="p-space-md flex items-center justify-between gap-4">
<div class="w-32 h-6 bg-raw-linen rounded"></div>
<div class="flex items-center gap-3 flex-1 max-w-md">
<div class="w-14 h-14 bg-raw-linen rounded-lg shrink-0"></div>
<div class="flex-1 space-y-2">
<div class="w-3/4 h-4 bg-raw-linen rounded"></div>
<div class="w-1/2 h-3 bg-raw-linen rounded"></div>
</div>
</div>
<div class="w-24 h-6 bg-raw-linen rounded"></div>
<div class="w-28 h-6 bg-raw-linen rounded"></div>
<div class="w-24 h-8 bg-raw-linen rounded"></div>
</div>
<div class="p-space-md flex items-center justify-between gap-4">
<div class="w-32 h-6 bg-raw-linen rounded"></div>
<div class="flex items-center gap-3 flex-1 max-w-md">
<div class="w-14 h-14 bg-raw-linen rounded-lg shrink-0"></div>
<div class="flex-1 space-y-2">
<div class="w-3/4 h-4 bg-raw-linen rounded"></div>
<div class="w-1/2 h-3 bg-raw-linen rounded"></div>
</div>
</div>
<div class="w-24 h-6 bg-raw-linen rounded"></div>
<div class="w-28 h-6 bg-raw-linen rounded"></div>
<div class="w-24 h-8 bg-raw-linen rounded"></div>
</div>
</div>
<!-- Empty State Container (Hidden by default) -->
<div class="hidden py-16 px-space-md text-center" id="orders-empty">
<div class="w-16 h-16 rounded-full bg-rice-paper border border-border mx-auto flex items-center justify-center text-ink-muted mb-space-md">
<span class="material-symbols-outlined text-[32px]">receipt_long</span>
</div>
<h3 class="font-headline-3 text-headline-3 font-semibold text-ink">Chưa có đơn hàng nào</h3>
<p class="font-body-sm text-body-sm text-ink-muted mt-1 max-w-sm mx-auto">
        Chưa có đơn nào. Món đầu tiên đang chờ bạn trong chợ đồ thủ công &amp; nếp sống Việt.
      </p>
<div class="mt-space-md">
<a class="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-lacquer-red text-warm-porcelain font-body-sm font-semibold hover:bg-lacquer-deep transition-all" href="#">
          Xem chợ hôm nay
        </a>
</div>
</div>
<!-- Ledger Pagination Footer -->
<div class="flex flex-col sm:flex-row items-center justify-between gap-space-sm px-space-md py-3.5 bg-warm-porcelain border-t border-border" id="ledger-pagination">
<span class="font-label-code text-label-micro text-ink-muted" id="pagination-text">
        Hiển thị 1–6 trong 6 đơn hàng
      </span>
<div class="flex items-center gap-1.5">
<button class="h-8 px-2.5 rounded border border-border bg-rice-paper/50 text-ink-faint font-label-code text-label-micro flex items-center gap-1 cursor-not-allowed" disabled="" type="button">
<span class="material-symbols-outlined text-[16px]">chevron_left</span>
<span>Trước</span>
</button>
<button class="h-8 w-8 rounded border border-lacquer-red bg-lacquer-wash text-lacquer-red font-label-code text-label-micro font-semibold" type="button">
          1
        </button>
<button class="h-8 px-2.5 rounded border border-border bg-rice-paper/50 text-ink-faint font-label-code text-label-micro flex items-center gap-1 cursor-not-allowed" disabled="" type="button">
<span>Sau</span>
<span class="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
</div>
</section>
<!-- Contextual Order Assistance Note -->
<aside class="flex items-start gap-space-sm bg-raw-linen/40 border border-border rounded-xl p-space-md">
<span class="material-symbols-outlined text-ink-muted text-[20px] shrink-0 mt-0.5">verified_user</span>
<div class="font-body-sm text-body-sm text-ink-muted">
<span class="font-semibold text-ink">Bảo hộ kiểm hàng Nếp:</span> Tất cả đơn hàng trên ShopNest đều được hỗ trợ kiểm tra niêm phong kiện hàng và đồng kiểm khi nhận cùng nhân viên vận chuyển. Mọi thắc mắc về lộ trình vui lòng nhắn tin trực tiếp với gian hàng hoặc dùng mã đơn để tra cứu tổng đài.
    </div>
</aside>
<!-- Interactive State Controller Script -->
<script>
    let currentFilter = 'all';

    function setFilterTab(filter) {
      currentFilter = filter;
      document.querySelectorAll('.filter-tab').forEach(tab => {
        if (tab.getAttribute('data-filter') === filter) {
          tab.className = 'filter-tab px-3.5 py-1.5 rounded-lg font-medium transition-colors border border-lacquer-red bg-lacquer-wash/50 text-lacquer-red font-semibold whitespace-nowrap';
        } else {
          tab.className = 'filter-tab px-3.5 py-1.5 rounded-lg font-medium transition-colors border border-transparent text-on-surface-variant hover:text-ink hover:bg-rice-paper whitespace-nowrap';
        }
      });
      applyFilters();
    }

    function handleSearch(query) {
      applyFilters(query.toLowerCase().trim());
    }

    function applyFilters(searchQuery = '') {
      const rows = document.querySelectorAll('.order-row');
      let visibleCount = 0;

      rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        const rowSearchData = row.getAttribute('data-search') || '';
        
        const matchesFilter = (currentFilter === 'all') || (rowStatus === currentFilter);
        const matchesSearch = !searchQuery || rowSearchData.includes(searchQuery);

        if (matchesFilter && matchesSearch) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      const paginationText = document.getElementById('pagination-text');
      const orderCountBadge = document.getElementById('order-count-badge');
      
      if (paginationText) {
        paginationText.textContent = `Hiển thị ${visibleCount > 0 ? 1 : 0}–${visibleCount} trong ${visibleCount} đơn hàng`;
      }
      if (orderCountBadge) {
        orderCountBadge.textContent = `${visibleCount} đơn hàng`;
      }

      const tableEl = document.getElementById('orders-ledger-table');
      const emptyEl = document.getElementById('orders-empty');

      if (visibleCount === 0) {
        if (tableEl) tableEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.remove('hidden');
      } else {
        if (tableEl) tableEl.classList.remove('hidden');
        if (emptyEl) emptyEl.classList.add('hidden');
      }
    }

    function resetSimulationButtons() {
      const buttons = ['btn-state-default', 'btn-state-delivering', 'btn-state-skeleton', 'btn-state-empty'];
      buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.className = 'px-3 py-1 rounded text-body-sm font-body-sm transition-all text-on-surface-variant hover:text-ink hover:bg-rice-paper border border-border';
        }
      });
    }

    function setState(state) {
      resetSimulationButtons();
      const activeBtn = document.getElementById(`btn-state-${state}`);
      if (activeBtn) {
        activeBtn.className = 'px-3 py-1 rounded text-body-sm font-body-sm transition-all bg-rice-paper text-lacquer-red font-semibold border border-lacquer-red/30';
      }

      const tableEl = document.getElementById('orders-ledger-table');
      const skeletonEl = document.getElementById('orders-skeleton');
      const emptyEl = document.getElementById('orders-empty');
      const paginationEl = document.getElementById('ledger-pagination');
      const orderCountBadge = document.getElementById('order-count-badge');

      if (state === 'default') {
        tableEl.classList.remove('hidden');
        skeletonEl.classList.add('hidden');
        emptyEl.classList.add('hidden');
        paginationEl.classList.remove('hidden');
        setFilterTab('all');
      } else if (state === 'delivering') {
        tableEl.classList.remove('hidden');
        skeletonEl.classList.add('hidden');
        emptyEl.classList.add('hidden');
        paginationEl.classList.remove('hidden');
        setFilterTab('shipping');
      } else if (state === 'skeleton') {
        tableEl.classList.add('hidden');
        skeletonEl.classList.remove('hidden');
        emptyEl.classList.add('hidden');
        paginationEl.classList.add('hidden');
        if (orderCountBadge) orderCountBadge.textContent = 'Đang tải...';
      } else if (state === 'empty') {
        tableEl.classList.add('hidden');
        skeletonEl.classList.add('hidden');
        emptyEl.classList.remove('hidden');
        paginationEl.classList.add('hidden');
        if (orderCountBadge) orderCountBadge.textContent = '0 đơn hàng';
      }
    }
  </script>
</div></main></div><footer class="w-full bg-raw-linen/60 py-space-lg"><div class="max-w-[1440px] mx-auto px-gutter flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-ink-muted"><div class="flex items-center gap-space-md"><span class="font-label-micro text-label-micro text-ink tracking-widest uppercase">ShopNest • Nếp Sống Thủ Công</span><span>© 2024 Bản quyền thuộc về ShopNest Vietnam.</span></div><div class="flex items-center gap-space-lg"><a class="hover:text-lacquer-red transition-colors" data-path="dieu-khoan-dich-vu" href="#">Điều khoản</a><a class="hover:text-lacquer-red transition-colors" data-path="chinh-sach-bao-mat" href="#">Bảo mật</a><a class="hover:text-lacquer-red transition-colors" data-path="tro-giup" href="#">Trợ giúp</a></div></div></footer></body></html>
```
### C02 - Chi tiết đơn hàng và theo dõi
```html
<!DOCTYPE html>

<html class="h-full" lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><title>ShopNest</title><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{colors:{"lacquer-deep":"#8C2A22","outline-variant":"#dfbfbb","lacquer-wash":"#F2DCD5","background":"#fef9ee","warm-porcelain":"#FFFCF4","secondary-fixed-dim":"#cbc6bf","surface-tint":"#aa342a","surface-container-highest":"#e7e2d7","tertiary":"#514b3f","on-primary":"#ffffff","on-primary-container":"#ffd9d3","inverse-surface":"#323029","on-primary-fixed":"#410001","ink-faint":"#9A8F7F","surface-container-lowest":"#ffffff","turmeric":"#8A5A1A","jade":"#2F6B57","logo-blue":"#4991D8","secondary-fixed":"#e8e2db","primary-fixed":"#ffdad5","on-secondary-fixed-variant":"#494641","on-secondary-container":"#67645f","on-surface-variant":"#58413e","surface-bright":"#fef9ee","surface-container-low":"#f8f3e8","on-secondary":"#ffffff","on-surface":"#1d1c15","on-tertiary-fixed-variant":"#4b463a","on-primary-fixed-variant":"#891c16","surface-container":"#f2ede2","error-container":"#ffdad6","lacquer-red":"#B23A2F","outline":"#8c716d","brick":"#8B2A24","tertiary-fixed-dim":"#cec6b5","on-tertiary":"#ffffff","surface-variant":"#e7e2d7","surface-dim":"#dedacf","on-secondary-fixed":"#1d1b17","surface-container-high":"#ede8dd","on-tertiary-fixed":"#1f1b11","ink":"#1D1B17","on-error":"#ffffff","border":"#DCD1BE","primary-container":"#b23a2f","tertiary-fixed":"#eae2d1","secondary":"#615e59","ink-muted":"#6B6458","tertiary-container":"#696356","on-tertiary-container":"#e9e0cf","inverse-on-surface":"#f5f0e5","inverse-primary":"#ffb4aa","on-error-container":"#93000a","error":"#ba1a1a","primary":"#91221a","on-background":"#1d1c15","surface":"#fef9ee","secondary-container":"#e8e2db","rice-paper":"#F6F1E6","primary-fixed-dim":"#ffb4aa","raw-linen":"#EDE4D3"},borderRadius:{"DEFAULT":"0.25rem","lg":"0.5rem","xl":"0.75rem","full":"9999px"},spacing:{"space-xs":"0.25rem","space-md":"1rem","margin":"3rem","space-sm":"0.5rem","gutter-mobile":"1rem","space-xl":"2.5rem","margin-mobile":"1.25rem","space-lg":"1.5rem","gutter":"1.5rem"},fontFamily:{"body-md":["Be Vietnam Pro"],"body-sm":["Be Vietnam Pro"],"display-lg-mobile":["Newsreader"],"headline-1":["Newsreader"],"display-xl-mobile":["Newsreader"],"headline-2":["Newsreader"],"headline-3":["Be Vietnam Pro"],"display-xl":["Newsreader"],"label-code":["JetBrains Mono"],"label-micro":["Be Vietnam Pro"],"body-lg":["Be Vietnam Pro"],"display-lg":["Newsreader"]},fontSize:{"body-md":["16px",{"lineHeight":"26px","fontWeight":"400"}],"body-sm":["14px",{"lineHeight":"21px","fontWeight":"400"}],"display-lg-mobile":["32px",{"lineHeight":"34px","letterSpacing":"-0.025em","fontWeight":"600"}],"headline-1":["36px",{"lineHeight":"40px","letterSpacing":"-0.025em","fontWeight":"600"}],"display-xl-mobile":["40px",{"lineHeight":"40px","letterSpacing":"-0.03em","fontWeight":"600"}],"headline-2":["28px",{"lineHeight":"32px","letterSpacing":"-0.02em","fontWeight":"600"}],"headline-3":["18px",{"lineHeight":"24px","letterSpacing":"-0.01em","fontWeight":"600"}],"display-xl":["64px",{"lineHeight":"60px","letterSpacing":"-0.035em","fontWeight":"600"}],"label-code":["14px",{"lineHeight":"20px","fontWeight":"500"}],"label-micro":["12px",{"lineHeight":"16px","letterSpacing":"0.12em","fontWeight":"600"}],"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],"display-lg":["48px",{"lineHeight":"48px","letterSpacing":"-0.03em","fontWeight":"600"}]}}}};</script></head><body class="bg-rice-paper font-body-md text-ink antialiased min-h-full flex flex-col"><header class="fixed top-0 left-0 right-0 z-50 bg-warm-porcelain/95 backdrop-blur-md border-b border-border"><div class="h-20 w-full px-gutter lg:px-margin max-w-7xl mx-auto flex items-center justify-between gap-space-lg"><div class="flex items-center gap-space-md"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><span class="font-headline-2 text-headline-2 text-lacquer-red font-semibold tracking-tight">ShopNest</span></div><div class="hidden md:flex flex-1 max-w-md"><div class="relative w-full"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint text-[20px]">search</span><input class="w-full h-11 pl-10 pr-4 bg-rice-paper border border-border rounded-lg font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:ring-offset-1 focus:border-lacquer-red transition-all" placeholder="Tìm kiếm sản phẩm thủ công, đặc sản Việt..." type="text"/></div></div><div class="flex items-center gap-space-lg"><nav class="hidden xl:flex items-center gap-space-md" data-active-classes="text-lacquer-red font-semibold"><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors py-1" data-path="trang-chu" href="#">Trang chủ</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors py-1" data-path="danh-muc" href="#">Danh mục</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors py-1" data-path="khuyen-mai" href="#">Khuyến mãi</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors py-1" data-path="shop-viet" href="#">Shop Việt</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors py-1" data-path="don-hang" href="#">Đơn hàng</a></nav><div class="h-6 w-px bg-border hidden xl:block"></div><div class="flex items-center gap-3 pl-1"><div class="text-right hidden sm:block leading-tight"><p class="font-body-sm text-body-sm font-semibold text-ink">Nguyễn Thu Hà</p><span class="inline-block px-1.5 py-0.5 mt-0.5 rounded bg-lacquer-wash text-lacquer-deep font-label-micro text-label-micro uppercase tracking-wider">Thành viên Nếp</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div><div class="bg-warm-porcelain border-t border-border"><div class="h-11 w-full px-gutter lg:px-margin max-w-7xl mx-auto flex items-center"><a class="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors group" data-path="don-hang" href="#"><span class="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span><span>Quay lại Danh sách đơn hàng</span></a></div></div></header><main class="w-full pt-32 pb-margin bg-rice-paper flex-1"><div class="flex flex-col w-full text-ink">
<!-- Content Container -->
<div class="w-full max-w-[1240px] mx-auto px-gutter-mobile lg:px-gutter py-space-md">
<!-- Breadcrumb Row -->
<nav aria-label="Breadcrumb" class="flex items-center gap-space-xs text-body-sm font-body-sm text-ink-muted mb-space-sm">
<a class="hover:text-lacquer-red transition-colors" href="#">Tài khoản của tôi</a>
<span class="text-ink-faint">/</span>
<a class="hover:text-lacquer-red transition-colors" href="#">Đơn mua</a>
<span class="text-ink-faint">/</span>
<span class="text-ink font-label-code text-label-code font-medium">Chi tiết đơn hàng #SN-24817</span>
</nav>
<!-- Simulation Status Bar -->
<div class="bg-warm-porcelain rounded-xl p-3 md:p-4 mb-space-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-ink-muted text-[18px]">tune</span>
<span class="font-body-sm text-body-sm text-ink-muted font-medium">Mô phỏng trạng thái đơn:</span>
</div>
<div class="flex flex-wrap items-center gap-2" id="sim-controls">
<button class="sim-btn px-3 py-1.5 rounded-lg font-body-sm text-body-sm bg-lacquer-red text-warm-porcelain font-medium transition-all shadow-sm" id="sim-in_transit" onclick="setSimState('in_transit')" type="button">
          Đang giao (Mặc định)
        </button>
<button class="sim-btn px-3 py-1.5 rounded-lg font-body-sm text-body-sm bg-rice-paper text-ink hover:bg-lacquer-wash/60 transition-all" id="sim-delivered" onclick="setSimState('delivered')" type="button">
          Đã nhận (Delivered)
        </button>
<button class="sim-btn px-3 py-1.5 rounded-lg font-body-sm text-body-sm bg-rice-paper text-ink hover:bg-lacquer-wash/60 transition-all" id="sim-return_req" onclick="setSimState('return_req')" type="button">
          Yêu cầu trả hàng (Return requested)
        </button>
<button class="sim-btn px-3 py-1.5 rounded-lg font-body-sm text-body-sm bg-rice-paper text-ink hover:bg-lacquer-wash/60 transition-all" id="sim-cancelled" onclick="setSimState('cancelled')" type="button">
          Đã huỷ (Cancelled)
        </button>
</div>
</div>
<!-- Main 8/4 Split Grid -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
<!-- LEFT COLUMN (8 cols) -->
<div class="lg:col-span-8 flex flex-col gap-space-lg">
<!-- 1. Header Banner Card -->
<section class="bg-warm-porcelain rounded-xl p-space-md md:p-space-lg shadow-sm">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
<div class="flex items-center gap-3">
<span class="font-label-code text-headline-2 text-ink tracking-tight font-bold">#SN-24817</span>
<span class="px-2.5 py-1 rounded-full font-label-micro text-label-micro uppercase font-semibold bg-turmeric/10 text-turmeric tracking-wider inline-flex items-center gap-1.5" id="order-status-badge">
<span class="w-1.5 h-1.5 rounded-full bg-turmeric animate-pulse"></span>
<span>Đang giao hàng</span>
</span>
</div>
<div class="flex items-center gap-1 font-body-sm text-body-sm text-ink-muted">
<span class="material-symbols-outlined text-[16px] text-ink-faint">schedule</span>
<span>Đặt lúc:</span>
<span class="font-label-code text-label-code text-ink font-medium">14:26 · 12/11/2026</span>
</div>
</div>
<div class="mt-3 pt-3 flex flex-wrap items-center justify-between gap-2 bg-rice-paper/70 rounded-lg p-3">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-lacquer-red text-[20px]">local_shipping</span>
<span class="font-body-sm text-body-sm text-ink-muted">Dự kiến giao:</span>
<span class="font-label-code text-label-code text-lacquer-deep font-semibold" id="est-delivery-text">14/11 - 15/11/2026</span>
</div>
<div class="flex items-center gap-1.5 text-body-sm font-body-sm text-ink-muted">
<span>Đơn vị:</span>
<span class="font-body-sm font-semibold text-ink">VNPost Express</span>
<span class="font-label-code text-label-code text-ink-muted px-1.5 py-0.5 rounded bg-warm-porcelain">VNPOST-8849204VN</span>
</div>
</div>
</section>
<!-- 2. Tracking Timeline Section -->
<section class="bg-warm-porcelain rounded-xl p-space-md md:p-space-lg shadow-sm" id="timeline-card">
<div class="flex items-center justify-between mb-space-lg">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-lacquer-red text-[22px]">route</span>
<h2 class="font-headline-3 text-headline-3 text-ink">Hành trình đơn hàng</h2>
</div>
<span class="font-label-micro text-label-micro text-ink-muted uppercase tracking-wider">Cập nhật 15 phút trước</span>
</div>
<!-- Timeline Steps -->
<div class="relative pl-6 md:pl-8 space-y-6">
<!-- Vertical connecting track line -->
<div class="absolute left-3 md:left-4 top-2 bottom-3 w-0.5 bg-rice-paper -translate-x-1/2"></div>
<!-- Dynamic Colored filled line up to step 4 -->
<div class="absolute left-3 md:left-4 top-2 h-[75%] w-0.5 bg-jade -translate-x-1/2 transition-all duration-300" id="timeline-active-track"></div>
<!-- Step 1: Đã đặt hàng -->
<div class="relative flex items-start gap-4">
<div class="absolute -left-6 md:-left-8 top-0.5 w-6 h-6 rounded-full bg-jade flex items-center justify-center text-warm-porcelain shadow-sm z-10">
<span class="material-symbols-outlined text-[14px]">check</span>
</div>
<div class="flex-1 min-w-0">
<div class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
<span class="font-body-md text-body-md font-semibold text-ink">Đã đặt hàng</span>
<span class="font-label-code text-label-code text-ink-muted">14:26 · 12/11/2026</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">Đơn hàng đã được tạo thành công qua hệ thống bảo chứng ShopNest.</p>
</div>
</div>
<!-- Step 2: Shop xác nhận -->
<div class="relative flex items-start gap-4">
<div class="absolute -left-6 md:-left-8 top-0.5 w-6 h-6 rounded-full bg-jade flex items-center justify-center text-warm-porcelain shadow-sm z-10">
<span class="material-symbols-outlined text-[14px]">check</span>
</div>
<div class="flex-1 min-w-0">
<div class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
<span class="font-body-md text-body-md font-semibold text-ink">Shop xác nhận</span>
<span class="font-label-code text-label-code text-ink-muted">15:10 · 12/11/2026</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">TechNest Official đã duyệt đơn và đóng gói kiện hàng tiêu chuẩn Nếp.</p>
</div>
</div>
<!-- Step 3: Đã giao cho đơn vị vận chuyển -->
<div class="relative flex items-start gap-4">
<div class="absolute -left-6 md:-left-8 top-0.5 w-6 h-6 rounded-full bg-jade flex items-center justify-center text-warm-porcelain shadow-sm z-10">
<span class="material-symbols-outlined text-[14px]">check</span>
</div>
<div class="flex-1 min-w-0">
<div class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
<span class="font-body-md text-body-md font-semibold text-ink">Đã giao cho ĐVVC</span>
<span class="font-label-code text-label-code text-ink-muted">18:30 · 12/11/2026</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">Kiện hàng đã bàn giao cho VNPost Express tại trung tâm khai thác kho Hà Nội.</p>
</div>
</div>
<!-- Step 4: Đang giao hàng (CURRENT ACTIVE) -->
<div class="relative flex items-start gap-4" id="step-active-container">
<div class="absolute -left-6 md:-left-8 top-0.5 w-6 h-6 rounded-full bg-lacquer-red flex items-center justify-center text-warm-porcelain z-10 ring-4 ring-lacquer-wash animate-pulse" id="step-active-dot">
<span class="material-symbols-outlined text-[14px]">local_shipping</span>
</div>
<div class="flex-1 min-w-0 p-3 rounded-lg bg-lacquer-wash/30" id="step-active-box">
<div class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
<span class="font-body-md text-body-md font-bold text-lacquer-deep" id="step-active-title">Đang giao hàng</span>
<span class="font-label-code text-label-code text-ink-muted font-medium" id="step-active-time">08:15 · 13/11/2026</span>
</div>
<p class="font-body-sm text-body-sm text-ink mt-1" id="step-active-desc">Bưu tá <span class="font-semibold text-ink">Nguyễn Văn Hùng</span> (<a class="font-label-code text-label-code text-lacquer-red hover:underline" href="tel:0982123456">0982 123 456</a>) đang trên tuyến đường giao kiện hàng tới địa chỉ nhận của bạn.</p>
<div class="mt-2 flex items-center gap-2 font-label-micro text-label-micro text-turmeric uppercase tracking-wider font-semibold">
<span class="material-symbols-outlined text-[16px]">verified</span>
<span>Đồng kiểm mở gói hàng trực tiếp trước khi nhận</span>
</div>
</div>
</div>
<!-- Step 5: Đã nhận hàng (Upcoming) -->
<div class="relative flex items-start gap-4 opacity-75" id="step-delivery-container">
<div class="absolute -left-6 md:-left-8 top-1 w-6 h-6 rounded-full bg-rice-paper flex items-center justify-center text-ink-faint z-10" id="step-delivery-dot">
<span class="w-2 h-2 rounded-full bg-ink-faint"></span>
</div>
<div class="flex-1 min-w-0">
<div class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
<span class="font-body-md text-body-md font-medium text-ink-muted" id="step-delivery-title">Đã nhận hàng</span>
<span class="font-label-code text-label-code text-ink-faint" id="step-delivery-time">Dự kiến: 14/11 - 15/11/2026</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5" id="step-delivery-desc">Khách hàng kiểm tra hàng hoá và xác nhận nhận kiện hàng thành công.</p>
</div>
</div>
</div>
</section>
<!-- 3. Order Items Line-Item Ledger -->
<section class="bg-warm-porcelain rounded-xl shadow-sm overflow-hidden">
<!-- Shop Header -->
<div class="p-space-md bg-warm-porcelain flex flex-wrap items-center justify-between gap-3">
<div class="flex items-center gap-2.5">
<span class="material-symbols-outlined text-lacquer-red text-[20px]">storefront</span>
<span class="font-body-md text-body-md font-bold text-ink">TechNest Official</span>
<span class="px-2 py-0.5 rounded bg-rice-paper text-ink font-label-micro text-label-micro uppercase tracking-wide">Shop Việt</span>
<span class="px-2 py-0.5 rounded bg-jade/10 text-jade font-label-micro text-label-micro uppercase tracking-wide font-semibold">Chính hãng</span>
</div>
<a class="font-body-sm text-body-sm text-lacquer-red hover:text-lacquer-deep transition-colors inline-flex items-center gap-1" href="#support-section">
<span class="material-symbols-outlined text-[16px]">chat</span>
<span>Cần hỗ trợ? Chat với TechNest</span>
</a>
</div>
<!-- Product 1 -->
<div class="p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-rice-paper/20">
<div class="flex items-start gap-4">
<img class="w-20 h-24 rounded-lg object-cover bg-rice-paper shrink-0" data-alt="Close-up studio photograph of an ASUS Vivobook 14 laptop in sleek silver aluminum casing, open display showing crisp vibrant screen, soft daylight illumination on warm wood and handmade textured linen surface in a minimal aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA32t6Dt8rB3dvkuDq-zTDbifsddib3WqaHGhDhk04X76WAahVKGlCRQQXHg6caClzRtEyzRscLWmAoSS8K8Twxs9Bot3Z0-2zx1V2T9bKBYfnGSiXADp5pwPnPTMVC-hWN3eyKnZ4DxUbhC1b325ms_llR5EJImtx9YY1hy8s9HZsvfcLG48eBkpr2c3XduMtfI6tJoDbcU6eVe7EN9wvMXfM4B6Uzui2gtRXm2w"/>
<div class="flex flex-col">
<span class="font-body-md text-body-md font-semibold text-ink line-clamp-2">Laptop ASUS Vivobook 14 OLED (M1405VA)</span>
<span class="font-body-sm text-body-sm text-ink-muted mt-1">Phân loại: i5 · 16GB · 512GB | Màu: Bạc Ánh Trăng</span>
<span class="font-label-code text-label-code text-ink-faint mt-1">Số lượng: 1</span>
</div>
</div>
<div class="sm:text-right shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
<p class="font-label-code text-headline-3 text-ink font-semibold">14.990.000 ₫</p>
<span class="font-label-micro text-label-micro text-jade uppercase font-semibold">Bảo hành 24 tháng</span>
</div>
</div>
<!-- Product 2 -->
<div class="p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
<div class="flex items-start gap-4">
<img class="w-20 h-24 rounded-lg object-cover bg-rice-paper shrink-0" data-alt="High quality product photo of Sony WH-CH720N over-ear wireless noise canceling headphones in classic matte black, resting gracefully beside a ceramic tea set on folded woven Vietnamese silk cloth, warm gentle lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhqw14zzJJ4Jx_wgd67ar9McRV4Az80kNi3SOC8-Cnqr3s8ZDRwdyPMHViVC8YW1dwK0KwQFtYjt0jfgikEsodicZS3E0bwZdjmVm3RreEKs0Y8oGs0NoNiUVW5X5mExaQ6SIBTffilS6zds0ToAaYEwXgGbWMhHAthQOSZYzt-3YRzRUP8CiLYrGMfg_fbwxYazNCX1RbA01J4viSmbvrZx6PLm4nykojI2Noaw"/>
<div class="flex flex-col">
<span class="font-body-md text-body-md font-semibold text-ink line-clamp-2">Tai nghe không dây chống ồn Sony WH-CH720N</span>
<span class="font-body-sm text-body-sm text-ink-muted mt-1">Phân loại: Màu sắc: Đen Cổ Điển · Chống ồn chủ động ANC</span>
<span class="font-label-code text-label-code text-ink-faint mt-1">Số lượng: 1</span>
</div>
</div>
<div class="sm:text-right shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
<p class="font-label-code text-headline-3 text-ink font-semibold">2.490.000 ₫</p>
<span class="font-label-micro text-label-micro text-jade uppercase font-semibold">Bảo hành 12 tháng</span>
</div>
</div>
<!-- Ledger Price Calculations -->
<div class="p-space-md bg-rice-paper/40 space-y-2">
<div class="flex justify-between font-body-sm text-body-sm">
<span class="text-ink-muted">Tạm tính (2 món):</span>
<span class="font-label-code text-label-code font-medium text-ink">17.480.000 ₫</span>
</div>
<div class="flex justify-between font-body-sm text-body-sm">
<span class="text-ink-muted">Phí vận chuyển tiêu chuẩn:</span>
<span class="font-label-code text-label-code text-ink">30.000 ₫</span>
</div>
<div class="flex justify-between font-body-sm text-body-sm text-jade">
<span class="inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">local_offer</span>
<span>Ưu đãi Freeship Nếp:</span>
</span>
<span class="font-label-code text-label-code font-semibold">-30.000 ₫</span>
</div>
<div class="flex justify-between font-body-sm text-body-sm text-lacquer-red">
<span class="inline-flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">redeem</span>
<span>Voucher giảm giá gian hàng:</span>
</span>
<span class="font-label-code text-label-code font-semibold">-50.000 ₫</span>
</div>
<div class="pt-3 mt-2 flex justify-between items-baseline">
<div>
<span class="font-body-md text-body-md font-bold text-ink">Tổng thanh toán:</span>
<p class="font-label-micro text-label-micro text-ink-muted uppercase">Đã bao gồm thuế GTGT &amp; bảo hiểm hàng hoá</p>
</div>
<span class="font-label-code text-headline-2 text-lacquer-deep font-bold">17.430.000 ₫</span>
</div>
</div>
</section>
<!-- 4. Delivery & Payment Details Card -->
<section class="bg-warm-porcelain rounded-xl p-space-md md:p-space-lg shadow-sm">
<div class="flex items-center gap-2 mb-space-md">
<span class="material-symbols-outlined text-lacquer-red text-[22px]">assignment</span>
<h2 class="font-headline-3 text-headline-3 text-ink">Thông tin nhận hàng &amp; Thanh toán</h2>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
<!-- Recipient Information -->
<div class="space-y-3">
<div class="flex items-center gap-1.5 text-ink-muted font-label-micro text-label-micro uppercase tracking-wider font-semibold">
<span class="material-symbols-outlined text-[16px] text-ink-muted">pin_drop</span>
<span>Địa chỉ nhận hàng</span>
</div>
<div>
<p class="font-body-md text-body-md font-semibold text-ink">Nguyễn Thu Hà</p>
<p class="font-label-code text-label-code text-ink-muted mt-0.5">0912 345 678</p>
<p class="font-body-sm text-body-sm text-ink-muted mt-1 leading-relaxed">
                  Số 18, Ngõ 42, Phố Tràng Tiền, Phường Tràng Tiền, Quận Hoàn Kiếm, TP. Hà Nội.
                </p>
</div>
<div class="pt-3">
<div class="flex items-center gap-1.5 text-ink-muted font-label-micro text-label-micro uppercase tracking-wider font-semibold">
<span class="material-symbols-outlined text-[16px] text-ink-muted">local_shipping</span>
<span>Phương thức giao</span>
</div>
<p class="font-body-sm text-body-sm text-ink font-medium mt-1">Giao hàng tiêu chuẩn Nếp (VNPost Express)</p>
<div class="flex items-center gap-2 mt-1.5">
<span class="font-label-code text-label-code text-ink-muted px-2 py-0.5 rounded bg-rice-paper">#VNPOST-8849204VN</span>
<button class="text-lacquer-red hover:text-lacquer-deep text-body-sm font-body-sm flex items-center gap-0.5 transition-colors" onclick="navigator.clipboard?.writeText('VNPOST-8849204VN'); alert('Đã sao chép mã vận đơn: VNPOST-8849204VN')" type="button">
<span class="material-symbols-outlined text-[16px]">content_copy</span>
<span>Sao chép</span>
</button>
</div>
</div>
</div>
<!-- Payment & Security Note -->
<div class="space-y-3">
<div class="flex items-center gap-1.5 text-ink-muted font-label-micro text-label-micro uppercase tracking-wider font-semibold">
<span class="material-symbols-outlined text-[16px] text-ink-muted">credit_card</span>
<span>Phương thức thanh toán</span>
</div>
<div>
<div class="flex items-center gap-2">
<span class="font-body-md text-body-md font-medium text-ink">Stripe — Thẻ quốc tế Visa</span>
<span class="font-label-code text-label-code text-ink-muted">•••• 4242</span>
</div>
<div class="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-jade/10 text-jade font-label-micro text-label-micro font-semibold uppercase">
<span class="material-symbols-outlined text-[14px]">check_circle</span>
<span>Đã thanh toán (Hoàn tất)</span>
</div>
</div>
<!-- Guarantee Box -->
<div class="p-3 bg-rice-paper/60 rounded-xl space-y-1.5">
<div class="flex items-center gap-1.5 text-jade font-semibold font-body-sm text-body-sm">
<span class="material-symbols-outlined text-[18px]">verified_user</span>
<span>Bảo hộ kiểm hàng Nếp</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
                  Đồng kiểm khi nhận, 7 ngày đổi trả nếu phát sinh lỗi từ nhà sản xuất. Khoản tiền thanh toán được tạm giữ an toàn qua Quỹ Ký Quỹ ShopNest cho đến khi bạn xác nhận hài lòng.
                </p>
</div>
</div>
</div>
</section>
</div>
<!-- RIGHT COLUMN (4 cols - Sticky Action & Support Panel) -->
<aside class="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-space-md">
<!-- Actions Card -->
<div class="bg-warm-porcelain rounded-xl p-space-md md:p-space-lg shadow-sm space-y-space-md">
<div class="flex items-center justify-between">
<h2 class="font-headline-3 text-headline-3 text-ink font-semibold">Thao tác đơn hàng</h2>
<span class="w-2 h-2 rounded-full bg-turmeric animate-pulse" id="panel-pulse"></span>
</div>
<!-- CTAs -->
<div class="space-y-2.5">
<a class="h-12 w-full rounded-xl bg-lacquer-red hover:bg-lacquer-deep active:scale-[0.99] text-warm-porcelain font-body-sm text-body-sm font-semibold inline-flex items-center justify-center gap-2 transition-all shadow-sm" href="https://vietnampost.vn" rel="noopener noreferrer" target="_blank">
<span class="material-symbols-outlined text-[20px]">near_me</span>
<span>Theo dõi lộ trình (VNPost)</span>
</a>
<button class="h-11 w-full rounded-xl bg-transparent hover:bg-lacquer-wash/50 text-ink font-body-sm text-body-sm font-medium inline-flex items-center justify-center gap-2 transition-all" onclick="alert('Đang tải hoá đơn điện tử VAT định dạng PDF (Mã hoá đơn: VAT-SN24817)...')" type="button">
<span class="material-symbols-outlined text-[20px] text-ink-muted">receipt_long</span>
<span>Tải hoá đơn VAT (PDF)</span>
</button>
</div>
<!-- Quiet Action Links -->
<div class="space-y-1.5 pt-2">
<button class="w-full text-left py-2 px-1 text-ink hover:text-lacquer-red text-body-sm font-body-sm flex items-center justify-between group transition-colors" id="btn-return-action" onclick="setSimState('return_req')" type="button">
<span class="flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-muted group-hover:text-lacquer-red">assignment_return</span>
<span>Yêu cầu trả hàng / Hoàn tiền</span>
</span>
<span class="material-symbols-outlined text-[16px] text-ink-faint group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</button>
<button class="w-full text-left py-2 px-1 text-ink-muted hover:text-ink text-body-sm font-body-sm flex items-center justify-between group transition-colors" id="btn-review-action" onclick="alert('Bạn có thể gửi đánh giá kèm hình ảnh sau khi nhận hàng thành công.')" type="button">
<span class="flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-muted group-hover:text-lacquer-red">rate_review</span>
<span>Đánh giá sản phẩm</span>
</span>
<span class="font-label-micro text-label-micro text-ink-faint">Sau khi nhận</span>
</button>
<button class="w-full text-left py-2 px-1 text-ink hover:text-lacquer-red text-body-sm font-body-sm flex items-center justify-between group transition-colors" onclick="alert('Đã thêm 2 sản phẩm vào lại giỏ hàng của bạn!')" type="button">
<span class="flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-ink-muted group-hover:text-lacquer-red">replay</span>
<span>Mua lại giỏ hàng này</span>
</span>
<span class="material-symbols-outlined text-[16px] text-ink-faint group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</button>
</div>
<!-- Support Block -->
<div class="pt-4 space-y-3 bg-rice-paper/50 rounded-xl p-3.5" id="support-section">
<div>
<p class="font-body-sm text-body-sm font-semibold text-ink">Hỗ trợ đơn hàng này?</p>
<p class="font-body-sm text-body-sm text-ink-muted">Gian hàng: <span class="font-medium text-ink">TechNest Official</span></p>
</div>
<button class="w-full h-10 rounded-lg bg-lacquer-wash hover:bg-lacquer-wash/80 text-lacquer-deep font-body-sm text-body-sm font-semibold inline-flex items-center justify-center gap-2 transition-all" onclick="alert('Đang mở hộp thoại chat trực tiếp với cửa hàng TechNest Official...')" type="button">
<span class="material-symbols-outlined text-[18px]">forum</span>
<span>Chat ngay với người bán</span>
</button>
<div class="flex items-center justify-between pt-1 font-body-sm text-body-sm">
<span class="text-ink-muted">Hotline Nếp 24/7:</span>
<a class="font-label-code text-label-code font-bold text-lacquer-red hover:underline" href="tel:19006886">1900 6886 <span class="text-ink-faint font-normal font-body-sm text-body-sm">(nhánh 1)</span></a>
</div>
<div class="p-2.5 rounded bg-warm-porcelain text-body-sm font-body-sm text-ink-muted leading-snug">
<span class="font-semibold text-ink block mb-0.5">Lưu ý mở hộp:</span>
              Quý khách vui lòng quay video quá trình mở niêm phong hộp và đồng kiểm tình trạng ngoại quan cùng bưu tá.
            </div>
</div>
</div>
<!-- Trust Mini Banner -->
<div class="bg-warm-porcelain rounded-xl p-3.5 shadow-sm flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-jade/10 text-jade flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[22px]">shield</span>
</div>
<div>
<p class="font-body-sm text-body-sm font-semibold text-ink">Cam kết ShopNest</p>
<p class="font-body-sm text-body-sm text-ink-muted text-xs">100% hàng chính hãng có giấy uỷ quyền phân phối và hoá đơn VAT hợp lệ.</p>
</div>
</div>
</aside>
</div>
</div>
</div>
<script>
  function setSimState(state) {
    const badge = document.getElementById('order-status-badge');
    const pulseDot = document.getElementById('panel-pulse');
    const activeTrack = document.getElementById('timeline-active-track');
    const stepActiveContainer = document.getElementById('step-active-container');
    const stepActiveDot = document.getElementById('step-active-dot');
    const stepActiveBox = document.getElementById('step-active-box');
    const stepActiveTitle = document.getElementById('step-active-title');
    const stepActiveTime = document.getElementById('step-active-time');
    const stepActiveDesc = document.getElementById('step-active-desc');
    const stepDeliveryContainer = document.getElementById('step-delivery-container');
    const stepDeliveryDot = document.getElementById('step-delivery-dot');
    const stepDeliveryTitle = document.getElementById('step-delivery-title');
    const stepDeliveryTime = document.getElementById('step-delivery-time');
    const stepDeliveryDesc = document.getElementById('step-delivery-desc');
    const estDeliveryText = document.getElementById('est-delivery-text');
    const reviewBtn = document.getElementById('btn-review-action');

    // Reset button styles
    document.querySelectorAll('.sim-btn').forEach(btn => {
      btn.className = 'sim-btn px-3 py-1.5 rounded-lg font-body-sm text-body-sm bg-rice-paper text-ink hover:bg-lacquer-wash/60 transition-all';
    });
    const curBtn = document.getElementById('sim-' + state);
    if (curBtn) {
      curBtn.className = 'sim-btn px-3 py-1.5 rounded-lg font-body-sm text-body-sm bg-lacquer-red text-warm-porcelain font-medium transition-all shadow-sm';
    }

    if (state === 'in_transit') {
      badge.className = 'px-2.5 py-1 rounded-full font-label-micro text-label-micro uppercase font-semibold bg-turmeric/10 text-turmeric tracking-wider inline-flex items-center gap-1.5';
      badge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-turmeric animate-pulse"></span><span>Đang giao hàng</span>';
      pulseDot.className = 'w-2 h-2 rounded-full bg-turmeric animate-pulse';
      activeTrack.style.height = '75%';
      activeTrack.className = 'absolute left-3 md:left-4 top-2 h-[75%] w-0.5 bg-jade -translate-x-1/2 transition-all duration-300';

      stepActiveDot.className = 'absolute -left-6 md:-left-8 top-0.5 w-6 h-6 rounded-full bg-lacquer-red flex items-center justify-center text-warm-porcelain z-10 ring-4 ring-lacquer-wash animate-pulse';
      stepActiveDot.innerHTML = '<span class="material-symbols-outlined text-[14px]">local_shipping</span>';
      stepActiveBox.className = 'flex-1 min-w-0 p-3 rounded-lg bg-lacquer-wash/30';
      stepActiveTitle.className = 'font-body-md text-body-md font-bold text-lacquer-deep';
      stepActiveTitle.innerText = 'Đang giao hàng';
      stepActiveTime.innerText = '08:15 · 13/11/2026';
      stepActiveDesc.innerHTML = 'Bưu tá <span class="font-semibold text-ink">Nguyễn Văn Hùng</span> (<a href="tel:0982123456" class="font-label-code text-label-code text-lacquer-red hover:underline">0982 123 456</a>) đang trên tuyến đường giao kiện hàng tới địa chỉ nhận của bạn.';

      stepDeliveryContainer.className = 'relative flex items-start gap-4 opacity-75';
      stepDeliveryDot.className = 'absolute -left-6 md:-left-8 top-1 w-6 h-6 rounded-full bg-rice-paper flex items-center justify-center text-ink-faint z-10';
      stepDeliveryDot.innerHTML = '<span class="w-2 h-2 rounded-full bg-ink-faint"></span>';
      stepDeliveryTitle.className = 'font-body-md text-body-md font-medium text-ink-muted';
      stepDeliveryTitle.innerText = 'Đã nhận hàng';
      stepDeliveryTime.innerText = 'Dự kiến: 14/11 - 15/11/2026';
      stepDeliveryDesc.innerText = 'Khách hàng kiểm tra hàng hoá và xác nhận nhận kiện hàng thành công.';
      estDeliveryText.innerText = '14/11 - 15/11/2026';
      estDeliveryText.className = 'font-label-code text-label-code text-lacquer-deep font-semibold';
    } 
    else if (state === 'delivered') {
      badge.className = 'px-2.5 py-1 rounded-full font-label-micro text-label-micro uppercase font-semibold bg-jade/10 text-jade tracking-wider inline-flex items-center gap-1.5';
      badge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-jade"></span><span>Đã nhận hàng</span>';
      pulseDot.className = 'w-2 h-2 rounded-full bg-jade';
      activeTrack.style.height = '100%';
      activeTrack.className = 'absolute left-3 md:left-4 top-2 h-[100%] w-0.5 bg-jade -translate-x-1/2 transition-all duration-300';

      stepActiveDot.className = 'absolute -left-6 md:-left-8 top-0.5 w-6 h-6 rounded-full bg-jade flex items-center justify-center text-warm-porcelain z-10';
      stepActiveDot.innerHTML = '<span class="material-symbols-outlined text-[14px]">check</span>';
      stepActiveBox.className = 'flex-1 min-w-0';
      stepActiveTitle.className = 'font-body-md text-body-md font-semibold text-ink';
      stepActiveTitle.innerText = 'Đang giao hàng';
      stepActiveTime.innerText = '08:15 · 13/11/2026';
      stepActiveDesc.innerHTML = 'Bưu tá Nguyễn Văn Hùng đã giao kiện hàng an toàn.';

      stepDeliveryContainer.className = 'relative flex items-start gap-4 opacity-100';
      stepDeliveryDot.className = 'absolute -left-6 md:-left-8 top-0.5 w-6 h-6 rounded-full bg-jade flex items-center justify-center text-warm-porcelain z-10 ring-4 ring-jade/20';
      stepDeliveryDot.innerHTML = '<span class="material-symbols-outlined text-[14px]">done_all</span>';
      stepDeliveryTitle.className = 'font-body-md text-body-md font-bold text-jade';
      stepDeliveryTitle.innerText = 'Đã giao thành công';
      stepDeliveryTime.innerText = '11:42 · 13/11/2026';
      stepDeliveryDesc.innerText = 'Người nhận Nguyễn Thu Hà đã ký xác nhận nhận hàng và hoàn tất đồng kiểm nguyên vẹn.';
      estDeliveryText.innerText = 'Đã hoàn tất lúc 11:42 13/11';
      estDeliveryText.className = 'font-label-code text-label-code text-jade font-semibold';
      
      // Update review button
      reviewBtn.className = 'w-full text-left py-2 px-1 text-ink hover:text-lacquer-red text-body-sm font-body-sm flex items-center justify-between group transition-colors';
      reviewBtn.onclick = function() { alert('Mở giao diện Đánh giá 5 sao cho đơn #SN-24817'); };
    } 
    else if (state === 'return_req') {
      badge.className = 'px-2.5 py-1 rounded-full font-label-micro text-label-micro uppercase font-semibold bg-lacquer-wash text-lacquer-deep tracking-wider inline-flex items-center gap-1.5';
      badge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-lacquer-red"></span><span>Yêu cầu trả hàng</span>';
      pulseDot.className = 'w-2 h-2 rounded-full bg-lacquer-red';
      
      stepActiveBox.className = 'flex-1 min-w-0 p-3 rounded-lg bg-lacquer-wash/40';
      stepActiveTitle.className = 'font-body-md text-body-md font-bold text-lacquer-deep';
      stepActiveTitle.innerText = 'Đã nộp yêu cầu Đổi trả / Hoàn tiền';
      stepActiveTime.innerText = 'Vừa xong';
      stepActiveDesc.innerHTML = 'Hệ thống đang gửi yêu cầu kiểm tra tới ShopNest & TechNest Official. Nhân viên sẽ liên hệ trong 24h.';
      estDeliveryText.innerText = 'Đang xử lý hoàn tiền';
      estDeliveryText.className = 'font-label-code text-label-code text-lacquer-red font-semibold';
    } 
    else if (state === 'cancelled') {
      badge.className = 'px-2.5 py-1 rounded-full font-label-micro text-label-micro uppercase font-semibold bg-rice-paper text-ink-muted tracking-wider inline-flex items-center gap-1.5';
      badge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-ink-muted"></span><span>Đã huỷ đơn</span>';
      pulseDot.className = 'w-2 h-2 rounded-full bg-ink-muted';
      activeTrack.style.height = '40%';
      activeTrack.className = 'absolute left-3 md:left-4 top-2 h-[40%] w-0.5 bg-ink-muted -translate-x-1/2';

      stepActiveDot.className = 'absolute -left-6 md:-left-8 top-0.5 w-6 h-6 rounded-full bg-rice-paper flex items-center justify-center text-ink-muted z-10';
      stepActiveDot.innerHTML = '<span class="material-symbols-outlined text-[14px]">close</span>';
      stepActiveBox.className = 'flex-1 min-w-0 p-3 rounded-lg bg-rice-paper';
      stepActiveTitle.className = 'font-body-md text-body-md font-bold text-ink';
      stepActiveTitle.innerText = 'Đơn hàng đã được huỷ bỏ';
      stepActiveTime.innerText = '16:00 · 12/11/2026';
      stepActiveDesc.innerHTML = 'Khoản tiền 17.430.000 ₫ đã hoàn về phương thức thanh toán gốc Stripe Visa **** 4242.';
      estDeliveryText.innerText = 'Đã đóng đơn hàng';
      estDeliveryText.className = 'font-label-code text-label-code text-ink-muted font-semibold';
    }
  }
</script></main><footer class="w-full bg-warm-porcelain border-t border-border mt-auto"><div class="w-full max-w-7xl mx-auto px-gutter lg:px-margin py-margin"><div class="flex flex-col md:flex-row items-center justify-between gap-space-md border-b border-border pb-space-lg mb-space-lg"><div class="flex items-center gap-space-sm"><img alt="ShopnestLogo.png" class="h-6 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><span class="font-headline-3 text-headline-3 text-lacquer-red">ShopNest</span><span class="font-body-sm text-body-sm text-ink-muted ml-2">Gìn giữ nếp sống thủ công &amp; tinh hoa bản địa</span></div><div class="flex items-center gap-space-lg"><a class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors" data-path="chinh-sach-bao-mat" href="#">Chính sách bảo mật</a><a class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors" data-path="dieu-khoan-dich-vu" href="#">Điều khoản dịch vụ</a><a class="font-body-sm text-body-sm text-ink-muted hover:text-lacquer-red transition-colors" data-path="trung-tam-tro-giup" href="#">Trung tâm trợ giúp</a></div></div><div class="flex flex-col sm:flex-row items-center justify-between text-ink-faint font-label-micro text-label-micro gap-space-xs"><p>© 2025 ShopNest Vietnam. Tất cả quyền được bảo lưu.</p><p class="font-label-code text-label-code text-ink-muted">Định dạng Nếp 1440 · Bản sắc Việt</p></div></div></footer></body></html>
```
### C03 - Yêu cầu trả hàng và chi tiết hoàn tiền
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><title>ShopNest - Sàn thương mại điện tử tuyển chọn Nếp sống Việt</title><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "on-tertiary-container": "#e9e0cf", "tertiary-fixed-dim": "#cec6b5", "primary": "#91221a", "inverse-surface": "#323029", "lacquer-red": "#B23A2F", "ink-muted": "#6B6458", "primary-container": "#b23a2f", "error": "#ba1a1a", "on-background": "#1d1c15", "inverse-primary": "#ffb4aa", "warm-porcelain": "#FFFCF4", "turmeric": "#8A5A1A", "surface-bright": "#fef9ee", "rice-paper": "#F6F1E6", "tertiary-fixed": "#eae2d1", "inverse-on-surface": "#f5f0e5", "on-surface-variant": "#58413e", "surface-variant": "#e7e2d7", "on-surface": "#1d1c15", "jade": "#2F6B57", "on-primary-container": "#ffd9d3", "on-primary-fixed-variant": "#891c16", "surface-container-low": "#f8f3e8", "surface": "#fef9ee", "ink": "#1D1B17", "surface-dim": "#dedacf", "background": "#fef9ee", "primary-fixed": "#ffdad5", "lacquer-deep": "#8C2A22", "on-tertiary-fixed": "#1f1b11", "on-secondary-fixed": "#1d1b17", "secondary-container": "#e8e2db", "on-primary": "#ffffff", "on-tertiary-fixed-variant": "#4b463a", "on-secondary": "#ffffff", "secondary-fixed-dim": "#cbc6bf", "on-tertiary": "#ffffff", "tertiary-container": "#696356", "on-error-container": "#93000a", "surface-tint": "#aa342a", "logo-blue": "#4991D8", "lacquer-wash": "#F2DCD5", "outline-variant": "#dfbfbb", "secondary-fixed": "#e8e2db", "on-secondary-fixed-variant": "#494641", "on-error": "#ffffff", "raw-linen": "#EDE4D3", "primary-fixed-dim": "#ffb4aa", "on-primary-fixed": "#410001", "tertiary": "#514b3f", "border": "#DCD1BE", "surface-container-lowest": "#ffffff", "error-container": "#ffdad6", "on-secondary-container": "#67645f", "outline": "#8c716d", "surface-container-highest": "#e7e2d7", "surface-container-high": "#ede8dd", "brick": "#8B2A24", "ink-faint": "#9A8F7F", "surface-container": "#f2ede2", "secondary": "#615e59" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": { "space-md": "1rem", "space-xs": "0.25rem", "gutter": "1.5rem", "space-xl": "2.5rem", "margin-mobile": "1.25rem", "gutter-mobile": "1rem", "margin": "3rem", "space-lg": "1.5rem", "space-sm": "0.5rem" }, "fontFamily": { "display-xl": [ "Newsreader" ], "body-md": [ "Be Vietnam Pro" ], "headline-1": [ "Newsreader" ], "label-micro": [ "Be Vietnam Pro" ], "display-lg-mobile": [ "Newsreader" ], "body-lg": [ "Be Vietnam Pro" ], "body-sm": [ "Be Vietnam Pro" ], "display-xl-mobile": [ "Newsreader" ], "label-code": [ "JetBrains Mono" ], "headline-2": [ "Newsreader" ], "headline-3": [ "Be Vietnam Pro" ], "display-lg": [ "Newsreader" ] }, "fontSize": { "display-xl": [ "64px", { "lineHeight": "60px", "letterSpacing": "-0.035em", "fontWeight": "600" } ], "body-md": [ "16px", { "lineHeight": "26px", "fontWeight": "400" } ], "headline-1": [ "36px", { "lineHeight": "40px", "letterSpacing": "-0.025em", "fontWeight": "600" } ], "label-micro": [ "12px", { "lineHeight": "16px", "letterSpacing": "0.12em", "fontWeight": "600" } ], "display-lg-mobile": [ "32px", { "lineHeight": "34px", "letterSpacing": "-0.025em", "fontWeight": "600" } ], "body-lg": [ "18px", { "lineHeight": "28px", "fontWeight": "400" } ], "body-sm": [ "14px", { "lineHeight": "21px", "fontWeight": "400" } ], "display-xl-mobile": [ "40px", { "lineHeight": "40px", "letterSpacing": "-0.03em", "fontWeight": "600" } ], "label-code": [ "14px", { "lineHeight": "20px", "fontWeight": "500" } ], "headline-2": [ "28px", { "lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600" } ], "headline-3": [ "18px", { "lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "600" } ], "display-lg": [ "48px", { "lineHeight": "48px", "letterSpacing": "-0.03em", "fontWeight": "600" } ] } } } };</script></head><body class="bg-background font-body-md text-on-surface selection:bg-lacquer-wash selection:text-lacquer-deep"><header class="fixed top-0 left-0 w-full z-50 bg-rice-paper/95 backdrop-blur-md border-b border-border"><div class="h-20 max-w-7xl mx-auto px-gutter flex items-center justify-between gap-space-lg"><div class="flex items-center gap-space-md shrink-0"><a class="flex items-center gap-space-sm" data-path="trang-chu" href="#"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD88qlAjog4xgtZAP9LnRr74fdpOr-ER1AQIEQoO6qRn8psFKE1siywE6UtKx44XApcR46xOZ1__VNyNa-yTCsNVwEx8V5bkRyHjEDpin6Sj4Ftm58OplHkUIvCHw-qpBFxo4K1tfB39dtmzo2MM-byJ94fix_MR3lrYgP3GwG3qg6C_JywRO53Ko_tLeOF_7imBtrQwP4yUFdVRgnCQs-7L1rNjgXfDQGphHDplA"/><span class="font-headline-3 text-headline-3 tracking-tight text-ink font-semibold">ShopNest</span></a><div class="h-5 w-px bg-border mx-space-xs hidden md:block"></div><nav aria-label="Breadcrumb" class="hidden xl:flex items-center gap-2 font-body-sm text-body-sm text-ink-muted"><a class="hover:text-lacquer-red transition-colors" data-path="tong-quan-tai-khoan" href="#">Tài khoản của tôi</a><span class="material-symbols-outlined text-[14px] text-ink-faint">chevron_right</span><a class="hover:text-lacquer-red transition-colors flex items-center gap-1" data-path="danh-sach-don-hang" href="#">Đơn mua <span class="font-label-code text-label-code text-ink">#SN-24817</span></a><span class="material-symbols-outlined text-[14px] text-ink-faint">chevron_right</span><span class="text-ink font-medium">Yêu cầu trả hàng &amp; hoàn tiền</span></nav></div><div class="flex-1 max-w-md hidden lg:block"><div class="relative flex items-center w-full"><span class="material-symbols-outlined absolute left-3 text-ink-faint text-[20px] pointer-events-none">search</span><input class="w-full h-11 pl-10 pr-4 bg-warm-porcelain border border-border rounded-lg font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-lacquer-red/20 focus:border-lacquer-red transition-all" placeholder="Tìm kiếm đơn hàng, mã sản phẩm..." type="text"/></div></div><div class="flex items-center gap-space-md"><nav class="hidden md:flex items-center gap-6 font-body-sm text-body-sm" data-active-classes="text-lacquer-red font-medium border-b-2 border-lacquer-red"><a class="text-ink-muted hover:text-ink py-2 transition-colors" data-path="danh-sach-don-hang" href="#">Đơn hàng</a><a class="text-ink-muted hover:text-ink py-2 transition-colors" data-path="trung-tam-tro-giup" href="#">Hỗ trợ</a></nav><div class="h-5 w-px bg-border hidden sm:block"></div><div class="flex items-center gap-3 pl-1"><div class="flex flex-col text-right hidden sm:block"><span class="font-body-sm text-body-sm font-semibold text-ink leading-tight">Nguyễn Thu Hà</span><span class="font-label-micro text-label-micro text-ink-muted uppercase tracking-wider">Thành viên Vàng</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div></header><main class="w-full pt-20 bg-background min-h-[calc(100vh-280px)]"><div class="flex flex-col w-full">
<!-- Simulation State Bar (Top Tooling) -->
<div class="w-full bg-raw-linen border-b border-border py-2.5 px-gutter sticky top-20 z-40">
<div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 font-body-sm text-body-sm">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-lacquer-red text-[18px]">tune</span>
<span class="font-medium text-ink">Mô phỏng trạng thái hồ sơ:</span>
</div>
<div class="flex flex-wrap items-center gap-1.5" id="sim-controls">
<button class="sim-btn px-3 py-1 rounded bg-warm-porcelain border border-lacquer-red text-lacquer-red font-medium transition-all shadow-sm" data-state-btn="form" onclick="switchState('form')" type="button">
          Tạo yêu cầu (Form)
        </button>
<button class="sim-btn px-3 py-1 rounded bg-transparent border border-border text-ink-muted hover:text-ink transition-all" data-state-btn="pending" onclick="switchState('pending')" type="button">
          Hồ sơ: Chờ duyệt
        </button>
<button class="sim-btn px-3 py-1 rounded bg-transparent border border-border text-ink-muted hover:text-ink transition-all" data-state-btn="approved" onclick="switchState('approved')" type="button">
          Hồ sơ: Đã duyệt &amp; Thu hồi
        </button>
<button class="sim-btn px-3 py-1 rounded bg-transparent border border-border text-ink-muted hover:text-ink transition-all" data-state-btn="refunded" onclick="switchState('refunded')" type="button">
          Hồ sơ: Đã hoàn tiền
        </button>
<button class="sim-btn px-3 py-1 rounded bg-transparent border border-border text-ink-muted hover:text-ink transition-all" data-state-btn="rejected" onclick="switchState('rejected')" type="button">
          Hồ sơ: Bị từ chối
        </button>
<button class="sim-btn px-3 py-1 rounded bg-transparent border border-border text-ink-muted hover:text-ink transition-all" data-state-btn="validation" onclick="switchState('validation')" type="button">
          Lỗi nhập liệu
        </button>
</div>
</div>
</div>
<!-- Main Viewport Canvas -->
<div class="max-w-7xl mx-auto px-gutter py-space-xl w-full">
<!-- ========================================== -->
<!-- VIEW 1: FORM TẠO YÊU CẦU TRẢ HÀNG (7/5 SPLIT) -->
<!-- ========================================== -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start" id="view-form">
<!-- Cột Trái: Biểu mẫu yêu cầu (7 Cột) -->
<section class="lg:col-span-7 flex flex-col gap-space-lg">
<!-- Tiêu đề & Thông tin Đơn hàng -->
<div class="space-y-1.5">
<div class="flex items-center gap-2">
<span class="font-label-micro text-label-micro uppercase tracking-wider text-lacquer-red font-semibold bg-lacquer-wash px-2 py-0.5 rounded">Bảo hộ Nếp Care</span>
<span class="text-ink-faint">/</span>
<span class="font-label-code text-label-code text-ink-muted">Mã đơn: #SN-24817</span>
</div>
<h1 class="font-headline-2 text-headline-2 text-ink font-semibold tracking-tight">Yêu cầu trả hàng &amp; hoàn tiền</h1>
<p class="font-body-sm text-body-sm text-ink-muted">Vui lòng cung cấp chính xác thông tin để quy trình thẩm định diễn ra minh bạch, an toàn.</p>
</div>
<!-- Banner Cam Kết Minh Bạch -->
<div class="p-space-md rounded-xl bg-warm-porcelain border border-border flex items-start gap-3">
<span class="material-symbols-outlined text-jade text-[22px] shrink-0 mt-0.5">verified_user</span>
<div class="space-y-1">
<p class="font-body-sm text-body-sm font-semibold text-ink">Bảo hộ người mua Nếp Care 15 ngày</p>
<p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
              Quý khách vui lòng cung cấp thông tin trung thực để Shop và ShopNest hỗ trợ xử lý nhanh chóng trong vòng <span class="text-ink font-medium">24–48h làm việc</span>. Khoản tiền thanh toán luôn được ký quỹ an toàn.
            </p>
</div>
</div>
<!-- Lỗi validation banner (ẩn/hiện theo state) -->
<div class="hidden p-space-md rounded-xl bg-brick/10 border border-brick text-brick flex items-start gap-3" id="validation-alert">
<span class="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
<div class="font-body-sm text-body-sm space-y-0.5">
<p class="font-semibold">Vui lòng hoàn thiện các trường bắt buộc</p>
<p class="text-on-surface">Bạn cần cung cấp mô tả chi tiết ít nhất 20 ký tự và xác nhận tải lên tối thiểu 1 hình ảnh hoặc video bằng chứng rõ nét.</p>
</div>
</div>
<!-- Form fields container -->
<form class="space-y-space-lg" id="return-form" onsubmit="event.preventDefault(); switchState('pending');">
<!-- Trường 0: Lựa chọn sản phẩm muốn hoàn trả -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-space-md">
<div class="flex items-center justify-between">
<label class="font-body-sm text-body-sm font-semibold text-ink flex items-center gap-1.5">
<span>Chọn sản phẩm cần trả hàng</span>
<span class="text-lacquer-red">*</span>
</label>
<span class="font-label-micro text-label-micro uppercase text-ink-muted">Đã chọn 1 / 2 sản phẩm</span>
</div>
<!-- Item 1: Laptop (Được chọn) -->
<label class="flex items-start gap-3.5 p-3.5 rounded-lg border border-lacquer-red/40 bg-lacquer-wash/20 cursor-pointer transition-all">
<input checked="" class="mt-1 h-4 w-4 rounded accent-lacquer-red cursor-pointer" id="prod-laptop" onchange="calculateRefund()" type="checkbox"/>
<div class="flex gap-3.5 flex-1 min-w-0">
<div class="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center shrink-0 border border-border overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Ảnh chụp sản phẩm máy tính xách tay màu xám nhôm nguyên khối đặt trên mặt bàn gỗ phong cách tối giản mộc mạc góc chụp chéo 45 độ ánh sáng dịu ấm tự nhiên" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIG_JmkadDgV_LySF4rWxUCpBFfr6vHTA0bwbzpgEhFELtVGOTRtHl4V4sJTy-iKa9u8olYIerqA_sxtpbodgAarB61T7nIAOBMe9XlL7260AF7WSkTgW2fN27yE0sMTU0VaaNE1HGCthL6bxUTohxuqAJyj-V9j-TvWlQxwHIOxYKQooN7Wm-dNPd5q6pGqKqarBCcpIWbjHoMfyn_SiV1BJgKKipd3IqWZX5_g"/>
</div>
<div class="flex-1 min-w-0 space-y-0.5">
<div class="flex items-center gap-2">
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Công nghệ · Máy tính</span>
</div>
<h2 class="font-body-sm text-body-sm font-semibold text-ink truncate">Laptop ASUS Vivobook 14 OLED (M1405VA)</h2>
<p class="font-body-sm text-body-sm text-ink-muted">Phân loại: i5 · 16GB · 512GB | Số lượng: 1</p>
<div class="font-label-code text-label-code font-semibold text-lacquer-red pt-0.5">14.990.000 ₫</div>
</div>
</div>
</label>
<!-- Item 2: Tai nghe (Chưa chọn) -->
<label class="flex items-start gap-3.5 p-3.5 rounded-lg border border-border bg-warm-porcelain hover:bg-surface-container-low cursor-pointer transition-all">
<input class="mt-1 h-4 w-4 rounded accent-lacquer-red cursor-pointer" id="prod-headphone" onchange="calculateRefund()" type="checkbox"/>
<div class="flex gap-3.5 flex-1 min-w-0">
<div class="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center shrink-0 border border-border overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Ảnh chụp tai nghe chụp tai màu đen nhám đặt trên nền vải linen mộc mạc có đổ bóng nhẹ nhàng tinh tế không gian sống cao cấp" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf2JXpuYdGf9SBRaOHtrLFzd34QRxYo-cmhaSnQpPN6SLpH1Dlf2cSG4cjFX-E2Nw78F7DpqMdRNk4x4g-2UfkogVfP5ojeIdQRVJe9bxhSzoOT6GERy8ti5jBCKUM6A4Yc5-CUC67m9paJGlffE2JpGDHpUzTcMAPe2M7SvYXRBGpsj_hI3ZCiLhYpj8GMuSGjauZfeNbpRHfKCKjf5NyPa1RR2USRc8oEMjEWA"/>
</div>
<div class="flex-1 min-w-0 space-y-0.5">
<div class="flex items-center gap-2">
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Âm thanh cá nhân</span>
</div>
<h2 class="font-body-sm text-body-sm font-semibold text-ink truncate">Tai nghe không dây chống ồn Sony WH-CH720N</h2>
<p class="font-body-sm text-body-sm text-ink-muted">Phân loại: Màu Đen · Bản Quốc tế | Số lượng: 1</p>
<div class="font-label-code text-label-code font-medium text-ink-muted pt-0.5">2.490.000 ₫</div>
</div>
</div>
</label>
</div>
<!-- Trường 1: Lý do trả hàng -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-3">
<label class="font-body-sm text-body-sm font-semibold text-ink flex items-center justify-between" for="return-reason">
<span>Lý do trả hàng &amp; hoàn tiền <span class="text-lacquer-red">*</span></span>
<span class="font-label-micro text-label-micro text-ink-muted font-normal">Quyết định phương thức xử lý</span>
</label>
<div class="relative">
<select class="w-full h-11 px-3.5 bg-warm-porcelain border border-border rounded-lg font-body-sm text-body-sm text-ink focus:outline-none focus:ring-2 focus:ring-lacquer-red/20 focus:border-lacquer-red appearance-none pr-10 cursor-pointer" id="return-reason">
<option selected="" value="defective">Sản phẩm bị lỗi kỹ thuật không hoạt động</option>
<option value="mismatch">Sản phẩm không đúng mô tả trên website</option>
<option value="damaged">Hư hỏng / móp méo khi vận chuyển</option>
<option value="no-need">Không còn nhu cầu sử dụng</option>
<option value="other">Lý do khác</option>
</select>
<span class="material-symbols-outlined absolute right-3 top-3 text-ink-muted pointer-events-none text-[20px]">expand_more</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-jade">info</span>
              Lỗi kỹ thuật phần cứng được bảo chứng hoàn toàn cước thu hồi 2 chiều.
            </p>
</div>
<!-- Trường 2: Mô tả chi tiết vấn đề -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-2">
<div class="flex items-center justify-between">
<label class="font-body-sm text-body-sm font-semibold text-ink" for="description">
                Mô tả chi tiết vấn đề <span class="text-lacquer-red">*</span>
</label>
<span class="font-label-code text-label-code text-ink-muted" id="char-counter">124/500 ký tự</span>
</div>
<textarea class="w-full p-3.5 bg-warm-porcelain border border-border rounded-lg font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-lacquer-red/20 focus:border-lacquer-red leading-relaxed" id="description" maxlength="500" oninput="updateCharCount(this)" rows="4">Máy mở nguồn nhưng màn hình OLED nhấp nháy liên tục sau 10 phút sử dụng, sạc pin không nhận dòng điện ổn định. Đã kiểm tra theo hướng dẫn của xưởng nhưng vẫn không khắc phục được.</textarea>
<p class="font-body-sm text-body-sm text-ink-muted">Mô tả càng chi tiết giúp kỹ thuật viên xác định lỗi chuẩn xác mà không cần đối soát lại nhiều lần.</p>
</div>
<!-- Trường 3: Bằng chứng hình ảnh / Video -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-space-md">
<div>
<label class="font-body-sm text-body-sm font-semibold text-ink flex items-center justify-between">
<span>Ảnh / Video minh chứng <span class="text-lacquer-red">*</span></span>
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Tối đa 5 ảnh &amp; 1 video</span>
</label>
<p class="font-body-sm text-body-sm text-ink-muted mt-1">Đính kèm ảnh cận cảnh tem niêm phong, số serial và hiện trạng lỗi để quá trình duyệt tự động diễn ra trong 24h.</p>
</div>
<!-- Upload Dropzone (Dashed border per Brand guidelines) -->
<div class="p-6 rounded-xl border border-dashed border-border bg-rice-paper/60 hover:bg-rice-paper text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
<div class="w-11 h-11 rounded-full bg-raw-linen flex items-center justify-center text-ink-muted group-hover:text-lacquer-red group-hover:bg-lacquer-wash/50 transition-colors">
<span class="material-symbols-outlined text-[24px]">cloud_upload</span>
</div>
<div class="font-body-sm text-body-sm text-ink">
<span class="font-semibold text-lacquer-red">Bấm để tải tệp lên</span> hoặc kéo thả vào đây
              </div>
<span class="font-label-micro text-label-micro text-ink-faint uppercase">JPG, PNG, MP4 dung lượng không quá 50MB</span>
</div>
<!-- Danh sách tệp đã tải lên -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
<!-- Item 1: Ảnh màn hình lỗi -->
<div class="p-2 rounded-lg border border-border bg-surface-container-low flex items-center gap-2.5 relative group">
<div class="w-12 h-12 rounded bg-surface shrink-0 border border-border overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Ảnh cận cảnh màn hình laptop xuất hiện sọc nhiễu ánh sáng tím do lỗi phần cứng tấm nền OLED được chụp trong phòng làm việc" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQdiAQBrMQCEq6BSTVnBk3_S-4Y-9QVuyMbpzu2wVa2C8hkp3oo7ir_I52PCJgUKB5xyNDunU6iCmCPu6qtyMvTGxeWuFm1hkWDL39nTBrHXasTuo7W4C4acNYepEVXX4sDVu4UyndNn3hOuxu2H-ru7p0OETZ5yXs3Pzvo9p8430ts3X8MEW6RlrPtiFU1f3basKHQ_VTsvpQg4FtLqBVAPfKNaMHxrZ8c034aA"/>
</div>
<div class="flex-1 min-w-0">
<p class="font-body-sm text-body-sm font-medium text-ink truncate">man_hinh_soc.jpg</p>
<p class="font-label-code text-label-code text-ink-muted text-xs">2.4 MB · Đã xác thực</p>
</div>
<button aria-label="Xóa tệp màn hình sọc" class="text-ink-faint hover:text-lacquer-red p-1 transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
<!-- Item 2: Tem số seri -->
<div class="p-2 rounded-lg border border-border bg-surface-container-low flex items-center gap-2.5 relative group">
<div class="w-12 h-12 rounded bg-surface shrink-0 border border-border overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Ảnh chụp tem số seri nguyên vẹn dán dưới đáy thân máy laptop Asus Vivobook với mã vạch rõ nét độ phân giải cao" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAT3qJjbUFqxKQKtfsGs682MMHGlgWmqWkqT_-XzgSyf1vemMX6AbZO9zDhlibnLswHxJHsXNQgJoAuXqslxKr925hBA8VyIY716TECljPni4seTau48yrYvuFTEjPRdyFHlqsJz4TrZqHuLRycvO0O_rkGN-_rPtLT1hf0wRSsRTZB3FPdpQ2w0rDI1P8zNqs_fEwJJZl4QH585liAtGXqGEpmLe4P5HL2idZvA"/>
</div>
<div class="flex-1 min-w-0">
<p class="font-body-sm text-body-sm font-medium text-ink truncate">tem_serial_sn.png</p>
<p class="font-label-code text-label-code text-ink-muted text-xs">1.8 MB · Rõ tem</p>
</div>
<button aria-label="Xóa tệp tem serial" class="text-ink-faint hover:text-lacquer-red p-1 transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
<!-- Item 3: Video mở hộp & cắm nguồn -->
<div class="p-2 rounded-lg border border-border bg-surface-container-low flex items-center gap-2.5 relative group">
<div class="w-12 h-12 rounded bg-ink/10 shrink-0 border border-border flex items-center justify-center">
<span class="material-symbols-outlined text-lacquer-red text-[20px]">videocam</span>
</div>
<div class="flex-1 min-w-0">
<p class="font-body-sm text-body-sm font-medium text-ink truncate">video_cam_nguon.mp4</p>
<p class="font-label-code text-label-code text-ink-muted text-xs">12.1 MB · 00:48</p>
</div>
<button aria-label="Xóa video bằng chứng" class="text-ink-faint hover:text-lacquer-red p-1 transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
</div>
</div>
<!-- Trường 4 & 5: Số tiền hoàn và Phương thức hoàn tiền -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-space-md">
<div>
<label class="font-body-sm text-body-sm font-semibold text-ink" for="refund-amount-display">Số tiền mong muốn hoàn</label>
<div class="mt-2 relative">
<input class="w-full h-12 px-3.5 bg-rice-paper/50 border border-border rounded-lg font-label-code text-headline-3 font-semibold text-lacquer-red focus:outline-none cursor-default" id="refund-amount-display" readonly="" type="text" value="14.990.000 ₫"/>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-1.5 leading-relaxed">
                Đã bao gồm thuế GTGT và giá trị thanh toán thực tế của sản phẩm đã chọn sau khi phân bổ ưu đãi mã giảm giá.
              </p>
</div>
<div class="pt-space-sm border-t border-border/80">
<label class="font-body-sm text-body-sm font-semibold text-ink block mb-space-sm">Phương thức hoàn tiền</label>
<div class="space-y-2.5">
<!-- Option 1: Hoàn về phương thức gốc -->
<label class="flex items-start gap-3 p-3.5 rounded-lg border border-lacquer-red/40 bg-lacquer-wash/20 cursor-pointer">
<input checked="" class="mt-1 h-4 w-4 accent-lacquer-red" name="refund-channel" type="radio"/>
<div class="flex-1 min-w-0">
<div class="flex items-center justify-between">
<span class="font-body-sm text-body-sm font-semibold text-ink">Hoàn về phương thức thanh toán gốc</span>
<span class="font-label-micro text-label-micro text-jade uppercase font-semibold">Khuyên dùng</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">
                      Thẻ tín dụng quốc tế Stripe (Visa <span class="font-label-code text-label-code text-ink">**** 4242</span>)
                    </p>
<p class="font-label-code text-label-code text-ink-muted text-xs mt-1">Thời gian ghi có tài khoản: 2–5 ngày làm việc theo quy định ngân hàng phát hành</p>
</div>
</label>
<!-- Option 2: Số dư ví ShopNest -->
<label class="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-warm-porcelain hover:bg-surface-container-low cursor-pointer transition-all">
<input class="mt-1 h-4 w-4 accent-lacquer-red" name="refund-channel" type="radio"/>
<div class="flex-1 min-w-0">
<div class="flex items-center justify-between">
<span class="font-body-sm text-body-sm font-semibold text-ink">Hoàn vào Số dư ví Nếp ShopNest</span>
<span class="font-label-micro text-label-micro text-turmeric uppercase font-semibold">Nhanh nhất (2h)</span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">Tiền nạp ngay vào ví tài khoản sau khi duyệt thành công, có thể rút về tài khoản nội địa bất kỳ lúc nào.</p>
</div>
</label>
</div>
</div>
</div>
<!-- Nhóm hành động gửi form & cam kết -->
<div class="space-y-space-md pt-space-xs">
<div class="flex flex-col sm:flex-row items-center gap-3">
<button class="w-full sm:flex-1 h-12 bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain font-body-sm text-body-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99]" type="submit">
<span class="material-symbols-outlined text-[20px]">assignment_turned_in</span>
<span>Gửi yêu cầu trả hàng &amp; hoàn tiền</span>
</button>
<a class="w-full sm:w-auto h-12 px-6 border border-border bg-transparent hover:bg-lacquer-wash text-ink font-body-sm text-body-sm font-medium rounded-xl transition-all flex items-center justify-center" data-path="chi-tiet-don-hang" href="#">
                Quay lại đơn hàng
              </a>
</div>
<!-- Cam kết pháp lý minh bạch -->
<p class="font-body-sm text-body-sm text-ink-faint leading-relaxed text-center sm:text-left">
              Bằng việc gửi yêu cầu, bạn xác nhận các thông tin trên là chính xác. Hành vi gian lận thông tin trả hàng có thể dẫn đến việc hạn chế quyền mua sắm bảo hộ Nếp Care theo Điều khoản dịch vụ ShopNest.
            </p>
</div>
</form>
</section>
<!-- Cột Phải: Sticky Order Summary & Chính sách (5 Cột) -->
<aside class="lg:col-span-5 space-y-space-lg lg:sticky lg:top-36">
<!-- Thẻ Tóm tắt Đơn hàng gốc -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-space-md">
<div class="flex items-center justify-between pb-3 border-b border-border">
<span class="font-label-micro text-label-micro uppercase tracking-wider text-ink-muted font-semibold">Tóm tắt đơn hàng</span>
<span class="font-label-code text-label-code text-ink font-medium">#SN-24817</span>
</div>
<!-- Gian hàng -->
<div class="flex items-center justify-between">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded-full bg-raw-linen flex items-center justify-center text-ink-muted">
<span class="material-symbols-outlined text-[18px]">storefront</span>
</div>
<div>
<p class="font-body-sm text-body-sm font-semibold text-ink">TechNest Official</p>
<span class="font-label-micro text-label-micro text-jade uppercase font-semibold">Gian hàng Nếp Việt</span>
</div>
</div>
<a class="font-body-sm text-body-sm text-lacquer-red hover:underline flex items-center gap-0.5" href="#">
<span class="material-symbols-outlined text-[16px]">chat</span> Chat
            </a>
</div>
<div class="h-px bg-border/60"></div>
<!-- Dòng kê khai chi tiết tiền -->
<div class="space-y-2.5 font-body-sm text-body-sm">
<div class="flex justify-between text-ink-muted">
<span>Ngày hoàn tất giao hàng:</span>
<span class="text-ink font-medium">13/11/2026</span>
</div>
<div class="flex justify-between text-ink-muted">
<span>Sản phẩm chọn hoàn lại (1):</span>
<span class="font-label-code text-label-code text-ink">14.990.000 ₫</span>
</div>
<div class="flex justify-between text-ink-muted">
<span>Phí bưu tá thu hồi tại nhà:</span>
<span class="text-jade font-medium">Miễn phí (Nếp Care)</span>
</div>
<div class="flex justify-between text-ink-muted">
<span>Khấu trừ voucher đơn hàng:</span>
<span class="font-label-code text-label-code text-ink-muted">0 ₫</span>
</div>
<div class="pt-3 border-t border-border flex justify-between items-baseline">
<span class="font-body-sm text-body-sm font-semibold text-ink">Tổng hoàn dự kiến:</span>
<span class="font-label-code text-headline-2 text-lacquer-red font-semibold" id="summary-total-refund">14.990.000 ₫</span>
</div>
</div>
</div>
<!-- Cam kết minh bạch 3 nguyên tắc (Không dark pattern) -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-space-md">
<div class="flex items-center gap-2 text-ink">
<span class="material-symbols-outlined text-lacquer-red text-[20px]">shield_with_heart</span>
<h2 class="font-body-sm text-body-sm font-semibold uppercase tracking-wider">Nguyên tắc bảo vệ quyền lợi</h2>
</div>
<ul class="space-y-3 font-body-sm text-body-sm text-ink-muted">
<li class="flex items-start gap-2.5">
<span class="font-label-code text-label-code text-lacquer-red font-bold mt-0.5 shrink-0">01.</span>
<span>ShopNest đóng băng số tiền thanh toán an toàn trong Quỹ bảo hộ, tuyệt đối không giải ngân cho người bán cho tới khi sự việc được làm rõ.</span>
</li>
<li class="flex items-start gap-2.5">
<span class="font-label-code text-label-code text-lacquer-red font-bold mt-0.5 shrink-0">02.</span>
<span>Bưu tá bưu chính quốc gia (VNPost) chủ động liên hệ hẹn giờ tới tận địa chỉ của bạn nhận lại thiết bị mà không thu thêm bất kỳ phụ phí nào.</span>
</li>
<li class="flex items-start gap-2.5">
<span class="font-label-code text-label-code text-lacquer-red font-bold mt-0.5 shrink-0">03.</span>
<span>Lệnh hoàn tiền được kích hoạt tự động theo thời gian thực ngay sau khi trung tâm thẩm định mở gói bưu kiện xác nhận tem niêm phong.</span>
</li>
</ul>
</div>
<!-- Hộp Hỗ trợ & Hotline khiếu nại -->
<div class="p-space-md rounded-xl bg-rice-paper border border-border flex items-center justify-between gap-4">
<div class="space-y-0.5">
<p class="font-body-sm text-body-sm font-semibold text-ink">Cần hỗ trợ trực tiếp?</p>
<p class="font-body-sm text-body-sm text-ink-muted">Tổng đài giải quyết tranh chấp Nếp Care</p>
</div>
<div class="text-right shrink-0">
<a class="font-label-code text-label-code font-bold text-lacquer-red hover:underline block" href="tel:19006886">1900 6886</a>
<span class="font-label-micro text-label-micro text-ink-faint">8:00 - 21:00</span>
</div>
</div>
</aside>
</div>
<!-- ========================================== -->
<!-- VIEW 2: CHI TIẾT HỒ SƠ HOÀN TIỀN (RETURN DETAIL) -->
<!-- ========================================== -->
<div class="hidden flex-col gap-space-lg" id="view-detail">
<!-- Hồ sơ Header: Mã số + Status Chip + Actions -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
<div class="space-y-1">
<div class="flex items-center gap-2">
<span class="font-label-micro text-label-micro uppercase tracking-wider text-ink-muted">Mã hồ sơ hoàn tiền:</span>
<span class="font-label-code text-body-md font-semibold text-ink">#RT-884920</span>
<span class="text-ink-faint">·</span>
<span class="font-body-sm text-body-sm text-ink-muted">Từ đơn hàng <a class="font-label-code text-label-code text-lacquer-red hover:underline font-medium" href="#">#SN-24817</a></span>
</div>
<div class="flex items-center gap-3">
<h1 class="font-headline-2 text-headline-2 text-ink font-semibold tracking-tight" id="detail-header-title">Hồ sơ trả hàng &amp; hoàn tiền</h1>
<span class="px-3 py-0.5 rounded-full font-label-micro text-label-micro font-semibold uppercase tracking-wider bg-turmeric/15 text-turmeric" id="detail-status-chip">
              Chờ xét duyệt (Pending)
            </span>
</div>
</div>
<div class="flex items-center gap-3 shrink-0">
<button class="h-10 px-4 rounded-lg border border-border bg-transparent hover:bg-lacquer-wash text-ink font-body-sm text-body-sm flex items-center gap-1.5 transition-colors" onclick="window.print()" type="button">
<span class="material-symbols-outlined text-[18px]">print</span>
<span>In biên nhận</span>
</button>
<a class="h-10 px-4 rounded-lg bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain font-body-sm text-body-sm font-semibold flex items-center gap-1.5 transition-colors" data-path="trung-tam-tro-giup" href="#">
<span class="material-symbols-outlined text-[18px]">support_agent</span>
<span>Liên hệ Chuyên viên</span>
</a>
</div>
</div>
<!-- Timeline Tiến Trình Xử Lý Hồ Sơ -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-space-md">
<h2 class="font-body-sm text-body-sm font-semibold uppercase tracking-wider text-ink-muted">Tiến trình thẩm định hồ sơ</h2>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
<!-- Bước 1: Tiếp nhận -->
<div class="p-3.5 rounded-lg bg-rice-paper/70 border border-jade/30 flex items-start gap-3">
<div class="w-7 h-7 rounded-full bg-jade text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5">
<span class="material-symbols-outlined text-[16px]">check</span>
</div>
<div class="space-y-0.5 min-w-0">
<p class="font-body-sm text-body-sm font-semibold text-ink">Tiếp nhận yêu cầu</p>
<p class="font-label-code text-label-code text-ink-muted text-xs">14:30 14/11/2026</p>
<p class="font-body-sm text-body-sm text-jade text-xs">Đã ghi nhận lên hệ thống</p>
</div>
</div>
<!-- Bước 2: Thẩm định (Dynamic State) -->
<div class="p-3.5 rounded-lg bg-warm-porcelain border border-turmeric flex items-start gap-3" id="step-2">
<div class="w-7 h-7 rounded-full bg-turmeric text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5" id="step-2-icon">
<span class="material-symbols-outlined text-[16px]">hourglass_top</span>
</div>
<div class="space-y-0.5 min-w-0">
<p class="font-body-sm text-body-sm font-semibold text-ink">Shop &amp; ShopNest duyệt</p>
<p class="font-label-code text-label-code text-ink-muted text-xs" id="step-2-time">Đang đối soát chứng từ</p>
<p class="font-body-sm text-body-sm text-turmeric text-xs" id="step-2-status">Dự kiến xong trước 16/11</p>
</div>
</div>
<!-- Bước 3: Thu hồi hàng -->
<div class="p-3.5 rounded-lg bg-rice-paper/40 border border-border flex items-start gap-3 opacity-60" id="step-3">
<div class="w-7 h-7 rounded-full bg-ink-faint text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5" id="step-3-icon">
<span class="material-symbols-outlined text-[16px]">local_shipping</span>
</div>
<div class="space-y-0.5 min-w-0">
<p class="font-body-sm text-body-sm font-semibold text-ink">Bưu tá thu hồi kiện hàng</p>
<p class="font-label-code text-label-code text-ink-muted text-xs" id="step-3-time">Chờ phê duyệt</p>
<p class="font-body-sm text-body-sm text-ink-muted text-xs" id="step-3-status">Thu tận nơi miễn phí</p>
</div>
</div>
<!-- Bước 4: Hoàn tiền -->
<div class="p-3.5 rounded-lg bg-rice-paper/40 border border-border flex items-start gap-3 opacity-60" id="step-4">
<div class="w-7 h-7 rounded-full bg-ink-faint text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5" id="step-4-icon">
<span class="material-symbols-outlined text-[16px]">payments</span>
</div>
<div class="space-y-0.5 min-w-0">
<p class="font-body-sm text-body-sm font-semibold text-ink">Hoàn tất hoàn tiền</p>
<p class="font-label-code text-label-code text-ink-muted text-xs" id="step-4-time">14.990.000 ₫</p>
<p class="font-body-sm text-body-sm text-ink-muted text-xs" id="step-4-status">Về thẻ Visa gốc</p>
</div>
</div>
</div>
</div>
<!-- Bố cục 2 Cột Chi Tiết Hồ Sơ -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
<!-- Cột 1 (7 cột): Thông tin sản phẩm & minh chứng từ khách hàng -->
<div class="lg:col-span-7 space-y-space-lg">
<!-- Thẻ sản phẩm yêu cầu hoàn trả -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-space-md">
<h2 class="font-body-sm text-body-sm font-semibold uppercase tracking-wider text-ink-muted">Sản phẩm gửi hoàn trả</h2>
<div class="flex items-start gap-4 p-3 rounded-lg bg-rice-paper/50 border border-border">
<div class="w-20 h-20 rounded-lg bg-surface shrink-0 border border-border overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Ảnh chụp máy tính xách tay Asus Vivobook màn hình mở sắc nét để trên bàn góc nhìn studio" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJNEtI75__AA_QCLlFMPQYcnbIR4UcSkdiJLrtlg0zjHVdqH09lr9Wb48VFeMQkgPD0bhbxoiVZxAJrFcnMU_jyc0Fo2vOR8AhCZqFjCsFHoLiiPtzhWK078fX2pxGDtJjE_rZj1fGEiabMOJtqiopBhX3ojLounGWOCcq3OtcEii8k1G1vRfTBX9bj9j7T0mXYdbixVuBl4M-DOHrZF4Naq0A2_bNiBzNpiDlwQ"/>
</div>
<div class="space-y-1 flex-1 min-w-0">
<span class="font-label-micro text-label-micro text-ink-muted uppercase">Gian hàng: TechNest Official</span>
<h3 class="font-body-sm text-body-sm font-semibold text-ink">Laptop ASUS Vivobook 14 OLED (M1405VA)</h3>
<p class="font-body-sm text-body-sm text-ink-muted">Phân loại hàng: Intel Core i5-13500H · 16GB RAM · 512GB SSD</p>
<div class="flex items-center justify-between pt-1">
<span class="font-body-sm text-body-sm text-ink-muted">Số lượng: <strong class="text-ink">1 máy</strong></span>
<span class="font-label-code text-label-code font-bold text-lacquer-red">14.990.000 ₫</span>
</div>
</div>
</div>
<!-- Lý do & Trích dẫn mô tả thực tế -->
<div class="space-y-2 pt-2 border-t border-border">
<div class="flex justify-between items-center text-body-sm">
<span class="font-semibold text-ink">Lý do khiếu nại:</span>
<span class="text-lacquer-red font-medium">Sản phẩm bị lỗi kỹ thuật không hoạt động</span>
</div>
<div>
<span class="font-body-sm text-body-sm font-semibold text-ink block mb-1">Mô tả chi tiết từ khách hàng:</span>
<p class="font-body-sm text-body-sm text-ink-muted p-3 rounded-lg bg-rice-paper/40 border border-border leading-relaxed italic">
                  "Máy mở nguồn nhưng màn hình OLED nhấp nháy liên tục sau 10 phút sử dụng, sạc pin không nhận dòng điện ổn định. Đã kiểm tra theo hướng dẫn của xưởng nhưng vẫn không khắc phục được."
                </p>
</div>
</div>
<!-- Ảnh & Video đính kèm -->
<div class="space-y-2 pt-2 border-t border-border">
<span class="font-body-sm text-body-sm font-semibold text-ink block">Bằng chứng gửi kèm (3 tệp):</span>
<div class="grid grid-cols-3 gap-3">
<div class="group relative rounded-lg border border-border overflow-hidden h-24 bg-surface cursor-pointer">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform" data-alt="Ảnh bằng chứng màn hình laptop nhấp nháy sọc tím góc chụp rõ tem seri" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9F400T0E9IK5OA40CkKrF8i-m_gtZuD9kcjKGKjGsSx2xUsxTi5rR_oPQVTsvJvHyzT8EOQCfpt1_BSxr3fgDU1YEMfkQ8rsTvDZ9jSg2M0urkJcCMzCckGk7GIWr55-51fuF-gYKG5uXsKGFH5gVvRFiOpaUPcjSZTVETK9li53kjYAWpPVpx5kN1dyWi354LhoeUEQdWKffPlh8Im2EoB-5iZUucevlFofwLw"/>
<div class="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-warm-porcelain transition-opacity">
<span class="material-symbols-outlined text-[20px]">zoom_in</span>
</div>
</div>
<div class="group relative rounded-lg border border-border overflow-hidden h-24 bg-surface cursor-pointer">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform" data-alt="Ảnh chụp tem số seri bảo hành của nhà sản xuất còn nguyên vẹn góc chụp sắc nét" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP-Ac7LkYMvXr3J1rPBpOMt8Uo11Lg6opyFgHtG9xYuCbNGneSJH_Ri8H8wCt1F9dQrJ3bWOPICzi-YqlaNzcBpeMFLtjl3JkQl52MXTckzWxxDWijBAqSnc7aIjdaHhhaDw9D7dzToFxZPLXCrZVK7yjN-TWuiE-FIS1LhbxjNrQhCC9AMKsCTf1Nm9bTjyScefnY-rlD0fnwZYMnDKqnlt403yuLgHM92JGUYA"/>
<div class="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-warm-porcelain transition-opacity">
<span class="material-symbols-outlined text-[20px]">zoom_in</span>
</div>
</div>
<div class="relative rounded-lg border border-border overflow-hidden h-24 bg-surface-container flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-lacquer-red text-[28px]">play_circle</span>
<span class="font-label-code text-label-code text-xs text-ink-muted">video_cam_nguon.mp4</span>
</div>
</div>
</div>
</div>
</div>
<!-- Cột 2 (5 cột): Phản hồi ShopNest, Khoản tiền & Hướng dẫn đóng gói -->
<div class="lg:col-span-5 space-y-space-lg">
<!-- Hộp phản hồi chính thức Nếp Care (Thay đổi linh hoạt theo state) -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-3" id="official-response-card">
<div class="flex items-center justify-between pb-2 border-b border-border">
<span class="font-label-micro text-label-micro uppercase tracking-wider text-ink-muted font-semibold">Ghi chú từ ShopNest &amp; Xưởng</span>
<span class="font-label-code text-label-code text-ink-muted">Cập nhật lúc 15:10</span>
</div>
<div class="space-y-2" id="response-content">
<div class="flex items-start gap-2.5">
<span class="material-symbols-outlined text-turmeric text-[20px] shrink-0 mt-0.5">pending_actions</span>
<p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
                  Chuyên viên khiếu nại Nếp Care đã chuyển dữ liệu hình ảnh cho bộ phận kỹ thuật xưởng TechNest. Thời gian phản hồi tối đa: <strong class="text-ink">18:00 ngày 15/11/2026</strong>. Bạn không cần làm gì thêm trong bước này.
                </p>
</div>
</div>
</div>
<!-- Chi tiết hoàn tiền & Phương thức -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-space-md">
<h2 class="font-body-sm text-body-sm font-semibold uppercase tracking-wider text-ink-muted">Chi tiết hoàn tiền</h2>
<div class="space-y-2 font-body-sm text-body-sm">
<div class="flex justify-between text-ink-muted">
<span>Giá trị hàng hoàn:</span>
<span class="font-label-code text-label-code text-ink">14.990.000 ₫</span>
</div>
<div class="flex justify-between text-ink-muted">
<span>Phí thu hồi hàng:</span>
<span class="text-jade font-medium">0 ₫ (Miễn phí)</span>
</div>
<div class="pt-2 border-t border-border flex justify-between items-baseline">
<span class="font-semibold text-ink">Số tiền hoàn thực nhận:</span>
<span class="font-label-code text-headline-3 font-bold text-lacquer-red">14.990.000 ₫</span>
</div>
</div>
<div class="p-3 rounded-lg bg-rice-paper/60 border border-border space-y-1">
<span class="font-label-micro text-label-micro uppercase text-ink-muted font-semibold">Tài khoản thụ hưởng:</span>
<p class="font-body-sm text-body-sm text-ink font-medium">Thẻ Quốc Tế Visa · Đuôi **** 4242</p>
<p class="font-body-sm text-body-sm text-ink-faint text-xs">Cổng đối soát thanh toán bảo hộ Stripe</p>
</div>
</div>
<!-- Hướng dẫn đóng gói khi được duyệt thu hồi -->
<div class="p-space-lg rounded-xl bg-warm-porcelain border border-border space-y-3" id="packing-guide-box">
<h2 class="font-body-sm text-body-sm font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-lacquer-red">inventory_2</span>
<span>Hướng dẫn đóng gói hoàn trả</span>
</h2>
<ul class="space-y-2 font-body-sm text-body-sm text-ink-muted list-disc list-inside">
<li>Đặt máy và đầy đủ củ sạc, dây cáp nguồn vào hộp gốc ban đầu.</li>
<li>Chèn xốp hoặc màng bong bóng xung quanh để chống sốc trong lúc vận chuyển.</li>
<li>Ghi mã hồ sơ <span class="font-label-code text-label-code text-ink font-semibold">#RT-884920</span> bên ngoài bưu kiện cho nhân viên VNPost khi nhận hàng.</li>
</ul>
</div>
</div>
</div>
</div>
</div>
</div>
<script>
  function updateCharCount(el) {
    const counter = document.getElementById('char-counter');
    if (counter) {
      counter.innerText = el.value.length + '/500 ký tự';
    }
  }

  function calculateRefund() {
    const cbLaptop = document.getElementById('prod-laptop');
    const cbHeadphone = document.getElementById('prod-headphone');
    const displayInput = document.getElementById('refund-amount-display');
    const summaryTotal = document.getElementById('summary-total-refund');
    
    let total = 0;
    if (cbLaptop && cbLaptop.checked) total += 14990000;
    if (cbHeadphone && cbHeadphone.checked) total += 2490000;

    const formatted = new Intl.NumberFormat('vi-VN').format(total) + ' ₫';
    if (displayInput) displayInput.value = formatted;
    if (summaryTotal) summaryTotal.innerText = formatted;
  }

  function switchState(state) {
    const viewForm = document.getElementById('view-form');
    const viewDetail = document.getElementById('view-detail');
    const valAlert = document.getElementById('validation-alert');
    const btns = document.querySelectorAll('.sim-btn');

    // Update active button state styling
    btns.forEach(btn => {
      if (btn.getAttribute('data-state-btn') === state) {
        btn.className = 'sim-btn px-3 py-1 rounded bg-warm-porcelain border border-lacquer-red text-lacquer-red font-semibold transition-all shadow-sm';
      } else {
        btn.className = 'sim-btn px-3 py-1 rounded bg-transparent border border-border text-ink-muted hover:text-ink transition-all';
      }
    });

    // Handle Form & Validation modes
    if (state === 'form') {
      viewForm.classList.remove('hidden');
      viewDetail.classList.add('hidden');
      viewDetail.classList.remove('flex');
      valAlert.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (state === 'validation') {
      viewForm.classList.remove('hidden');
      viewDetail.classList.add('hidden');
      viewDetail.classList.remove('flex');
      valAlert.classList.remove('hidden');
      const descArea = document.getElementById('description');
      if (descArea) descArea.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Detail States (pending, approved, refunded, rejected)
    viewForm.classList.add('hidden');
    viewDetail.classList.remove('hidden');
    viewDetail.classList.add('flex');
    valAlert.classList.add('hidden');

    const statusChip = document.getElementById('detail-status-chip');
    const respBox = document.getElementById('response-content');
    const step2 = document.getElementById('step-2');
    const step2Icon = document.getElementById('step-2-icon');
    const step2Status = document.getElementById('step-2-status');
    const step3 = document.getElementById('step-3');
    const step3Icon = document.getElementById('step-3-icon');
    const step3Status = document.getElementById('step-3-status');
    const step3Time = document.getElementById('step-3-time');
    const step4 = document.getElementById('step-4');
    const step4Icon = document.getElementById('step-4-icon');
    const step4Status = document.getElementById('step-4-status');
    const guideBox = document.getElementById('packing-guide-box');

    // Reset baseline classes
    step2.className = 'p-3.5 rounded-lg border flex items-start gap-3 ';
    step3.className = 'p-3.5 rounded-lg border flex items-start gap-3 ';
    step4.className = 'p-3.5 rounded-lg border flex items-start gap-3 ';

    if (state === 'pending') {
      statusChip.className = 'px-3 py-0.5 rounded-full font-label-micro text-label-micro font-semibold uppercase tracking-wider bg-turmeric/15 text-turmeric';
      statusChip.innerText = 'Chờ xét duyệt (Pending)';
      
      step2.classList.add('bg-warm-porcelain', 'border-turmeric');
      step2Icon.className = 'w-7 h-7 rounded-full bg-turmeric text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5';
      step2Icon.innerHTML = '<span class="material-symbols-outlined text-[16px]">hourglass_top</span>';
      step2Status.className = 'font-body-sm text-body-sm text-turmeric text-xs';
      step2Status.innerText = 'Dự kiến xong trước 16/11';

      step3.classList.add('bg-rice-paper/40', 'border-border', 'opacity-60');
      step3Icon.className = 'w-7 h-7 rounded-full bg-ink-faint text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5';
      step3Status.innerText = 'Thu tận nơi miễn phí';
      step3Time.innerText = 'Chờ phê duyệt';

      step4.classList.add('bg-rice-paper/40', 'border-border', 'opacity-60');
      step4Icon.className = 'w-7 h-7 rounded-full bg-ink-faint text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5';
      step4Status.innerText = 'Về thẻ Visa gốc';

      respBox.innerHTML = `
        <div class="flex items-start gap-2.5">
          <span class="material-symbols-outlined text-turmeric text-[20px] shrink-0 mt-0.5">pending_actions</span>
          <p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
            Chuyên viên khiếu nại Nếp Care đã chuyển dữ liệu hình ảnh cho bộ phận kỹ thuật xưởng TechNest. Thời gian phản hồi tối đa: <strong class="text-ink">18:00 ngày 15/11/2026</strong>. Bạn không cần làm gì thêm trong bước này.
          </p>
        </div>`;
      if (guideBox) guideBox.classList.remove('hidden');
    } 
    else if (state === 'approved') {
      statusChip.className = 'px-3 py-0.5 rounded-full font-label-micro text-label-micro font-semibold uppercase tracking-wider bg-jade/15 text-jade';
      statusChip.innerText = 'Đã duyệt - Thu hồi hàng (Approved)';

      step2.classList.add('bg-rice-paper/70', 'border-jade/30');
      step2Icon.className = 'w-7 h-7 rounded-full bg-jade text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5';
      step2Icon.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span>';
      step2Status.className = 'font-body-sm text-body-sm text-jade text-xs';
      step2Status.innerText = 'Đã đồng thuận chấp nhận';

      step3.classList.remove('opacity-60');
      step3.classList.add('bg-warm-porcelain', 'border-lacquer-red');
      step3Icon.className = 'w-7 h-7 rounded-full bg-lacquer-red text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5';
      step3Status.className = 'font-body-sm text-body-sm text-lacquer-red text-xs';
      step3Status.innerText = 'Mã bưu gửi: VN7749021';
      step3Time.innerText = 'Hẹn lấy: Sáng 16/11';

      step4.classList.add('bg-rice-paper/40', 'border-border', 'opacity-60');
      step4Icon.className = 'w-7 h-7 rounded-full bg-ink-faint text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5';
      step4Status.innerText = 'Kích hoạt sau khi nhận máy';

      respBox.innerHTML = `
        <div class="flex items-start gap-2.5">
          <span class="material-symbols-outlined text-jade text-[20px] shrink-0 mt-0.5">check_circle</span>
          <div class="space-y-1">
            <p class="font-body-sm text-body-sm text-ink font-semibold">Yêu cầu trả hàng đã được chấp thuận</p>
            <p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
              Xưởng TechNest đã xác nhận lỗi tấm nền màn hình qua hình ảnh. Bưu tá VNPost sẽ gọi trước khi đến nhận kiện hàng tại địa chỉ của quý khách trong khung giờ 08:30–11:30 ngày mai.
            </p>
          </div>
        </div>`;
      if (guideBox) guideBox.classList.remove('hidden');
    } 
    else if (state === 'refunded') {
      statusChip.className = 'px-3 py-0.5 rounded-full font-label-micro text-label-micro font-semibold uppercase tracking-wider bg-jade/15 text-jade';
      statusChip.innerText = 'Đã hoàn tiền (Refunded)';

      step2.classList.add('bg-rice-paper/70', 'border-jade/30');
      step2Icon.className = 'w-7 h-7 rounded-full bg-jade text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5';
      step2Icon.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span>';
      step2Status.className = 'font-body-sm text-body-sm text-jade text-xs';
      step2Status.innerText = 'Đã duyệt';

      step3.classList.add('bg-rice-paper/70', 'border-jade/30');
      step3Icon.className = 'w-7 h-7 rounded-full bg-jade text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5';
      step3Icon.innerHTML = '<span class="material-symbols-outlined text-[16px]">check</span>';
      step3Status.className = 'font-body-sm text-body-sm text-jade text-xs';
      step3Status.innerText = 'Đã nhập kho kiểm thử';
      step3Time.innerText = 'Hoàn tất lúc 11:20 17/11';

      step4.classList.remove('opacity-60');
      step4.classList.add('bg-warm-porcelain', 'border-jade');
      step4Icon.className = 'w-7 h-7 rounded-full bg-jade text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5';
      step4Icon.innerHTML = '<span class="material-symbols-outlined text-[16px]">done_all</span>';
      step4Status.className = 'font-body-sm text-body-sm text-jade font-semibold text-xs';
      step4Status.innerText = 'Đã chuyển 14.990.000 ₫';

      respBox.innerHTML = `
        <div class="flex items-start gap-2.5">
          <span class="material-symbols-outlined text-jade text-[20px] shrink-0 mt-0.5">verified</span>
          <div class="space-y-1">
            <p class="font-body-sm text-body-sm text-ink font-semibold">Hoàn tất hoàn tiền 100%</p>
            <p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
              Mã giao dịch ngân hàng: <span class="font-label-code text-label-code text-ink font-semibold">#STR-VN-992031</span>. Khoản tiền 14.990.000 ₫ đã được hoàn trả về thẻ Visa **** 4242 của bạn. Cảm ơn sự đồng hành minh bạch của bạn cùng ShopNest.
            </p>
          </div>
        </div>`;
      if (guideBox) guideBox.classList.add('hidden');
    }
    else if (state === 'rejected') {
      statusChip.className = 'px-3 py-0.5 rounded-full font-label-micro text-label-micro font-semibold uppercase tracking-wider bg-brick/15 text-brick';
      statusChip.innerText = 'Từ chối hoàn tiền (Rejected)';

      step2.classList.add('bg-brick/10', 'border-brick');
      step2Icon.className = 'w-7 h-7 rounded-full bg-brick text-warm-porcelain flex items-center justify-center shrink-0 text-sm font-semibold mt-0.5';
      step2Icon.innerHTML = '<span class="material-symbols-outlined text-[16px]">close</span>';
      step2Status.className = 'font-body-sm text-body-sm text-brick text-xs font-semibold';
      step2Status.innerText = 'Từ chối yêu cầu';

      step3.classList.add('bg-rice-paper/40', 'border-border', 'opacity-40');
      step4.classList.add('bg-rice-paper/40', 'border-border', 'opacity-40');

      respBox.innerHTML = `
        <div class="flex items-start gap-2.5">
          <span class="material-symbols-outlined text-brick text-[20px] shrink-0 mt-0.5">report_problem</span>
          <div class="space-y-1">
            <p class="font-body-sm text-body-sm text-brick font-semibold">Hồ sơ chưa đủ điều kiện hoàn trả theo quy chuẩn</p>
            <p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
              Hình ảnh tem số serial bị mờ, không khớp với thông tin xuất kho từ Asus Việt Nam. Bạn có 48 giờ để cung cấp lại video sắc nét hoặc gửi văn bản khiếu nại lên Hội đồng giám định Nếp Care.
            </p>
            <div class="pt-2">
              <button type="button" onclick="switchState('form')" class="text-lacquer-red font-semibold font-body-sm text-body-sm hover:underline flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">replay</span> Bổ sung thêm bằng chứng mới
              </button>
            </div>
          </div>
        </div>`;
      if (guideBox) guideBox.classList.add('hidden');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script></main><footer class="w-full bg-rice-paper border-t border-border mt-margin"><div class="max-w-7xl mx-auto px-gutter py-space-xl"><div class="grid grid-cols-1 md:grid-cols-4 gap-space-lg mb-space-xl"><div class="space-y-space-sm"><div class="flex items-center gap-space-sm"><img alt="ShopnestLogo.png" class="h-7 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHR8OB6xK3FnBEhx-kidcKTZVLCH2M1xCc3PoWQmpqyyj69CuQMjom-AKS3tQNUOVc3MbSxr00hnCeLK_3ix1mjSQmm41G2JrhHixSIIRwE2pxRvbEGK5TLfFZZWCaKzTQ3QNmfN5wDU_JvKpY5b-rcxzHDm-VJoVodMuL-1l4E6WKfpJE03xZ59KAGIoj2gjVPIdRdQmXwYN3q3aHHY49_Y6xXR3yFAglXUlKXw"/><span class="font-headline-3 text-headline-3 text-ink font-semibold">ShopNest</span></div><p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">Nền tảng tuyển chọn Nếp sống Việt hiện đại. Gìn giữ giá trị thủ công tinh tế trong từng đường nét đời sống gia đình.</p></div><div><h4 class="font-body-sm text-body-sm font-semibold text-ink uppercase tracking-wider mb-space-md">Chăm sóc khách hàng</h4><ul class="space-y-2 font-body-sm text-body-sm text-ink-muted"><li><a class="hover:text-lacquer-red transition-colors" data-path="trung-tam-tro-giup" href="#">Trung tâm trợ giúp</a></li><li><a class="hover:text-lacquer-red transition-colors" data-path="chinh-sach-tra-hang" href="#">Chính sách Trả hàng &amp; Hoàn tiền</a></li><li><a class="hover:text-lacquer-red transition-colors" data-path="quy-chuan-dong-goi" href="#">Quy chuẩn bảo quản &amp; đóng gói</a></li></ul></div><div><h4 class="font-body-sm text-body-sm font-semibold text-ink uppercase tracking-wider mb-space-md">Về ShopNest</h4><ul class="space-y-2 font-body-sm text-body-sm text-ink-muted"><li><a class="hover:text-lacquer-red transition-colors" data-path="cau-chuyen-thuong-hieu" href="#">Câu chuyện Nếp sống Việt</a></li><li><a class="hover:text-lacquer-red transition-colors" data-path="nghe-nhan-doi-tac" href="#">Nghệ nhân &amp; Đối tác bản địa</a></li><li><a class="hover:text-lacquer-red transition-colors" data-path="tuyen-dung" href="#">Cơ hội nghề nghiệp</a></li></ul></div><div><h4 class="font-body-sm text-body-sm font-semibold text-ink uppercase tracking-wider mb-space-md">Cam kết chất lượng</h4><p class="font-body-sm text-body-sm text-ink-muted leading-relaxed mb-space-sm">Minh bạch quy trình giải quyết hoàn tiền theo tiêu chuẩn bảo hộ quyền lợi người tiêu dùng và tôn trọng thợ thủ công.</p><div class="flex items-center gap-2 text-ink-faint font-label-code text-label-code"><span class="material-symbols-outlined text-[16px] text-jade">verified</span>Tiêu chuẩn Nếp Việt</div></div></div><div class="pt-space-md border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-ink-muted"><p>© 2024 ShopNest. Tinh hoa tuyển chọn Nếp sống Việt. Mọi quyền được bảo lưu.</p><div class="flex items-center gap-6 font-body-sm text-body-sm"><a class="hover:text-ink transition-colors" data-path="dieu-khoan-dich-vu" href="#">Điều khoản</a><a class="hover:text-ink transition-colors" data-path="chinh-sach-bao-mat" href="#">Bảo mật thông tin</a><a class="hover:text-ink transition-colors" data-path="quy-che-hoat-dong" href="#">Quy chế hoạt động</a></div></div></div></footer></body></html>
```
### C04 - Wishlist
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { colors: { "on-secondary-fixed-variant": "#494641", "secondary-container": "#e8e2db", "jade": "#2F6B57", "brick": "#8B2A24", "on-primary-container": "#ffd9d3", "lacquer-wash": "#F2DCD5", "lacquer-red": "#B23A2F", "on-error": "#ffffff", "on-primary-fixed": "#410001", "surface-container": "#f2ede2", "surface-container-lowest": "#ffffff", "tertiary-fixed-dim": "#cec6b5", "on-tertiary-container": "#e9e0cf", "surface-container-low": "#f8f3e8", "inverse-primary": "#ffb4aa", "background": "#fef9ee", "on-error-container": "#93000a", "on-primary-fixed-variant": "#891c16", "surface-variant": "#e7e2d7", "outline-variant": "#dfbfbb", "error": "#ba1a1a", "raw-linen": "#EDE4D3", "border": "#DCD1BE", "ink": "#1D1B17", "on-secondary-fixed": "#1d1b17", "on-primary": "#ffffff", "on-background": "#1d1c15", "on-secondary": "#ffffff", "secondary-fixed": "#e8e2db", "lacquer-deep": "#8C2A22", "primary-fixed": "#ffdad5", "surface-tint": "#aa342a", "ink-muted": "#6B6458", "tertiary-container": "#696356", "ink-faint": "#9A8F7F", "tertiary-fixed": "#eae2d1", "primary-fixed-dim": "#ffb4aa", "surface-container-highest": "#e7e2d7", "outline": "#8c716d", "surface-container-high": "#ede8dd", "surface": "#fef9ee", "on-secondary-container": "#67645f", "on-tertiary": "#ffffff", "on-surface": "#1d1c15", "surface-bright": "#fef9ee", "surface-dim": "#dedacf", "inverse-surface": "#323029", "rice-paper": "#F6F1E6", "on-surface-variant": "#58413e", "secondary": "#615e59", "turmeric": "#8A5A1A", "secondary-fixed-dim": "#cbc6bf", "primary": "#91221a", "error-container": "#ffdad6", "logo-blue": "#4991D8", "inverse-on-surface": "#f5f0e5", "on-tertiary-fixed": "#1f1b11", "tertiary": "#514b3f", "on-tertiary-fixed-variant": "#4b463a", "warm-porcelain": "#FFFCF4", "primary-container": "#b23a2f" }, borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, spacing: { "gutter-mobile": "1rem", "space-md": "1rem", "space-lg": "1.5rem", "space-sm": "0.5rem", "space-xs": "0.25rem", "gutter": "1.5rem", "margin": "3rem", "margin-mobile": "1.25rem", "space-xl": "2.5rem" }, fontFamily: { "display-lg": ["Newsreader"], "body-md": ["Be Vietnam Pro"], "headline-2": ["Newsreader"], "display-lg-mobile": ["Newsreader"], "display-xl": ["Newsreader"], "label-micro": ["Be Vietnam Pro"], "headline-1": ["Newsreader"], "body-sm": ["Be Vietnam Pro"], "display-xl-mobile": ["Newsreader"], "label-code": ["JetBrains Mono"], "body-lg": ["Be Vietnam Pro"], "headline-3": ["Be Vietnam Pro"] }, fontSize: { "display-lg": ["48px", { lineHeight: "48px", letterSpacing: "-0.03em", fontWeight: "600" }], "body-md": ["16px", { lineHeight: "26px", fontWeight: "400" }], "headline-2": ["28px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "600" }], "display-lg-mobile": ["32px", { lineHeight: "34px", letterSpacing: "-0.025em", fontWeight: "600" }], "display-xl": ["64px", { lineHeight: "60px", letterSpacing: "-0.035em", fontWeight: "600" }], "label-micro": ["12px", { lineHeight: "16px", letterSpacing: "0.12em", fontWeight: "600" }], "headline-1": ["36px", { lineHeight: "40px", letterSpacing: "-0.025em", fontWeight: "600" }], "body-sm": ["14px", { lineHeight: "21px", fontWeight: "400" }], "display-xl-mobile": ["40px", { lineHeight: "40px", letterSpacing: "-0.03em", fontWeight: "600" }], "label-code": ["14px", { lineHeight: "20px", fontWeight: "500" }], "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }], "headline-3": ["18px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "600" }] } } } };</script></head><body class="bg-rice-paper text-on-surface font-body-md text-body-md"><header class="fixed top-0 left-0 right-0 z-50 bg-warm-porcelain/95 backdrop-blur-md border-b border-border"><div class="h-16 w-full px-gutter flex items-center justify-between gap-space-md"><div class="flex items-center gap-space-lg flex-shrink-0"><div class="flex items-center gap-space-sm"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><span class="font-headline-3 text-headline-3 text-ink tracking-tight">ShopNest</span></div><div class="relative hidden lg:block w-72"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint text-[18px]">search</span><input class="w-full h-9 pl-9 pr-3 rounded bg-surface-container-low border border-border text-ink text-body-sm font-body-sm focus:outline-none focus:border-primary" placeholder="Tìm kiếm sản phẩm, đơn hàng..." type="text"/></div></div><nav class="hidden xl:flex items-center gap-space-lg" data-active-classes="text-primary font-semibold"><a class="text-body-sm font-body-sm text-ink-muted hover:text-ink transition-colors" data-path="trang-chu" href="#">Trang chủ</a><a class="text-body-sm font-body-sm text-ink-muted hover:text-ink transition-colors" data-path="danh-muc" href="#">Danh mục</a><a class="text-body-sm font-body-sm text-ink-muted hover:text-ink transition-colors" data-path="khuyen-mai" href="#">Khuyến mãi</a><a class="text-body-sm font-body-sm text-ink-muted hover:text-ink transition-colors" data-path="shop-viet" href="#">Shop Việt</a><a class="text-body-sm font-body-sm text-ink-muted hover:text-ink transition-colors" data-path="don-hang-top" href="#">Đơn hàng</a></nav><div class="flex items-center gap-space-md flex-shrink-0"><div class="text-right hidden sm:block"><div class="text-body-sm font-body-sm font-semibold text-ink leading-tight">Nguyễn Thu Hà</div><div class="text-label-micro font-label-micro text-turmeric uppercase">THÀNH VIÊN NẾP VÀNG</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><aside class="fixed left-0 top-16 bottom-0 w-[220px] bg-warm-porcelain border-r border-border z-40 overflow-y-auto"><div class="py-space-md flex flex-col h-full"><nav class="flex flex-col space-y-0.5" data-active-classes="bg-rice-paper text-primary font-semibold border-l-[3px] border-primary"><a class="flex items-center gap-space-sm px-space-md py-2.5 text-body-sm font-body-sm text-ink-muted hover:bg-rice-paper hover:text-ink transition-colors border-l-[3px] border-transparent" data-path="don-mua" href="#"><span class="material-symbols-outlined text-[18px]">receipt_long</span><span>Đơn mua</span></a><div class="pt-space-sm pb-1"><div class="px-space-md py-1 text-label-micro font-label-micro uppercase text-ink-faint">Tài khoản của tôi</div><div class="flex flex-col"><a class="flex items-center gap-space-sm pl-8 pr-space-md py-2 text-body-sm font-body-sm text-ink-muted hover:bg-rice-paper hover:text-ink transition-colors border-l-[3px] border-transparent" data-path="ho-so" href="#"><span class="material-symbols-outlined text-[16px]">badge</span><span>Hồ sơ</span></a><a class="flex items-center gap-space-sm pl-8 pr-space-md py-2 text-body-sm font-body-sm text-ink-muted hover:bg-rice-paper hover:text-ink transition-colors border-l-[3px] border-transparent" data-path="dia-chi" href="#"><span class="material-symbols-outlined text-[16px]">location_on</span><span>Địa chỉ</span></a><a class="flex items-center gap-space-sm pl-8 pr-space-md py-2 text-body-sm font-body-sm text-ink-muted hover:bg-rice-paper hover:text-ink transition-colors border-l-[3px] border-transparent" data-path="doi-mat-khau" href="#"><span class="material-symbols-outlined text-[16px]">lock_reset</span><span>Đổi mật khẩu</span></a></div></div><a class="flex items-center gap-space-sm px-space-md py-2.5 text-body-sm font-body-sm text-primary font-semibold bg-rice-paper border-l-[3px] border-primary transition-colors" data-path="da-luu" href="#"><span class="material-symbols-outlined text-[18px] text-primary">bookmark</span><span>Đã lưu</span></a><a class="flex items-center gap-space-sm px-space-md py-2.5 text-body-sm font-body-sm text-ink-muted hover:bg-rice-paper hover:text-ink transition-colors border-l-[3px] border-transparent" data-path="kho-voucher-nep" href="#"><span class="material-symbols-outlined text-[18px]">confirmation_number</span><span>Kho voucher Nếp</span></a><a class="flex items-center gap-space-sm px-space-md py-2.5 text-body-sm font-body-sm text-ink-muted hover:bg-rice-paper hover:text-ink transition-colors border-l-[3px] border-transparent" data-path="thong-bao" href="#"><span class="material-symbols-outlined text-[18px]">notifications</span><span>Thông báo</span></a><a class="flex items-center gap-space-sm px-space-md py-2.5 text-body-sm font-body-sm text-ink-muted hover:bg-rice-paper hover:text-ink transition-colors border-l-[3px] border-transparent" data-path="ho-tro-khach-hang" href="#"><span class="material-symbols-outlined text-[18px]">help_outline</span><span>Hỗ trợ khách hàng</span></a></nav></div></aside><div class="pl-[220px]"><main class="relative pt-16 bg-rice-paper min-h-screen"><div class="flex flex-col w-full">
<!-- Interactive State Simulation Bar (Workspace / Demo Utility) -->
<div class="w-full bg-raw-linen/70 border-b border-border px-gutter py-2.5 flex flex-wrap items-center justify-between gap-space-sm text-body-sm font-body-sm select-none">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-ink-muted text-[18px]">tune</span>
<span class="font-headline-3 text-body-sm text-ink uppercase tracking-wider text-[11px]">Mô phỏng trạng thái:</span>
</div>
<div class="flex flex-wrap items-center gap-1.5" id="sim-controls">
<button class="px-2.5 py-1 text-label-micro font-label-micro rounded-lg bg-warm-porcelain border border-primary text-primary transition-colors flex items-center gap-1.5" id="btn-state-default" onclick="setSimState('default')">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span> Mặc định (6 món)
      </button>
<button class="px-2.5 py-1 text-label-micro font-label-micro rounded-lg bg-warm-porcelain border border-border text-ink-muted hover:text-ink transition-colors" id="btn-state-toast" onclick="setSimState('toast')">
        Đã xoá 1 món (Toast thông báo)
      </button>
<button class="px-2.5 py-1 text-label-micro font-label-micro rounded-lg bg-warm-porcelain border border-border text-ink-muted hover:text-ink transition-colors" id="btn-state-stock" onclick="setSimState('stock')">
        Lọc món hết hàng
      </button>
<button class="px-2.5 py-1 text-label-micro font-label-micro rounded-lg bg-warm-porcelain border border-border text-ink-muted hover:text-ink transition-colors" id="btn-state-empty" onclick="setSimState('empty')">
        Danh sách trống (0 món)
      </button>
</div>
</div>
<div class="w-full px-gutter py-space-xl max-w-7xl mx-auto flex flex-col space-y-space-lg">
<!-- Header Area: Title, Item Counter & Search -->
<div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md border-b border-border/70 pb-space-lg">
<div class="flex items-center gap-3">
<h1 class="font-body-md font-semibold text-headline-2 text-ink tracking-tight flex items-center gap-3">
<span>Đã lưu</span>
<span class="text-label-micro font-label-micro tracking-widest px-2.5 py-0.5 rounded-full bg-raw-linen border border-border text-ink-muted uppercase" id="wishlist-counter">6 MÓN</span>
</h1>
<span class="text-ink-faint text-body-sm hidden sm:inline">|</span>
<span class="text-body-sm font-body-sm text-ink-muted hidden sm:inline">Lưu trữ thong dong, gom đơn theo nếp sống riêng</span>
</div>
<!-- Search in wishlist -->
<div class="relative w-full md:w-80">
<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint text-[18px]">search</span>
<input class="w-full h-11 pl-10 pr-9 rounded-xl bg-warm-porcelain border border-border text-ink text-body-sm font-body-sm placeholder:text-ink-faint focus:outline-none focus:border-primary transition-colors" id="wishlist-search" oninput="handleSearch(this.value)" placeholder="Tìm kiếm trong danh sách đã lưu..." type="text"/>
<button class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink" onclick="document.getElementById('wishlist-search').value=''; handleSearch('')">
<span class="material-symbols-outlined text-[16px]">close</span>
</button>
</div>
</div>
<!-- Filters, Category Chips & Bulk Actions -->
<div class="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md" id="controls-section">
<!-- Category Filter Chips -->
<div class="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none" id="category-chips">
<button class="chip-active px-3 py-1.5 rounded-full text-label-micro font-label-micro bg-ink text-warm-porcelain border border-ink flex items-center gap-1.5 whitespace-nowrap transition-colors" onclick="filterCategory('all', this)">
<span>Tất cả</span>
<span class="text-[10px] font-label-code opacity-80">(6)</span>
</button>
<button class="chip-inactive px-3 py-1.5 rounded-full text-label-micro font-label-micro bg-warm-porcelain text-ink-muted border border-border hover:border-ink-muted flex items-center gap-1.5 whitespace-nowrap transition-colors" onclick="filterCategory('tech', this)">
<span>Điện tử &amp; Công nghệ</span>
<span class="text-[10px] font-label-code opacity-70">(2)</span>
</button>
<button class="chip-inactive px-3 py-1.5 rounded-full text-label-micro font-label-micro bg-warm-porcelain text-ink-muted border border-border hover:border-ink-muted flex items-center gap-1.5 whitespace-nowrap transition-colors" onclick="filterCategory('home', this)">
<span>Đồ gia dụng &amp; Bếp</span>
<span class="text-[10px] font-label-code opacity-70">(1)</span>
</button>
<button class="chip-inactive px-3 py-1.5 rounded-full text-label-micro font-label-micro bg-warm-porcelain text-ink-muted border border-border hover:border-ink-muted flex items-center gap-1.5 whitespace-nowrap transition-colors" onclick="filterCategory('ceramic', this)">
<span>Gốm thủ công</span>
<span class="text-[10px] font-label-code opacity-70">(1)</span>
</button>
<button class="chip-inactive px-3 py-1.5 rounded-full text-label-micro font-label-micro bg-warm-porcelain text-ink-muted border border-border hover:border-ink-muted flex items-center gap-1.5 whitespace-nowrap transition-colors" onclick="filterCategory('baby', this)">
<span>Mẹ &amp; Bé</span>
<span class="text-[10px] font-label-code opacity-70">(1)</span>
</button>
<button class="chip-inactive px-3 py-1.5 rounded-full text-label-micro font-label-micro bg-warm-porcelain text-ink-muted border border-border hover:border-ink-muted flex items-center gap-1.5 whitespace-nowrap transition-colors" onclick="filterCategory('fashion', this)">
<span>Thời trang &amp; Vải mộc</span>
<span class="text-[10px] font-label-code opacity-70">(1)</span>
</button>
</div>
<!-- Right Controls: Sort & Bulk Add -->
<div class="flex items-center justify-between sm:justify-end gap-space-sm flex-shrink-0">
<div class="relative inline-block text-left">
<select class="appearance-none h-10 pl-3.5 pr-8 bg-warm-porcelain border border-border rounded-xl text-body-sm font-body-sm text-ink focus:outline-none focus:border-primary cursor-pointer transition-colors" id="sort-select" onchange="sortCards(this.value)">
<option value="newest">Sắp xếp: Mới lưu nhất</option>
<option value="price-asc">Giá: Thấp đến cao</option>
<option value="price-desc">Giá: Cao đến thấp</option>
</select>
<span class="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-ink-muted">expand_more</span>
</div>
<button class="h-10 px-4 rounded-xl bg-primary text-warm-porcelain hover:bg-lacquer-deep active:scale-98 text-body-sm font-body-sm font-medium flex items-center gap-2 transition-all" onclick="addAllToCart()">
<span class="material-symbols-outlined text-[18px]">shopping_bag</span>
<span class="hidden sm:inline">Thêm tất cả vào giỏ</span>
<span class="sm:hidden">Thêm tất cả</span>
<span class="text-xs bg-warm-porcelain/20 px-1.5 py-0.5 rounded-md font-label-code">5</span>
</button>
</div>
</div>
<!-- Active Filter Status Helper -->
<div class="hidden items-center justify-between px-4 py-2.5 bg-raw-linen/60 rounded-xl border border-border text-body-sm font-body-sm text-ink-muted" id="filter-banner">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[18px] text-turmeric">filter_alt</span>
<span id="filter-banner-text">Đang lọc danh mục</span>
</div>
<button class="text-primary hover:underline text-label-micro font-label-micro uppercase tracking-wider font-semibold" onclick="resetFilters()">Đặt lại bộ lọc</button>
</div>
<!-- 4-Up Desktop Product Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg" id="wishlist-grid">
<!-- Card 1: Laptop ASUS -->
<article class="product-card group flex flex-col justify-between bg-warm-porcelain rounded-2xl border border-border overflow-hidden transition-all duration-200" data-category="tech" data-id="1" data-price="14990000" data-stock="in">
<div>
<!-- Image 4:5 Container -->
<div class="relative w-full aspect-[4/5] bg-rice-paper overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" data-alt="ASUS Vivobook 14 OLED modern silver sleek laptop open on warm wooden table with soft Vietnamese craft decor and rice paper warm light background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmiElcCcgn-tAbDX03ULyb0C5OcW8DX87dlAXkOBZ3nhpxQXBFmDUErpq8GXoQBZNH2UIS4ZiubYEQbt9TKmyRuseYGw3WWp_EvKX23Ru9uffEHEHdZCWM2d54GDlc7V0rY3gwefxySXDy0CEWcrDNPmYWtlitlZrHOW6fK8Py68JeDxuaV6_4MeJvnDwAh_RlLjbkHoqMlWmF7GTHHZt1L_XvNBK77t-pvQv7CA"/>
<!-- Badges top -->
<div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
<span class="px-2.5 py-1 rounded-md bg-warm-porcelain/95 backdrop-blur-sm border border-border text-label-micro font-label-micro text-primary uppercase font-bold tracking-wider">
                CHÍNH HÃNG
              </span>
<span class="px-2 py-0.5 rounded-md bg-lacquer-wash text-lacquer-deep text-[11px] font-label-code font-semibold">
                -9%
              </span>
</div>
<!-- Remove from wishlist button -->
<button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-warm-porcelain/90 backdrop-blur-sm border border-border text-ink-muted hover:text-primary hover:border-primary flex items-center justify-center transition-colors" onclick="removeItem(1, 'Laptop ASUS Vivobook 14 OLED')" title="Bỏ lưu món này">
<span class="material-symbols-outlined text-[16px]">close</span>
</button>
</div>
<!-- Content Metadata -->
<div class="p-space-md flex flex-col space-y-1.5">
<div class="text-label-micro font-label-micro text-ink-faint tracking-wider uppercase truncate">
              TECHNEST OFFICIAL · SHOP VIỆT
            </div>
<h2 class="font-body-md text-body-sm font-medium text-ink line-clamp-2 leading-snug group-hover:underline decoration-lacquer-red decoration-1 underline-offset-4 transition-all">
              Laptop ASUS Vivobook 14 OLED (M1405VA) - Core i5, 16GB, 512GB SSD
            </h2>
<div class="pt-1 flex items-baseline gap-2">
<span class="font-label-code text-body-lg font-semibold text-ink">14.990.000 ₫</span>
<span class="font-label-code text-body-sm text-ink-faint line-through">16.490.000 ₫</span>
</div>
<!-- Stock status -->
<div class="pt-0.5 flex items-center gap-1.5 text-body-sm text-jade">
<span class="w-2 h-2 rounded-full bg-jade"></span>
<span class="text-xs font-medium">Còn hàng</span>
</div>
</div>
</div>
<!-- Action Button -->
<div class="p-space-md pt-0">
<button class="w-full h-10 rounded-xl border border-border bg-transparent text-ink hover:bg-lacquer-wash/50 hover:text-lacquer-deep hover:border-lacquer-red/40 active:scale-98 text-body-sm font-body-sm font-medium flex items-center justify-center gap-2 transition-all" onclick="addToCart('Laptop ASUS Vivobook 14 OLED')">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span>Thêm vào giỏ</span>
</button>
</div>
</article>
<!-- Card 2: Tai nghe Sony -->
<article class="product-card group flex flex-col justify-between bg-warm-porcelain rounded-2xl border border-border overflow-hidden transition-all duration-200" data-category="tech" data-id="2" data-price="2490000" data-stock="in">
<div>
<!-- Image 4:5 Container -->
<div class="relative w-full aspect-[4/5] bg-rice-paper overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" data-alt="Sony WH-CH720N wireless noise cancelling modern headphones in warm matte sand color resting on artisan linen fabric with soft morning sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNOctcIpm7C_pIAr9ZS1fraH2Vk_JyXFQiNi8SUwoHEMd8uVU-NvkyOj0Vlli9_Aw7KtCmtHFsWetvcnAfI3h7QrLLlTt7gLC--Q5AWOhDTgXw1JZ-L90fnvXJO-Kvzoez1SVwTj_V_MGkNXNWM6kwHpUZ5nlzBfzPRKMCMlu6bF6O_x8ZBPa0LrtX4Y_Vb5vzSXYPqSYZUOko5TrsbSV8lVvC1mVbdQgNlUzkkA"/>
<div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
<span class="px-2.5 py-1 rounded-md bg-warm-porcelain/95 backdrop-blur-sm border border-border text-label-micro font-label-micro text-primary uppercase font-bold tracking-wider">
                CHÍNH HÃNG
              </span>
</div>
<button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-warm-porcelain/90 backdrop-blur-sm border border-border text-ink-muted hover:text-primary hover:border-primary flex items-center justify-center transition-colors" onclick="removeItem(2, 'Tai nghe chống ồn Sony WH-CH720N')" title="Bỏ lưu món này">
<span class="material-symbols-outlined text-[16px]">close</span>
</button>
</div>
<div class="p-space-md flex flex-col space-y-1.5">
<div class="text-label-micro font-label-micro text-ink-faint tracking-wider uppercase truncate">
              TECHNEST OFFICIAL · BẢO HÀNH 12T
            </div>
<h2 class="font-body-md text-body-sm font-medium text-ink line-clamp-2 leading-snug group-hover:underline decoration-lacquer-red decoration-1 underline-offset-4 transition-all">
              Tai nghe chống ồn không dây Sony WH-CH720N (Màu Cát Trầm)
            </h2>
<div class="pt-1 flex items-baseline gap-2">
<span class="font-label-code text-body-lg font-semibold text-ink">2.490.000 ₫</span>
</div>
<div class="pt-0.5 flex items-center gap-1.5 text-body-sm text-jade">
<span class="w-2 h-2 rounded-full bg-jade"></span>
<span class="text-xs font-medium">Còn hàng</span>
</div>
</div>
</div>
<div class="p-space-md pt-0">
<button class="w-full h-10 rounded-xl border border-border bg-transparent text-ink hover:bg-lacquer-wash/50 hover:text-lacquer-deep hover:border-lacquer-red/40 active:scale-98 text-body-sm font-body-sm font-medium flex items-center justify-center gap-2 transition-all" onclick="addToCart('Tai nghe chống ồn Sony WH-CH720N')">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span>Thêm vào giỏ</span>
</button>
</div>
</article>
<!-- Card 3: Bộ bát gốm Bát Tràng -->
<article class="product-card group flex flex-col justify-between bg-warm-porcelain rounded-2xl border border-border overflow-hidden transition-all duration-200" data-category="ceramic" data-id="3" data-price="756000" data-stock="low">
<div>
<!-- Image 4:5 Container -->
<div class="relative w-full aspect-[4/5] bg-rice-paper overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" data-alt="Traditional Vietnamese handmade Bat Trang crackle ceramic bowls set of 4 placed gracefully on natural raw linen tablecloth with chopsticks and steam" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKl-EZI8W1ILApNzcID0UkplriCNkA3O3rbLX4wCQCslgpTk1h1pNlDsoGv7jRMbxf9Ed-V8cBZtKt-T7NzVzmDEq_fsmG7Mda6oJO44oouCht12YGrupsxC17rsqNpVAGjP2Wkag4qjoGGJ9iEIVP7k84Gl3akx-eSAy0O28InDibjOvQG1YVcxYjJYQUsgXbRFLFzng4Zmzabxv6_kmrw6_gxASi52JZ29q_MQ"/>
<div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
<span class="px-2.5 py-1 rounded-md bg-warm-porcelain/95 backdrop-blur-sm border border-border text-label-micro font-label-micro text-turmeric uppercase font-bold tracking-wider">
                SHOP VIỆT
              </span>
</div>
<button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-warm-porcelain/90 backdrop-blur-sm border border-border text-ink-muted hover:text-primary hover:border-primary flex items-center justify-center transition-colors" onclick="removeItem(3, 'Bộ bát gốm Bát Tràng men rạn thủ công')" title="Bỏ lưu món này">
<span class="material-symbols-outlined text-[16px]">close</span>
</button>
</div>
<div class="p-space-md flex flex-col space-y-1.5">
<div class="text-label-micro font-label-micro text-ink-faint tracking-wider uppercase truncate">
              GỐM MỘC BÁT TRÀNG · THỦ CÔNG
            </div>
<h2 class="font-body-md text-body-sm font-medium text-ink line-clamp-2 leading-snug group-hover:underline decoration-lacquer-red decoration-1 underline-offset-4 transition-all">
              Bộ 4 bát cơm gốm men rạn vẽ hoa phù dung vuốt tay truyền thống
            </h2>
<div class="pt-1 flex items-baseline gap-2">
<span class="font-label-code text-body-lg font-semibold text-ink">756.000 ₫</span>
<span class="font-label-code text-body-sm text-ink-faint line-through">840.000 ₫</span>
</div>
<!-- Low stock warning -->
<div class="pt-0.5 flex items-center gap-1.5 text-body-sm text-turmeric">
<span class="w-2 h-2 rounded-full bg-turmeric"></span>
<span class="text-xs font-medium">Chỉ còn 3 bộ</span>
</div>
</div>
</div>
<div class="p-space-md pt-0">
<button class="w-full h-10 rounded-xl border border-border bg-transparent text-ink hover:bg-lacquer-wash/50 hover:text-lacquer-deep hover:border-lacquer-red/40 active:scale-98 text-body-sm font-body-sm font-medium flex items-center justify-center gap-2 transition-all" onclick="addToCart('Bộ bát gốm Bát Tràng men rạn')">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span>Thêm vào giỏ</span>
</button>
</div>
</article>
<!-- Card 4: Tã bỉm hữu cơ An Nhiên -->
<article class="product-card group flex flex-col justify-between bg-warm-porcelain rounded-2xl border border-border overflow-hidden transition-all duration-200" data-category="baby" data-id="4" data-price="578000" data-stock="in">
<div>
<!-- Image 4:5 Container -->
<div class="relative w-full aspect-[4/5] bg-rice-paper overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" data-alt="Eco-friendly bamboo fiber organic baby diaper package set of 2 resting gently next to clean cotton wipes and bamboo plant on warm rice paper studio setup" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjw_XmSdNiRUJVtC9DRgHovu12Zbbp52ELMRIV4VZ8hxHnxFboLNylFxuH7qTLMQzhkyncZ_5ztYHzDt2HB9m6AmzrjHNmEdlF0HnJo7PlsAlDG2dJNBYBGDAp5_yEqhmNeYi7jtiBQ0jvjQSbMRKaOrzuvA5-XahruagtAolZdLqcbDGu-gStezrdOsvEa3mEvveKipte6KW4Iinyv2tv98QOWLCplabIKbaffQ"/>
<div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
<span class="px-2.5 py-1 rounded-md bg-warm-porcelain/95 backdrop-blur-sm border border-border text-label-micro font-label-micro text-turmeric uppercase font-bold tracking-wider">
                SHOP VIỆT
              </span>
</div>
<button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-warm-porcelain/90 backdrop-blur-sm border border-border text-ink-muted hover:text-primary hover:border-primary flex items-center justify-center transition-colors" onclick="removeItem(4, 'Tã bỉm quần hữu cơ sợi tre An Nhiên')" title="Bỏ lưu món này">
<span class="material-symbols-outlined text-[16px]">close</span>
</button>
</div>
<div class="p-space-md flex flex-col space-y-1.5">
<div class="text-label-micro font-label-micro text-ink-faint tracking-wider uppercase truncate">
              AN NHIÊN BABY CARE · CHÍNH HÃNG
            </div>
<h2 class="font-body-md text-body-sm font-medium text-ink line-clamp-2 leading-snug group-hover:underline decoration-lacquer-red decoration-1 underline-offset-4 transition-all">
              Tã bỉm quần hữu cơ sợi tre An Nhiên size L (Combo 2 gói x 54 miếng)
            </h2>
<div class="pt-1 flex items-baseline gap-2">
<span class="font-label-code text-body-lg font-semibold text-ink">578.000 ₫</span>
</div>
<div class="pt-0.5 flex items-center gap-1.5 text-body-sm text-jade">
<span class="w-2 h-2 rounded-full bg-jade"></span>
<span class="text-xs font-medium">Còn hàng</span>
</div>
</div>
</div>
<div class="p-space-md pt-0">
<button class="w-full h-10 rounded-xl border border-border bg-transparent text-ink hover:bg-lacquer-wash/50 hover:text-lacquer-deep hover:border-lacquer-red/40 active:scale-98 text-body-sm font-body-sm font-medium flex items-center justify-center gap-2 transition-all" onclick="addToCart('Tã bỉm quần hữu cơ sợi tre An Nhiên')">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span>Thêm vào giỏ</span>
</button>
</div>
</article>
<!-- Card 5: Nồi chiên không dầu hơi nước LockAir 7L -->
<article class="product-card group flex flex-col justify-between bg-warm-porcelain rounded-2xl border border-border overflow-hidden transition-all duration-200" data-category="home" data-id="5" data-price="3490000" data-stock="in">
<div>
<!-- Image 4:5 Container -->
<div class="relative w-full aspect-[4/5] bg-rice-paper overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" data-alt="Modern matte off-white steam air fryer kitchen appliance placed on wooden countertop next to herbs and clay pot in a minimalist airy kitchen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL7_TOqElZVOmcgKPsk9zglI4dqGyCi7m8faPsgSWWp5Z_TFDdn_PxNKyr1Jw7XHEk8pKLdY7_dFbKx9vumqi1rkRSNjo_Gwt2WgyeG3N4XvQe27uIbjV8HoXFGCM2bSfp-YDHUnZ2W_C2vEaRS1E-ConGFYLNKvMIx79VYZbHtex2eK8_qre9TiYY23x0zo3v3fanHptMtm6r2nS119M38KawP8Qkt23uO_AElQ"/>
<div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
<span class="px-2.5 py-1 rounded-md bg-warm-porcelain/95 backdrop-blur-sm border border-border text-label-micro font-label-micro text-primary uppercase font-bold tracking-wider">
                CHÍNH HÃNG
              </span>
</div>
<button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-warm-porcelain/90 backdrop-blur-sm border border-border text-ink-muted hover:text-primary hover:border-primary flex items-center justify-center transition-colors" onclick="removeItem(5, 'Nồi chiên không dầu LockAir 7L')" title="Bỏ lưu món này">
<span class="material-symbols-outlined text-[16px]">close</span>
</button>
</div>
<div class="p-space-md flex flex-col space-y-1.5">
<div class="text-label-micro font-label-micro text-ink-faint tracking-wider uppercase truncate">
              BẾP NHÀ MÌNH · PHÂN PHỐI ĐỘC QUYỀN
            </div>
<h2 class="font-body-md text-body-sm font-medium text-ink line-clamp-2 leading-snug group-hover:underline decoration-lacquer-red decoration-1 underline-offset-4 transition-all">
              Nồi chiên không dầu hơi nước LockAir 7L lòng gốm chống dính cao cấp
            </h2>
<div class="pt-1 flex items-baseline gap-2">
<span class="font-label-code text-body-lg font-semibold text-ink">3.490.000 ₫</span>
<span class="font-label-code text-body-sm text-ink-faint line-through">4.150.000 ₫</span>
</div>
<div class="pt-0.5 flex items-center gap-1.5 text-body-sm text-jade">
<span class="w-2 h-2 rounded-full bg-jade"></span>
<span class="text-xs font-medium">Còn hàng</span>
</div>
</div>
</div>
<div class="p-space-md pt-0">
<button class="w-full h-10 rounded-xl border border-border bg-transparent text-ink hover:bg-lacquer-wash/50 hover:text-lacquer-deep hover:border-lacquer-red/40 active:scale-98 text-body-sm font-body-sm font-medium flex items-center justify-center gap-2 transition-all" onclick="addToCart('Nồi chiên không dầu LockAir 7L')">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span>Thêm vào giỏ</span>
</button>
</div>
</article>
<!-- Card 6: Áo thun cổ tròn cotton chải kỹ (Out of stock) -->
<article class="product-card group flex flex-col justify-between bg-warm-porcelain rounded-2xl border border-border overflow-hidden transition-all duration-200" data-category="fashion" data-id="6" data-price="290000" data-stock="out">
<div>
<!-- Image 4:5 Container with Out of Stock overlay -->
<div class="relative w-full aspect-[4/5] bg-rice-paper overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-300 opacity-75 grayscale-[30%]" data-alt="Natural undyed raw organic cotton round collar t-shirt neatly folded on handwoven rush mat with dried lotus seedpods beside it" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPvFsMZmFW1cg4PXO8Iyfy8eKYugUOW3mIg58TVbDh55gEmxB4_Eg8e6KZA63McXqcdQeIhvhDsu6YiTc9Hj7hjDUQtG6ZSaZQD-lCYTlr4SE3sGPo8H2A3iiIXXh7-FEcTu_tiqNd51Rtbg_RaJARB1tEzO_5j1AhzB56JNcweZxaDtfWRwHGI2LtvX19pY1yLuNtNek5JA7bWOmAv3kphkwSzU7yXrHUOllQXA"/>
<div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
<span class="px-2.5 py-1 rounded-md bg-brick text-warm-porcelain text-label-micro font-label-micro uppercase font-bold tracking-wider">
                HẾT HÀNG
              </span>
</div>
<button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-warm-porcelain/90 backdrop-blur-sm border border-border text-ink-muted hover:text-primary hover:border-primary flex items-center justify-center transition-colors" onclick="removeItem(6, 'Áo thun cổ tròn cotton mộc')" title="Bỏ lưu món này">
<span class="material-symbols-outlined text-[16px]">close</span>
</button>
<!-- Badge in the center for quick comprehension -->
<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
<span class="px-3 py-1.5 rounded-lg bg-ink/75 text-warm-porcelain text-label-micro font-label-micro tracking-widest uppercase">
                Tạm hết hàng tại xưởng
              </span>
</div>
</div>
<div class="p-space-md flex flex-col space-y-1.5">
<div class="text-label-micro font-label-micro text-ink-faint tracking-wider uppercase truncate">
              MỘC STUDIO · VẢI MỘC VIỆT NAM
            </div>
<h2 class="font-body-md text-body-sm font-medium text-ink/70 line-clamp-2 leading-snug">
              Áo thun unisex cổ tròn cotton chải kỹ dệt mộc tự nhiên (Màu Mộc Đậu)
            </h2>
<div class="pt-1 flex items-baseline gap-2">
<span class="font-label-code text-body-lg font-semibold text-ink-muted">290.000 ₫</span>
</div>
<!-- Out of stock badge -->
<div class="pt-0.5 flex items-center gap-1.5 text-body-sm text-brick">
<span class="w-2 h-2 rounded-full bg-brick"></span>
<span class="text-xs font-medium">Hết hàng</span>
</div>
</div>
</div>
<div class="p-space-md pt-0 flex flex-col space-y-1.5">
<button class="w-full h-10 rounded-xl bg-surface-container-high border border-border text-ink-faint text-body-sm font-body-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed" disabled="">
<span>Tạm hết hàng</span>
</button>
<button class="text-center text-label-micro font-label-micro text-primary hover:underline font-semibold py-1" onclick="notifyStock('Áo thun unisex cổ tròn cotton')">
            Báo tôi khi có hàng lại
          </button>
</div>
</article>
</div>
<!-- Empty State Section (Shown via simulation or when all items are removed) -->
<div class="hidden flex-col items-center justify-center py-20 px-4 text-center bg-warm-porcelain rounded-2xl border border-border" id="wishlist-empty-state">
<!-- Subtle Artisan Ceramic / Rice Nest SVG Illustration -->
<div class="w-24 h-24 rounded-full bg-raw-linen/60 flex items-center justify-center mb-space-md border border-border text-primary">
<svg class="w-12 h-12 stroke-current fill-none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewbox="0 0 48 48">
<path d="M10 20C10 28 16 38 24 38C32 38 38 28 38 20C38 12 32 10 24 10C16 10 10 12 10 20Z"></path>
<path d="M6 19C12 21 18 22 24 22C30 22 36 21 42 19"></path>
<path d="M20 42H28"></path>
<circle cx="24" cy="16" fill="currentColor" r="2"></circle>
</svg>
</div>
<h2 class="font-headline-3 text-headline-3 text-ink mb-1.5">Chưa lưu món nào</h2>
<p class="text-body-sm font-body-sm text-ink-muted max-w-md mb-space-lg leading-relaxed">
        Ghé gian hàng thủ công &amp; chính hãng trên ShopNest để giữ lại những món đồ gắn bó với nếp nhà bạn.
      </p>
<div class="flex items-center gap-space-sm">
<a class="h-12 px-6 rounded-xl bg-primary text-warm-porcelain hover:bg-lacquer-deep active:scale-98 text-body-sm font-body-sm font-medium flex items-center gap-2 transition-all" href="#">
<span class="material-symbols-outlined text-[18px]">storefront</span>
<span>Xem chợ hôm nay</span>
</a>
<button class="h-12 px-5 rounded-xl border border-border text-ink hover:bg-raw-linen/50 text-body-sm font-body-sm transition-colors" onclick="setSimState('default')">
          Khôi phục dữ liệu mẫu
        </button>
</div>
</div>
<!-- Recommendations / Footnote for Nếp Order Consistency -->
<div class="pt-space-xl border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md text-body-sm text-ink-muted">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-jade text-[18px]">verified</span>
<span>Món đồ đã lưu được tự động cập nhật khi xưởng có đợt ưu đãi mới hoặc đổi giá.</span>
</div>
<div class="flex items-center gap-4 text-xs font-label-code">
<span>ĐÃ CHỌN: <strong class="text-ink font-semibold">6</strong>/100 MÓN TỐI ĐA</span>
</div>
</div>
</div>
<!-- Toast Simulation Component (Floating bottom-right) -->
<div class="fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 pointer-events-none transition-all duration-300 max-w-md" id="toast-notification">
<div class="bg-warm-porcelain border border-border border-l-4 border-l-jade rounded-2xl p-4 shadow-sm flex items-start gap-3">
<div class="w-7 h-7 rounded-full bg-jade/10 text-jade flex items-center justify-center flex-shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[18px]" id="toast-icon">check_circle</span>
</div>
<div class="flex flex-col flex-1 text-body-sm font-body-sm">
<span class="text-ink font-medium leading-snug" id="toast-title">Thao tác thành công</span>
<span class="text-xs text-ink-muted mt-0.5" id="toast-desc">Đã chuyển sản phẩm vào giỏ hàng</span>
</div>
<div class="flex items-center gap-2 flex-shrink-0">
<a class="text-xs font-label-micro uppercase font-semibold text-primary hover:underline" href="#" id="toast-action">Xem giỏ</a>
<button class="text-ink-faint hover:text-ink" onclick="hideToast()">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
</div>
</div>
</div>
<script>
  let currentFilter = 'all';
  let activeSearch = '';
  let toastTimer = null;

  function showToast(title, desc, actionText, actionLink, isJade = true) {
    const toast = document.getElementById('toast-notification');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');
    const toastAction = document.getElementById('toast-action');
    const toastIcon = document.getElementById('toast-icon');

    toastTitle.textContent = title;
    toastDesc.textContent = desc;
    toastAction.textContent = actionText || 'Xem giỏ';
    toastAction.href = actionLink || '#';

    if (isJade) {
      toast.firstElementChild.className = "bg-warm-porcelain border border-border border-l-4 border-l-jade rounded-2xl p-4 flex items-start gap-3";
      toastIcon.textContent = "check_circle";
      toastIcon.parentElement.className = "w-7 h-7 rounded-full bg-jade/10 text-jade flex items-center justify-center flex-shrink-0 mt-0.5";
    } else {
      toast.firstElementChild.className = "bg-warm-porcelain border border-border border-l-4 border-l-lacquer-red rounded-2xl p-4 flex items-start gap-3";
      toastIcon.textContent = "delete";
      toastIcon.parentElement.className = "w-7 h-7 rounded-full bg-lacquer-wash text-primary flex items-center justify-center flex-shrink-0 mt-0.5";
    }

    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      hideToast();
    }, 4500);
  }

  function hideToast() {
    const toast = document.getElementById('toast-notification');
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
  }

  function addToCart(productName) {
    showToast("Đã thêm vào giỏ hàng", productName, "Xem giỏ hàng", "#", true);
  }

  function notifyStock(productName) {
    showToast("Đã ghi nhận yêu cầu", "Hệ thống sẽ báo tin nhắn khi " + productName + " sẵn sàng", "Đóng", "#", true);
  }

  function removeItem(id, productName) {
    const card = document.querySelector(`article[data-id="${id}"]`);
    if (card) {
      card.style.transition = 'all 0.25s ease-out';
      card.style.transform = 'scale(0.95)';
      card.style.opacity = '0';
      setTimeout(() => {
        card.remove();
        updateCount();
        showToast("Đã bỏ lưu sản phẩm", productName, "Hoàn tác", "javascript:restoreItems()", false);
      }, 250);
    }
  }

  function addAllToCart() {
    showToast("Đã thêm 5 món còn hàng", "Tất cả sản phẩm khả dụng đã được đưa vào giỏ hàng", "Xem giỏ hàng", "#", true);
  }

  function updateCount() {
    const visibleCards = document.querySelectorAll('#wishlist-grid article:not([style*="display: none"])');
    const totalExisting = document.querySelectorAll('#wishlist-grid article').length;
    const counter = document.getElementById('wishlist-counter');
    const grid = document.getElementById('wishlist-grid');
    const emptyState = document.getElementById('wishlist-empty-state');
    const controls = document.getElementById('controls-section');

    if (totalExisting === 0) {
      grid.classList.add('hidden');
      emptyState.classList.remove('hidden');
      emptyState.classList.add('flex');
      if (counter) counter.textContent = '0 MÓN';
    } else {
      grid.classList.remove('hidden');
      emptyState.classList.add('hidden');
      emptyState.classList.remove('flex');
      if (counter) counter.textContent = `${visibleCards.length} MÓN`;
    }
  }

  function filterCategory(category, button) {
    currentFilter = category;
    const chips = document.querySelectorAll('#category-chips button');
    chips.forEach(b => {
      b.className = "chip-inactive px-3 py-1.5 rounded-full text-label-micro font-label-micro bg-warm-porcelain text-ink-muted border border-border hover:border-ink-muted flex items-center gap-1.5 whitespace-nowrap transition-colors";
    });

    button.className = "chip-active px-3 py-1.5 rounded-full text-label-micro font-label-micro bg-ink text-warm-porcelain border border-ink flex items-center gap-1.5 whitespace-nowrap transition-colors";

    const banner = document.getElementById('filter-banner');
    const bannerText = document.getElementById('filter-banner-text');

    if (category !== 'all') {
      banner.classList.remove('hidden');
      banner.classList.add('flex');
      bannerText.textContent = `Đang xem: ${button.querySelector('span').textContent}`;
    } else {
      banner.classList.add('hidden');
      banner.classList.remove('flex');
    }

    applyFiltering();
  }

  function handleSearch(query) {
    activeSearch = query.trim().toLowerCase();
    applyFiltering();
  }

  function resetFilters() {
    const allChip = document.querySelector('#category-chips button:first-child');
    filterCategory('all', allChip);
    document.getElementById('wishlist-search').value = '';
    activeSearch = '';
    applyFiltering();
  }

  function applyFiltering() {
    const cards = document.querySelectorAll('#wishlist-grid article');
    cards.forEach(card => {
      const matchCat = (currentFilter === 'all' || card.getAttribute('data-category') === currentFilter);
      const text = card.textContent.toLowerCase();
      const matchSearch = (!activeSearch || text.includes(activeSearch));

      if (matchCat && matchSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
    updateCount();
  }

  function sortCards(type) {
    const grid = document.getElementById('wishlist-grid');
    const cards = Array.from(grid.querySelectorAll('article'));

    if (type === 'price-asc') {
      cards.sort((a, b) => parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price')));
    } else if (type === 'price-desc') {
      cards.sort((a, b) => parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price')));
    } else {
      cards.sort((a, b) => parseInt(a.getAttribute('data-id')) - parseInt(b.getAttribute('data-id')));
    }

    cards.forEach(c => grid.appendChild(c));
  }

  function setSimState(state) {
    const buttons = document.querySelectorAll('#sim-controls button');
    buttons.forEach(b => {
      b.className = "px-2.5 py-1 text-label-micro font-label-micro rounded-lg bg-warm-porcelain border border-border text-ink-muted hover:text-ink transition-colors";
    });

    const activeBtn = document.getElementById(`btn-state-${state}`);
    if (activeBtn) {
      activeBtn.className = "px-2.5 py-1 text-label-micro font-label-micro rounded-lg bg-warm-porcelain border border-primary text-primary transition-colors flex items-center gap-1.5";
    }

    const grid = document.getElementById('wishlist-grid');
    const empty = document.getElementById('wishlist-empty-state');
    const cards = grid.querySelectorAll('article');

    if (state === 'default') {
      resetFilters();
      grid.classList.remove('hidden');
      empty.classList.add('hidden');
      empty.classList.remove('flex');
      cards.forEach(c => { c.style.display = 'flex'; c.style.opacity = '1'; c.style.transform = 'scale(1)'; });
      updateCount();
      hideToast();
    } else if (state === 'toast') {
      removeItem(2, 'Tai nghe chống ồn Sony WH-CH720N');
    } else if (state === 'stock') {
      cards.forEach(c => {
        if (c.getAttribute('data-stock') === 'out') {
          c.style.display = 'flex';
        } else {
          c.style.display = 'none';
        }
      });
      const banner = document.getElementById('filter-banner');
      const bannerText = document.getElementById('filter-banner-text');
      banner.classList.remove('hidden');
      banner.classList.add('flex');
      bannerText.textContent = "Chỉ hiển thị: Món tạm hết hàng";
      updateCount();
    } else if (state === 'empty') {
      grid.classList.add('hidden');
      empty.classList.remove('hidden');
      empty.classList.add('flex');
      document.getElementById('wishlist-counter').textContent = '0 MÓN';
      hideToast();
    }
  }

  function restoreItems() {
    setSimState('default');
    showToast("Đã hoàn tác", "Danh sách sản phẩm lưu đã được khôi phục nguyên trạng", "Đóng", "#", true);
  }
</script></main></div></body></html>
```
### C05 - Address book and form
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "logo-blue": "#4991D8", "ink": "#1D1B17", "on-surface-variant": "#58413e", "on-secondary-fixed": "#1d1b17", "inverse-surface": "#323029", "border": "#DCD1BE", "tertiary": "#514b3f", "secondary-fixed": "#e8e2db", "raw-linen": "#EDE4D3", "error-container": "#ffdad6", "jade": "#2F6B57", "on-error-container": "#93000a", "outline-variant": "#dfbfbb", "surface-container-lowest": "#ffffff", "tertiary-container": "#696356", "on-tertiary": "#ffffff", "surface-container-high": "#ede8dd", "turmeric": "#8A5A1A", "on-secondary": "#ffffff", "secondary-fixed-dim": "#cbc6bf", "on-primary-container": "#ffd9d3", "primary-fixed": "#ffdad5", "surface-tint": "#aa342a", "tertiary-fixed-dim": "#cec6b5", "surface-variant": "#e7e2d7", "outline": "#8c716d", "background": "#fef9ee", "lacquer-wash": "#F2DCD5", "surface-container-low": "#f8f3e8", "surface-dim": "#dedacf", "secondary": "#615e59", "on-primary-fixed-variant": "#891c16", "brick": "#8B2A24", "secondary-container": "#e8e2db", "primary-fixed-dim": "#ffb4aa", "surface": "#fef9ee", "inverse-primary": "#ffb4aa", "on-tertiary-fixed-variant": "#4b463a", "on-error": "#ffffff", "inverse-on-surface": "#f5f0e5", "surface-bright": "#fef9ee", "ink-faint": "#9A8F7F", "primary": "#91221a", "on-primary": "#ffffff", "warm-porcelain": "#FFFCF4", "surface-container": "#f2ede2", "primary-container": "#b23a2f", "on-secondary-container": "#67645f", "error": "#ba1a1a", "lacquer-red": "#B23A2F", "on-background": "#1d1c15", "rice-paper": "#F6F1E6", "ink-muted": "#6B6458", "lacquer-deep": "#8C2A22", "on-surface": "#1d1c15", "on-tertiary-fixed": "#1f1b11", "on-secondary-fixed-variant": "#494641", "on-tertiary-container": "#e9e0cf", "surface-container-highest": "#e7e2d7", "tertiary-fixed": "#eae2d1", "on-primary-fixed": "#410001" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": { "gutter-mobile": "1rem", "space-xl": "2.5rem", "margin": "3rem", "space-lg": "1.5rem", "margin-mobile": "1.25rem", "space-xs": "0.25rem", "gutter": "1.5rem", "space-sm": "0.5rem", "space-md": "1rem" }, "fontFamily": { "headline-1": [ "Newsreader" ], "display-xl-mobile": [ "Newsreader" ], "display-lg": [ "Newsreader" ], "headline-2": [ "Newsreader" ], "body-md": [ "Be Vietnam Pro" ], "body-sm": [ "Be Vietnam Pro" ], "display-xl": [ "Newsreader" ], "headline-3": [ "Be Vietnam Pro" ], "display-lg-mobile": [ "Newsreader" ], "label-micro": [ "Be Vietnam Pro" ], "label-code": [ "JetBrains Mono" ], "body-lg": [ "Be Vietnam Pro" ] }, "fontSize": { "headline-1": [ "36px", { "lineHeight": "40px", "letterSpacing": "-0.025em", "fontWeight": "600" } ], "display-xl-mobile": [ "40px", { "lineHeight": "40px", "letterSpacing": "-0.03em", "fontWeight": "600" } ], "display-lg": [ "48px", { "lineHeight": "48px", "letterSpacing": "-0.03em", "fontWeight": "600" } ], "headline-2": [ "28px", { "lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600" } ], "body-md": [ "16px", { "lineHeight": "26px", "fontWeight": "400" } ], "body-sm": [ "14px", { "lineHeight": "21px", "fontWeight": "400" } ], "display-xl": [ "64px", { "lineHeight": "60px", "letterSpacing": "-0.035em", "fontWeight": "600" } ], "headline-3": [ "18px", { "lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "600" } ], "display-lg-mobile": [ "32px", { "lineHeight": "34px", "letterSpacing": "-0.025em", "fontWeight": "600" } ], "label-micro": [ "12px", { "lineHeight": "16px", "letterSpacing": "0.12em", "fontWeight": "600" } ], "label-code": [ "14px", { "lineHeight": "20px", "fontWeight": "500" } ], "body-lg": [ "18px", { "lineHeight": "28px", "fontWeight": "400" } ] } } } };</script></head><body class="bg-rice-paper text-ink font-body-md text-body-md antialiased min-h-screen"><header class="fixed top-0 left-0 right-0 h-20 bg-warm-porcelain/95 backdrop-blur-md border-b border-border z-50"><div class="w-full max-w-[1440px] mx-auto h-20 px-gutter flex items-center justify-between gap-space-md"><div class="flex items-center gap-space-lg flex-shrink-0"><a class="flex items-center gap-space-sm" data-path="trang-chu" href="#"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><span class="font-headline-2 text-headline-2 text-lacquer-red tracking-tight">ShopNest</span></a><div class="hidden xl:flex items-center bg-rice-paper border border-border rounded-xl px-space-md h-11 w-72 focus-within:ring-2 focus-within:ring-lacquer-red focus-within:border-transparent transition-all"><span class="material-symbols-outlined text-ink-muted text-[20px] mr-space-sm">search</span><input class="bg-transparent border-none outline-none font-body-sm text-body-sm text-ink placeholder:text-ink-faint w-full" placeholder="Tìm kiếm sản phẩm thủ công..." type="text"/></div></div><nav class="hidden lg:flex items-center gap-space-md" data-active-classes="text-lacquer-red font-semibold"><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors py-2" data-path="trang-chu" href="#">Trang chủ</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors py-2" data-path="danh-muc" href="#">Danh mục</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors py-2" data-path="khuyen-mai" href="#">Khuyến mãi</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors py-2" data-path="shop-viet" href="#">Shop Việt</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors py-2" data-path="don-hang" href="#">Đơn hàng</a></nav><div class="flex items-center gap-space-md flex-shrink-0 pl-space-sm border-l border-border"><div class="flex flex-col text-right"><span class="font-body-sm text-body-sm font-semibold text-ink leading-tight">Nguyễn Thu Hà</span><span class="font-label-micro text-label-micro uppercase text-turmeric font-medium tracking-wider">THÀNH VIÊN NẾP VÀNG</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><div class="pt-20"><div class="w-full max-w-[1440px] mx-auto flex"><aside class="fixed top-20 w-72 h-[calc(100vh-5rem)] bg-warm-porcelain border-r border-border overflow-y-auto py-space-lg px-space-md flex flex-col justify-between z-30"><div class="flex flex-col gap-space-md"><div class="px-space-sm pb-space-md border-b border-border flex items-center gap-space-sm"><div class="w-10 h-10 rounded-full bg-lacquer-wash flex items-center justify-center border border-border"><span class="material-symbols-outlined text-lacquer-red text-[20px]">account_circle</span></div><div class="flex flex-col"><span class="font-body-sm text-body-sm font-semibold text-ink">Hồ sơ tài khoản</span><span class="font-label-micro text-label-micro text-ink-muted uppercase">Nếp Hội Viên</span></div></div><nav class="flex flex-col gap-space-xs" data-active-classes="bg-lacquer-wash text-lacquer-red font-semibold border-l-2 border-lacquer-red"><a class="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-raw-linen/60 hover:text-ink transition-colors" data-path="don-mua" href="#"><span class="material-symbols-outlined text-[18px] text-ink-muted">receipt_long</span><span>Đơn mua</span></a><div class="pt-space-sm pb-space-xs"><span class="px-space-md font-label-micro text-label-micro uppercase tracking-wider text-ink-muted font-bold">TÀI KHOẢN CỦA TÔI</span></div><div class="flex flex-col pl-space-sm gap-space-xs"><a class="flex items-center gap-space-sm px-space-md py-2 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-raw-linen/60 hover:text-ink transition-colors" data-path="ho-so" href="#"><span class="material-symbols-outlined text-[16px] text-ink-muted">badge</span><span>Hồ sơ</span></a><a class="flex items-center gap-space-sm px-space-md py-2 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-raw-linen/60 hover:text-ink transition-colors" data-path="dia-chi" href="#"><span class="material-symbols-outlined text-[16px] text-ink-muted">location_on</span><span>Địa chỉ</span></a><a class="flex items-center gap-space-sm px-space-md py-2 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-raw-linen/60 hover:text-ink transition-colors" data-path="doi-mat-khau" href="#"><span class="material-symbols-outlined text-[16px] text-ink-muted">lock_reset</span><span>Đổi mật khẩu</span></a></div><div class="my-space-xs border-t border-border"></div><a class="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-raw-linen/60 hover:text-ink transition-colors" data-path="da-luu" href="#"><span class="material-symbols-outlined text-[18px] text-ink-muted">favorite</span><span>Đã lưu</span></a><a class="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-raw-linen/60 hover:text-ink transition-colors" data-path="kho-voucher-nep" href="#"><span class="material-symbols-outlined text-[18px] text-ink-muted">confirmation_number</span><span>Kho voucher Nếp</span></a><a class="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-raw-linen/60 hover:text-ink transition-colors" data-path="thong-bao" href="#"><span class="material-symbols-outlined text-[18px] text-ink-muted">notifications</span><span>Thông báo</span></a><a class="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-raw-linen/60 hover:text-ink transition-colors" data-path="ho-tro-khach-hang" href="#"><span class="material-symbols-outlined text-[18px] text-ink-muted">contact_support</span><span>Hỗ trợ khách hàng</span></a></nav></div><div class="px-space-md pt-space-md border-t border-border"><div class="bg-rice-paper p-space-md rounded-xl border border-border"><div class="flex items-center justify-between mb-space-xs"><span class="font-label-micro text-label-micro uppercase text-turmeric font-bold">Hạng Nếp Vàng</span><span class="font-label-code text-label-code text-ink font-semibold">1,250 đ</span></div><p class="font-body-sm text-body-sm text-ink-muted text-[13px] leading-relaxed">Tích luỹ thêm 750 điểm để kích hoạt đặc quyền Nếp Ngọc.</p></div></div></aside><div class="pl-72 w-full"><main class="w-full min-h-[calc(100vh-5rem)] bg-rice-paper p-space-lg"><div class="max-w-5xl mx-auto"><div class="flex flex-col w-full space-y-space-lg">
<!-- Interactive State Simulation Bar (Prototype Inspector) -->
<div class="w-full bg-warm-porcelain border border-border rounded-xl p-space-sm flex flex-wrap items-center justify-between gap-space-sm">
<div class="flex items-center gap-space-xs text-ink-muted">
<span class="material-symbols-outlined text-[18px] text-turmeric">tune</span>
<span class="font-label-micro text-label-micro uppercase tracking-wider font-semibold">Mô phỏng trạng thái giao diện:</span>
</div>
<div class="flex flex-wrap items-center gap-space-xs text-[13px]" id="state-controls">
<button class="px-3 py-1.5 rounded-lg border border-lacquer-red bg-lacquer-wash text-lacquer-red font-medium transition-all" id="btn-state-default" onclick="switchState('default')" type="button">
        Mặc định (Danh sách 3 địa chỉ)
      </button>
<button class="px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink-muted hover:text-ink transition-all" id="btn-state-form" onclick="switchState('form')" type="button">
        Mở form thêm mới (7/5)
      </button>
<button class="px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink-muted hover:text-ink transition-all" id="btn-state-loading" onclick="switchState('loading')" type="button">
        Đang tải Tỉnh/Thành
      </button>
<button class="px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink-muted hover:text-ink transition-all" id="btn-state-modal" onclick="openDeleteModal()" type="button">
        Xác nhận xoá địa chỉ (Modal)
      </button>
<button class="px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink-muted hover:text-ink transition-all" id="btn-state-empty" onclick="switchState('empty')" type="button">
        Sổ địa chỉ rỗng
      </button>
</div>
</div>
<!-- Header Row -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm border-b border-border">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-space-sm">
<h1 class="font-headline-3 text-headline-3 text-ink font-semibold">Sổ địa chỉ</h1>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-raw-linen text-ink-muted font-label-code text-[12px] font-semibold" id="address-counter">
          03 ĐỊA CHỈ LƯU TRỮ
        </span>
</div>
<p class="font-body-sm text-body-sm text-ink-muted">
        Quản lý địa chỉ nhận hàng chu đáo, bảo mật và kết nối chuẩn giờ cùng đội ngũ bưu tá Nếp.
      </p>
</div>
<div class="flex-shrink-0">
<button class="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-lacquer-red text-warm-porcelain font-body-sm text-body-sm font-semibold hover:bg-lacquer-deep transition-all active:scale-[0.98]" onclick="switchState('form')" type="button">
<span class="material-symbols-outlined text-[20px]">add</span>
<span>Thêm địa chỉ mới</span>
</button>
</div>
</div>
<!-- VIEW 1: ADDRESS LIST (8 cols) + DELIVERY STANDARDS (4 cols) -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start" id="view-list">
<!-- Left 8 columns: Ledger List -->
<div class="lg:col-span-8 flex flex-col space-y-space-md">
<!-- Address Card 1: Default -->
<article class="bg-warm-porcelain border border-border rounded-xl p-space-lg relative overflow-hidden transition-all hover:border-lacquer-red/40">
<div class="absolute top-0 left-0 w-1 h-full bg-jade"></div>
<div class="flex flex-col space-y-3">
<div class="flex flex-wrap items-center justify-between gap-space-xs">
<div class="flex items-center gap-space-sm flex-wrap">
<span class="font-body-md text-body-md font-semibold text-ink">Nguyễn Thu Hà</span>
<span class="font-label-code text-label-code text-ink-muted tracking-tight">0912 345 678</span>
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF5F0] border border-[#B8DFD1] text-jade text-[11px] font-semibold tracking-wider uppercase">
<span class="material-symbols-outlined text-[13px]" style="font-variation-settings: 'FILL' 1;">verified</span>
                Mặc định
              </span>
<span class="inline-flex items-center px-2 py-0.5 rounded bg-raw-linen/70 text-ink-muted text-[11px] font-medium">
                Nhà riêng
              </span>
</div>
<span class="font-label-code text-[12px] text-ink-faint">ID: ADD-0104</span>
</div>
<div class="text-ink font-body-md leading-relaxed text-[15px]">
            Số 18, Ngõ 42, Phố Tràng Tiền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội
          </div>
<!-- Note badge for shipper -->
<div class="flex items-start gap-2 bg-rice-paper/80 border border-border rounded-lg p-3">
<span class="material-symbols-outlined text-turmeric text-[18px] flex-shrink-0 mt-0.5">sticky_note_2</span>
<div class="flex flex-col">
<span class="font-label-micro text-[11px] uppercase tracking-wider text-turmeric font-semibold">Chỉ dẫn bưu tá</span>
<p class="font-body-sm text-body-sm text-ink-muted text-[13px] leading-normal">
                Nhà trong ngõ, cổng gỗ màu nâu, vui lòng gọi điện trước 15 phút khi chuẩn bị giao.
              </p>
</div>
</div>
<!-- Actions Footer -->
<div class="pt-2 flex items-center justify-between border-t border-border/60">
<div class="flex items-center gap-4">
<button class="inline-flex items-center gap-1.5 text-ink-muted hover:text-lacquer-red text-[13px] font-medium transition-colors" onclick="switchState('form')" type="button">
<span class="material-symbols-outlined text-[16px]">edit</span>
<span>Chỉnh sửa</span>
</button>
<div class="h-3 w-[1px] bg-border"></div>
<span class="inline-flex items-center gap-1 text-[13px] text-ink-faint cursor-not-allowed">
<span class="material-symbols-outlined text-[16px] text-ink-faint">delete_outline</span>
<span>Không thể xoá địa chỉ mặc định</span>
</span>
</div>
<span class="font-label-micro text-label-micro text-jade uppercase font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">check_circle</span>
              Đang làm địa chỉ nhận chính
            </span>
</div>
</div>
</article>
<!-- Address Card 2: Office -->
<article class="bg-warm-porcelain border border-border rounded-xl p-space-lg transition-all hover:border-border/80">
<div class="flex flex-col space-y-3">
<div class="flex flex-wrap items-center justify-between gap-space-xs">
<div class="flex items-center gap-space-sm flex-wrap">
<span class="font-body-md text-body-md font-semibold text-ink">Nguyễn Thu Hà</span>
<span class="font-label-code text-label-code text-ink-muted tracking-tight">0912 345 678</span>
<span class="inline-flex items-center px-2 py-0.5 rounded bg-raw-linen/70 text-ink-muted text-[11px] font-medium">
                Văn phòng / Công ty
              </span>
</div>
<span class="font-label-code text-[12px] text-ink-faint">ID: ADD-0105</span>
</div>
<div class="text-ink font-body-md leading-relaxed text-[15px]">
            Tầng 6, Toà nhà V-Building, 125 Phố Bà Triệu, Phường Nguyễn Du, Quận Hai Bà Trưng, Hà Nội
          </div>
<!-- Note badge -->
<div class="flex items-start gap-2 bg-rice-paper/80 border border-border rounded-lg p-3">
<span class="material-symbols-outlined text-ink-muted text-[18px] flex-shrink-0 mt-0.5">sticky_note_2</span>
<div class="flex flex-col">
<span class="font-label-micro text-[11px] uppercase tracking-wider text-ink-muted font-semibold">Chỉ dẫn bưu tá</span>
<p class="font-body-sm text-body-sm text-ink-muted text-[13px] leading-normal">
                Giao trong giờ hành chính (8h30 - 17h30 từ Thứ Hai đến Thứ Sáu), gửi lễ tân tầng 1 nếu vắng mặt.
              </p>
</div>
</div>
<!-- Actions Footer -->
<div class="pt-2 flex items-center justify-between border-t border-border/60">
<div class="flex items-center gap-4">
<button class="inline-flex items-center gap-1.5 text-ink-muted hover:text-lacquer-red text-[13px] font-medium transition-colors" onclick="switchState('form')" type="button">
<span class="material-symbols-outlined text-[16px]">edit</span>
<span>Chỉnh sửa</span>
</button>
<div class="h-3 w-[1px] bg-border"></div>
<button class="inline-flex items-center gap-1.5 text-ink-muted hover:text-brick text-[13px] font-medium transition-colors" onclick="openDeleteModal('Tầng 6, Toà nhà V-Building, 125 Phố Bà Triệu, Quận Hai Bà Trưng')" type="button">
<span class="material-symbols-outlined text-[16px]">delete</span>
<span>Xoá địa chỉ</span>
</button>
</div>
<button class="inline-flex items-center gap-1 text-[13px] text-ink hover:text-lacquer-red font-medium transition-colors" onclick="simulateSetDefault(2)" type="button">
<span class="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
<span>Thiết lập làm mặc định</span>
</button>
</div>
</div>
</article>
<!-- Address Card 3: Parents -->
<article class="bg-warm-porcelain border border-border rounded-xl p-space-lg transition-all hover:border-border/80">
<div class="flex flex-col space-y-3">
<div class="flex flex-wrap items-center justify-between gap-space-xs">
<div class="flex items-center gap-space-sm flex-wrap">
<span class="font-body-md text-body-md font-semibold text-ink">Nguyễn Văn Nam (Bố mẹ)</span>
<span class="font-label-code text-label-code text-ink-muted tracking-tight">0988 234 567</span>
<span class="inline-flex items-center px-2 py-0.5 rounded bg-raw-linen/70 text-ink-muted text-[11px] font-medium">
                Nhà người thân
              </span>
</div>
<span class="font-label-code text-[12px] text-ink-faint">ID: ADD-0106</span>
</div>
<div class="text-ink font-body-md leading-relaxed text-[15px]">
            Số 45, Tiểu khu 3, Thị trấn Hát Lót, Huyện Mai Sơn, Tỉnh Sơn La
          </div>
<!-- Note badge -->
<div class="flex items-start gap-2 bg-rice-paper/80 border border-border rounded-lg p-3">
<span class="material-symbols-outlined text-ink-muted text-[18px] flex-shrink-0 mt-0.5">sticky_note_2</span>
<div class="flex flex-col">
<span class="font-label-micro text-[11px] uppercase tracking-wider text-ink-muted font-semibold">Chỉ dẫn bưu tá</span>
<p class="font-body-sm text-body-sm text-ink-muted text-[13px] leading-normal">
                Nhà mặt đường Quốc lộ 6, có người nhà nhận bưu phẩm mọi ngày trong tuần.
              </p>
</div>
</div>
<!-- Actions Footer -->
<div class="pt-2 flex items-center justify-between border-t border-border/60">
<div class="flex items-center gap-4">
<button class="inline-flex items-center gap-1.5 text-ink-muted hover:text-lacquer-red text-[13px] font-medium transition-colors" onclick="switchState('form')" type="button">
<span class="material-symbols-outlined text-[16px]">edit</span>
<span>Chỉnh sửa</span>
</button>
<div class="h-3 w-[1px] bg-border"></div>
<button class="inline-flex items-center gap-1.5 text-ink-muted hover:text-brick text-[13px] font-medium transition-colors" onclick="openDeleteModal('Số 45, Tiểu khu 3, Thị trấn Hát Lót, Huyện Mai Sơn, Tỉnh Sơn La')" type="button">
<span class="material-symbols-outlined text-[16px]">delete</span>
<span>Xoá địa chỉ</span>
</button>
</div>
<button class="inline-flex items-center gap-1 text-[13px] text-ink hover:text-lacquer-red font-medium transition-colors" onclick="simulateSetDefault(3)" type="button">
<span class="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
<span>Thiết lập làm mặc định</span>
</button>
</div>
</div>
</article>
</div>
<!-- Right 4 columns: Explainer & Standards Panel -->
<div class="lg:col-span-4 flex flex-col space-y-space-md">
<div class="bg-warm-porcelain border border-border rounded-xl p-space-lg flex flex-col space-y-space-md">
<div class="flex items-center gap-2 pb-space-sm border-b border-border">
<span class="material-symbols-outlined text-lacquer-red text-[20px]">local_shipping</span>
<h2 class="font-body-md text-body-md font-semibold text-ink">Nguyên tắc giao nhận Nếp</h2>
</div>
<ul class="flex flex-col space-y-4">
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-jade text-[18px] flex-shrink-0 mt-1">check_circle</span>
<div class="flex flex-col">
<span class="font-body-sm text-body-sm font-semibold text-ink">Địa chỉ mặc định ưu tiên</span>
<p class="font-body-sm text-body-sm text-ink-muted text-[13px] leading-relaxed">
                Mọi đơn hàng mới sẽ tự động chọn địa chỉ này tại bước thanh toán để tối giản thao tác mua hàng.
              </p>
</div>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-jade text-[18px] flex-shrink-0 mt-1">account_tree</span>
<div class="flex flex-col">
<span class="font-body-sm text-body-sm font-semibold text-ink">Chuẩn hoá định danh địa bàn</span>
<p class="font-body-sm text-body-sm text-ink-muted text-[13px] leading-relaxed">
                Dữ liệu hành chính đồng bộ trực tiếp với mạng lưới Bưu điện Việt Nam (VNPost), đảm bảo bưu tá tìm đúng từng ngõ ngách.
              </p>
</div>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-jade text-[18px] flex-shrink-0 mt-1">shield</span>
<div class="flex flex-col">
<span class="font-body-sm text-body-sm font-semibold text-ink">Bảo mật thông tin cá nhân</span>
<p class="font-body-sm text-body-sm text-ink-muted text-[13px] leading-relaxed">
                Số điện thoại và vị trí nhà của bạn được mã hoá theo tiêu chuẩn an toàn thông tin của ShopNest.
              </p>
</div>
</li>
</ul>
<div class="bg-rice-paper p-3 rounded-lg border border-border flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-turmeric text-[18px]">support_agent</span>
<span class="font-body-sm text-[13px] text-ink font-medium">Điều phối giao nhận:</span>
</div>
<span class="font-label-code text-[13px] font-semibold text-lacquer-red">1900 6886 (nhánh 3)</span>
</div>
</div>
<!-- Quick Delivery Capability Note -->
<div class="bg-rice-paper border border-border rounded-xl p-space-md flex flex-col space-y-2">
<span class="font-label-micro text-label-micro uppercase text-ink-muted font-bold tracking-wider">HẠNG MỤC PHỤC VỤ</span>
<div class="grid grid-cols-2 gap-2 pt-1 font-body-sm text-[13px] text-ink">
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-jade">verified</span>
<span>Đồng kiểm mở hộp</span>
</div>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-jade">verified</span>
<span>Hẹn giờ giao linh hoạt</span>
</div>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-jade">verified</span>
<span>Giao hoả tốc nội thành</span>
</div>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-jade">verified</span>
<span>Bao gói nẹp gỗ an toàn</span>
</div>
</div>
</div>
</div>
</div>
<!-- VIEW 2: ADDRESS FORM (7 cols Form + 5 cols VNPost Routing Preview) -->
<div class="hidden grid-cols-1 lg:grid-cols-12 gap-space-lg items-start" id="view-form">
<!-- Left 7 columns: Address Input Fields -->
<div class="lg:col-span-7 bg-warm-porcelain border border-border rounded-xl p-space-lg flex flex-col space-y-space-md">
<div class="flex items-center justify-between pb-space-sm border-b border-border">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-lacquer-red text-[20px]">add_location_alt</span>
<h2 class="font-headline-3 text-headline-3 text-ink font-semibold">Thêm địa chỉ nhận hàng mới</h2>
</div>
<button class="text-ink-muted hover:text-ink transition-colors" onclick="switchState('default')" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<form class="flex flex-col space-y-space-md" onsubmit="event.preventDefault(); switchState('default');">
<!-- Receiver & Phone -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div class="flex flex-col space-y-1.5">
<label class="font-body-sm text-body-sm text-ink font-semibold">
              Họ và tên người nhận <span class="text-lacquer-red">*</span>
</label>
<input class="h-12 px-3.5 rounded-xl border border-border bg-rice-paper/60 text-ink font-body-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:bg-warm-porcelain transition-all" placeholder="VD: Nguyễn Thu Hà" required="" type="text" value="Nguyễn Thu Hà"/>
</div>
<div class="flex flex-col space-y-1.5">
<label class="font-body-sm text-body-sm text-ink font-semibold">
              Số điện thoại liên hệ <span class="text-lacquer-red">*</span>
</label>
<input class="h-12 px-3.5 rounded-xl border border-border bg-rice-paper/60 text-ink font-label-code text-[14px] placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:bg-warm-porcelain transition-all" placeholder="0912 345 678" required="" type="tel" value="0912 345 678"/>
</div>
</div>
<!-- Administrative Divisions -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
<div class="flex flex-col space-y-1.5">
<label class="font-body-sm text-body-sm text-ink font-semibold">
              Tỉnh / Thành phố <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<select class="h-12 w-full appearance-none px-3.5 pr-8 rounded-xl border border-border bg-rice-paper/60 text-ink font-body-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:bg-warm-porcelain transition-all" id="province-select" onchange="updateLocationPreview()">
<option selected="" value="HN">Hà Nội</option>
<option value="HCM">TP. Hồ Chí Minh</option>
<option value="DN">Đà Nẵng</option>
<option value="SL">Sơn La</option>
<option value="HUE">Thừa Thiên Huế</option>
</select>
<span class="material-symbols-outlined text-ink-muted text-[18px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
</div>
</div>
<div class="flex flex-col space-y-1.5">
<label class="font-body-sm text-body-sm text-ink font-semibold">
              Quận / Huyện <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<select class="h-12 w-full appearance-none px-3.5 pr-8 rounded-xl border border-border bg-rice-paper/60 text-ink font-body-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:bg-warm-porcelain transition-all" id="district-select" onchange="updateLocationPreview()">
<option selected="" value="HK">Quận Hoàn Kiếm</option>
<option value="BD">Quận Ba Đình</option>
<option value="HBT">Quận Hai Bà Trưng</option>
<option value="CG">Quận Cầu Giấy</option>
</select>
<span class="material-symbols-outlined text-ink-muted text-[18px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
</div>
</div>
<div class="flex flex-col space-y-1.5">
<label class="font-body-sm text-body-sm text-ink font-semibold">
              Phường / Xã <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<select class="h-12 w-full appearance-none px-3.5 pr-8 rounded-xl border border-border bg-rice-paper/60 text-ink font-body-sm focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:bg-warm-porcelain transition-all" id="ward-select" onchange="updateLocationPreview()">
<option selected="" value="TT">Phường Tràng Tiền</option>
<option value="PCT">Phường Phan Chu Trinh</option>
<option value="HB">Phường Hàng Bài</option>
</select>
<span class="material-symbols-outlined text-ink-muted text-[18px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
</div>
</div>
</div>
<!-- Detailed Street Address -->
<div class="flex flex-col space-y-1.5">
<label class="font-body-sm text-body-sm text-ink font-semibold">
            Địa chỉ cụ thể (Số nhà, ngõ ngách, tên toà nhà, đường phố) <span class="text-lacquer-red">*</span>
</label>
<input class="h-12 px-3.5 rounded-xl border border-border bg-rice-paper/60 text-ink font-body-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:bg-warm-porcelain transition-all" id="detail-address-input" oninput="updateLocationPreview()" placeholder="VD: Số 18, Ngõ 42, Phố Tràng Tiền" required="" type="text" value="Số 18, Ngõ 42, Phố Tràng Tiền"/>
</div>
<!-- Address classification tag -->
<div class="flex flex-col space-y-1.5">
<label class="font-body-sm text-body-sm text-ink font-semibold">Loại địa chỉ</label>
<div class="flex items-center gap-space-sm">
<label class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-lacquer-red bg-lacquer-wash text-lacquer-red cursor-pointer text-[13px] font-medium">
<input checked="" class="accent-lacquer-red" name="addr-type" type="radio" value="home"/>
<span>Nhà riêng</span>
</label>
<label class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-rice-paper/40 text-ink-muted hover:text-ink cursor-pointer text-[13px] font-medium">
<input class="accent-lacquer-red" name="addr-type" type="radio" value="office"/>
<span>Văn phòng</span>
</label>
<label class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-rice-paper/40 text-ink-muted hover:text-ink cursor-pointer text-[13px] font-medium">
<input class="accent-lacquer-red" name="addr-type" type="radio" value="family"/>
<span>Nhà người thân</span>
</label>
</div>
</div>
<!-- Shipper Note -->
<div class="flex flex-col space-y-1.5">
<label class="font-body-sm text-body-sm text-ink font-semibold flex items-center justify-between">
<span>Ghi chú cho bưu tá nhận hàng</span>
<span class="font-label-micro text-ink-faint font-normal">Tuỳ chọn</span>
</label>
<textarea class="p-3 rounded-xl border border-border bg-rice-paper/60 text-ink font-body-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:bg-warm-porcelain transition-all resize-none" placeholder="VD: Nhà trong ngõ hẹp, cổng màu nâu, vui lòng gọi điện trước khi giao..." rows="3"></textarea>
</div>
<!-- Default Checkbox -->
<label class="flex items-start gap-3 p-3 rounded-xl bg-rice-paper/60 border border-border cursor-pointer select-none">
<input checked="" class="mt-1 h-4 w-4 rounded border-border accent-lacquer-red" type="checkbox"/>
<div class="flex flex-col">
<span class="font-body-sm text-body-sm font-semibold text-ink">Đặt làm địa chỉ nhận hàng mặc định</span>
<span class="font-body-sm text-ink-muted text-[13px]">
              Hệ thống sẽ tự động gán địa chỉ này trong tất cả các giỏ hàng thanh toán sau này.
            </span>
</div>
</label>
<!-- Action Buttons -->
<div class="flex items-center gap-space-sm pt-space-xs">
<button class="h-12 px-7 rounded-xl bg-lacquer-red text-warm-porcelain font-body-sm text-body-sm font-semibold hover:bg-lacquer-deep transition-all active:scale-[0.98]" type="submit">
            Lưu địa chỉ
          </button>
<button class="h-12 px-6 rounded-xl border border-border bg-warm-porcelain text-ink font-body-sm text-body-sm font-medium hover:bg-raw-linen/60 transition-all" onclick="switchState('default')" type="button">
            Huỷ bỏ
          </button>
</div>
</form>
</div>
<!-- Right 5 columns: Non-map Location & VNPost Routing Validation Panel -->
<div class="lg:col-span-5 bg-warm-porcelain border border-border rounded-xl p-space-lg flex flex-col space-y-space-md">
<div class="flex items-center justify-between pb-space-sm border-b border-border">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-jade text-[20px]">hub</span>
<h3 class="font-body-md text-body-md font-semibold text-ink">Định vị tuyến phát VNPost</h3>
</div>
<span class="inline-flex items-center gap-1 text-[11px] font-label-code text-jade font-semibold bg-[#EBF5F0] px-2 py-0.5 rounded">
<span class="w-1.5 h-1.5 rounded-full bg-jade"></span>
          ĐỒNG BỘ 100%
        </span>
</div>
<!-- Postal Code Badge -->
<div class="bg-rice-paper border border-border rounded-xl p-space-md flex flex-col space-y-2">
<div class="flex items-center justify-between">
<span class="font-label-micro text-label-micro uppercase text-ink-muted font-bold tracking-wider">MÃ BƯU CHÍNH QUỐC GIA</span>
<span class="font-label-code text-headline-3 font-semibold text-ink" id="preview-postcode">110000</span>
</div>
<div class="text-[13px] text-ink-muted">
          Khu vực phân loại tự động tại trung tâm khai thác: <span class="font-semibold text-ink" id="preview-hub">Hà Nội Hub 01</span>
</div>
</div>
<!-- Route Preview Card -->
<div class="flex flex-col space-y-2">
<span class="font-label-micro text-label-micro uppercase text-ink-muted font-bold tracking-wider">TUYẾN BƯU TÁ ĐẢM NHẬN</span>
<div class="p-3 bg-warm-porcelain border border-border rounded-lg flex items-start gap-3">
<span class="material-symbols-outlined text-lacquer-red text-[20px] flex-shrink-0 mt-0.5">location_city</span>
<div class="flex flex-col">
<span class="font-body-sm font-semibold text-ink" id="preview-post-office">Bưu cục Hoàn Kiếm 01 - Tràng Tiền</span>
<span class="text-[12px] text-ink-muted">Tuyến phát số 14 (Chuyên trách phố cổ &amp; hành chính)</span>
</div>
</div>
</div>
<!-- Compatible Shipping Methods -->
<div class="flex flex-col space-y-2">
<span class="font-label-micro text-label-micro uppercase text-ink-muted font-bold tracking-wider">DỊCH VỤ GIAO VẬN KHẢ DỤNG</span>
<div class="flex flex-col space-y-2">
<div class="flex items-center justify-between p-2.5 rounded-lg border border-border bg-rice-paper/50">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-jade text-[18px]">bolt</span>
<span class="font-body-sm text-[13px] font-medium text-ink">Hoả tốc 2H nội thành</span>
</div>
<span class="font-label-code text-[12px] text-jade font-semibold">Có hỗ trợ</span>
</div>
<div class="flex items-center justify-between p-2.5 rounded-lg border border-border bg-rice-paper/50">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-turmeric text-[18px]">inventory_2</span>
<span class="font-body-sm text-[13px] font-medium text-ink">Đồng kiểm mở hộp lúc giao</span>
</div>
<span class="font-label-code text-[12px] text-jade font-semibold">Tiêu chuẩn</span>
</div>
<div class="flex items-center justify-between p-2.5 rounded-lg border border-border bg-rice-paper/50">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-ink-muted text-[18px]">schedule</span>
<span class="font-body-sm text-[13px] font-medium text-ink">Hẹn giờ nhận ngoài giờ</span>
</div>
<span class="font-label-code text-[12px] text-jade font-semibold">Khả dụng</span>
</div>
</div>
</div>
<!-- Helpful Advice Box -->
<div class="p-3.5 bg-raw-linen/50 border border-border rounded-xl flex items-start gap-2.5">
<span class="material-symbols-outlined text-turmeric text-[18px] flex-shrink-0 mt-0.5">lightbulb</span>
<p class="font-body-sm text-ink-muted text-[13px] leading-relaxed">
<strong class="text-ink font-semibold">Lời khuyên từ Nếp:</strong> Điền chính xác số phòng, tầng hoặc toà nhà giúp bưu phẩm thủ công tránh va đập và giảm 40% thời gian tìm nhà của shipper.
        </p>
</div>
</div>
</div>
<!-- VIEW 3: LOADING SIMULATION -->
<div class="hidden flex-col items-center justify-center p-space-xl bg-warm-porcelain border border-border rounded-xl space-y-4" id="view-loading">
<div class="w-10 h-10 border-2 border-lacquer-wash border-t-lacquer-red rounded-full animate-spin"></div>
<div class="flex flex-col items-center gap-1 text-center">
<span class="font-body-md text-body-md font-semibold text-ink">Đang tải danh mục hành chính 63 Tỉnh/Thành...</span>
<span class="font-body-sm text-body-sm text-ink-muted">Đồng bộ cơ sở dữ liệu định danh bưu chính VNPost</span>
</div>
</div>
<!-- VIEW 4: EMPTY STATE (Toggled via simulation) -->
<div class="hidden flex-col items-center justify-center py-16 px-space-md bg-warm-porcelain border border-border rounded-xl text-center space-y-4" id="view-empty">
<div class="w-16 h-16 rounded-full bg-raw-linen flex items-center justify-center text-ink-muted">
<span class="material-symbols-outlined text-[32px]">home_pin</span>
</div>
<div class="max-w-md flex flex-col space-y-1">
<h3 class="font-headline-3 text-headline-3 font-semibold text-ink">Chưa có địa chỉ lưu trữ</h3>
<p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
        Thêm một địa chỉ để nhận hàng từ các xưởng nghệ nhân thủ công ShopNest thuận tiện và nhanh chóng nhất.
      </p>
</div>
<button class="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-lacquer-red text-warm-porcelain font-body-sm text-body-sm font-semibold hover:bg-lacquer-deep transition-all" onclick="switchState('form')" type="button">
<span class="material-symbols-outlined text-[20px]">add</span>
<span>Thêm địa chỉ đầu tiên</span>
</button>
</div>
<!-- VIEW 5: DELETE CONFIRMATION MODAL (Overlay) -->
<div class="hidden fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-space-md" id="delete-modal">
<div class="bg-warm-porcelain border border-border rounded-2xl max-w-md w-full p-space-lg flex flex-col space-y-space-md shadow-sm">
<div class="flex items-center gap-3 text-brick">
<div class="w-10 h-10 rounded-full bg-[#FCECEB] border border-[#F5C7C4] flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-[22px]">delete_forever</span>
</div>
<div class="flex flex-col">
<h3 class="font-body-md text-body-md font-semibold text-ink">Xác nhận xoá địa chỉ này?</h3>
<span class="font-label-micro text-label-micro text-brick uppercase font-semibold">HÀNH ĐỘNG KHÔNG THỂ HOÀN TÁC</span>
</div>
</div>
<div class="bg-rice-paper p-3 rounded-lg border border-border text-ink font-body-sm text-[13px] leading-relaxed" id="modal-address-preview">
        Tầng 6, Toà nhà V-Building, 125 Phố Bà Triệu, Phường Nguyễn Du, Quận Hai Bà Trưng, Hà Nội
      </div>
<p class="font-body-sm text-body-sm text-ink-muted leading-relaxed">
        Thao tác này sẽ xoá hoàn toàn thông tin khỏi sổ địa chỉ cá nhân của bạn. Các đơn hàng đang trong hành trình vận chuyển sẽ không bị ảnh hưởng.
      </p>
<div class="flex items-center justify-end gap-space-sm pt-2">
<button class="h-11 px-5 rounded-xl border border-border bg-warm-porcelain text-ink font-body-sm text-body-sm font-medium hover:bg-raw-linen/60 transition-all" onclick="closeDeleteModal()" type="button">
          Giữ lại địa chỉ
        </button>
<button class="h-11 px-5 rounded-xl bg-brick text-warm-porcelain font-body-sm text-body-sm font-semibold hover:bg-[#72201B] transition-all" onclick="confirmDelete()" type="button">
          Xoá vĩnh viễn
        </button>
</div>
</div>
</div>
</div>
<script>
  function switchState(stateName) {
    // Hide all views
    document.getElementById('view-list').classList.add('hidden');
    document.getElementById('view-form').classList.add('hidden');
    document.getElementById('view-form').classList.remove('grid');
    document.getElementById('view-loading').classList.add('hidden');
    document.getElementById('view-loading').classList.remove('flex');
    document.getElementById('view-empty').classList.add('hidden');
    document.getElementById('view-empty').classList.remove('flex');

    // Reset button states in simulator bar
    const buttons = document.querySelectorAll('#state-controls button');
    buttons.forEach(btn => {
      btn.className = 'px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink-muted hover:text-ink transition-all';
    });

    const counter = document.getElementById('address-counter');

    if (stateName === 'default') {
      document.getElementById('view-list').classList.remove('hidden');
      document.getElementById('btn-state-default').className = 'px-3 py-1.5 rounded-lg border border-lacquer-red bg-lacquer-wash text-lacquer-red font-medium transition-all';
      if (counter) counter.innerText = '03 ĐỊA CHỈ LƯU TRỮ';
    } else if (stateName === 'form') {
      document.getElementById('view-form').classList.remove('hidden');
      document.getElementById('view-form').classList.add('grid');
      document.getElementById('btn-state-form').className = 'px-3 py-1.5 rounded-lg border border-lacquer-red bg-lacquer-wash text-lacquer-red font-medium transition-all';
    } else if (stateName === 'loading') {
      document.getElementById('view-loading').classList.remove('hidden');
      document.getElementById('view-loading').classList.add('flex');
      document.getElementById('btn-state-loading').className = 'px-3 py-1.5 rounded-lg border border-lacquer-red bg-lacquer-wash text-lacquer-red font-medium transition-all';
      setTimeout(() => {
        switchState('form');
      }, 900);
    } else if (stateName === 'empty') {
      document.getElementById('view-empty').classList.remove('hidden');
      document.getElementById('view-empty').classList.add('flex');
      document.getElementById('btn-state-empty').className = 'px-3 py-1.5 rounded-lg border border-lacquer-red bg-lacquer-wash text-lacquer-red font-medium transition-all';
      if (counter) counter.innerText = '00 ĐỊA CHỈ LƯU TRỮ';
    }
  }

  function openDeleteModal(addressSnippet) {
    if (addressSnippet) {
      document.getElementById('modal-address-preview').innerText = addressSnippet;
    }
    document.getElementById('delete-modal').classList.remove('hidden');
    document.getElementById('btn-state-modal').className = 'px-3 py-1.5 rounded-lg border border-lacquer-red bg-lacquer-wash text-lacquer-red font-medium transition-all';
  }

  function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    document.getElementById('btn-state-modal').className = 'px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink-muted hover:text-ink transition-all';
  }

  function confirmDelete() {
    closeDeleteModal();
    // Simulate removing an item
    const counter = document.getElementById('address-counter');
    if (counter) counter.innerText = '02 ĐỊA CHỈ LƯU TRỮ';
  }

  function simulateSetDefault(index) {
    alert('Đã cập nhật địa chỉ này thành địa chỉ nhận hàng mặc định.');
  }

  function updateLocationPreview() {
    const prov = document.getElementById('province-select');
    const provText = prov.options[prov.selectedIndex].text;
    const postcode = document.getElementById('preview-postcode');
    const hub = document.getElementById('preview-hub');
    const postOffice = document.getElementById('preview-post-office');

    if (provText.includes('Hà Nội')) {
      postcode.innerText = '110000';
      hub.innerText = 'Hà Nội Hub 01';
      postOffice.innerText = 'Bưu cục Hoàn Kiếm 01 - Tràng Tiền';
    } else if (provText.includes('Hồ Chí Minh')) {
      postcode.innerText = '700000';
      hub.innerText = 'Sài Gòn Trung tâm Q1';
      postOffice.innerText = 'Bưu cục Bến Nghé - 02 Công Xã Paris';
    } else if (provText.includes('Đà Nẵng')) {
      postcode.innerText = '550000';
      hub.innerText = 'Đà Nẵng Hub Trung tâm';
      postOffice.innerText = 'Bưu cục Hải Châu 01';
    } else if (provText.includes('Sơn La')) {
      postcode.innerText = '360000';
      hub.innerText = 'Tây Bắc Hub';
      postOffice.innerText = 'Bưu cục Huyện Mai Sơn';
    } else {
      postcode.innerText = '490000';
      hub.innerText = 'Thừa Thiên Huế Hub';
      postOffice.innerText = 'Bưu cục Cố Đô';
    }
  }
</script></div></main></div></div></div></body></html>
```
### C06 — Profile and settings
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "turmeric": "#8A5A1A", "background": "#fef9ee", "on-surface": "#1d1c15", "on-tertiary-fixed-variant": "#4b463a", "tertiary": "#514b3f", "on-primary-fixed-variant": "#891c16", "on-secondary-fixed-variant": "#494641", "lacquer-red": "#B23A2F", "lacquer-wash": "#F2DCD5", "ink-muted": "#6B6458", "surface-container-lowest": "#ffffff", "inverse-primary": "#ffb4aa", "secondary-fixed-dim": "#cbc6bf", "jade": "#2F6B57", "surface-dim": "#dedacf", "on-primary": "#ffffff", "ink": "#1D1B17", "primary-fixed-dim": "#ffb4aa", "primary": "#91221a", "on-tertiary-fixed": "#1f1b11", "on-error": "#ffffff", "tertiary-fixed-dim": "#cec6b5", "surface-tint": "#aa342a", "on-error-container": "#93000a", "logo-blue": "#4991D8", "tertiary-fixed": "#eae2d1", "primary-fixed": "#ffdad5", "on-secondary-container": "#67645f", "inverse-surface": "#323029", "on-primary-fixed": "#410001", "on-tertiary": "#ffffff", "error": "#ba1a1a", "secondary-container": "#e8e2db", "outline": "#8c716d", "surface-container-high": "#ede8dd", "surface-container-low": "#f8f3e8", "warm-porcelain": "#FFFCF4", "on-primary-container": "#ffd9d3", "on-secondary": "#ffffff", "rice-paper": "#F6F1E6", "tertiary-container": "#696356", "on-background": "#1d1c15", "surface-container": "#f2ede2", "surface-bright": "#fef9ee", "error-container": "#ffdad6", "on-surface-variant": "#58413e", "inverse-on-surface": "#f5f0e5", "secondary-fixed": "#e8e2db", "border": "#DCD1BE", "surface-variant": "#e7e2d7", "secondary": "#615e59", "on-secondary-fixed": "#1d1b17", "on-tertiary-container": "#e9e0cf", "ink-faint": "#9A8F7F", "brick": "#8B2A24", "primary-container": "#b23a2f", "surface-container-highest": "#e7e2d7", "outline-variant": "#dfbfbb", "raw-linen": "#EDE4D3", "lacquer-deep": "#8C2A22", "surface": "#fef9ee" }, "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, "spacing": { "gutter": "1.5rem", "space-sm": "0.5rem", "margin-mobile": "1.25rem", "space-xl": "2.5rem", "space-md": "1rem", "space-xs": "0.25rem", "margin": "3rem", "gutter-mobile": "1rem", "space-lg": "1.5rem" }, "fontFamily": { "display-lg": [ "Newsreader" ], "display-lg-mobile": [ "Newsreader" ], "body-lg": [ "Be Vietnam Pro" ], "label-micro": [ "Be Vietnam Pro" ], "body-sm": [ "Be Vietnam Pro" ], "display-xl-mobile": [ "Newsreader" ], "headline-2": [ "Newsreader" ], "body-md": [ "Be Vietnam Pro" ], "headline-1": [ "Newsreader" ], "display-xl": [ "Newsreader" ], "label-code": [ "JetBrains Mono" ], "headline-3": [ "Be Vietnam Pro" ] }, "fontSize": { "display-lg": [ "48px", { "lineHeight": "48px", "letterSpacing": "-0.03em", "fontWeight": "600" } ], "display-lg-mobile": [ "32px", { "lineHeight": "34px", "letterSpacing": "-0.025em", "fontWeight": "600" } ], "body-lg": [ "18px", { "lineHeight": "28px", "fontWeight": "400" } ], "label-micro": [ "12px", { "lineHeight": "16px", "letterSpacing": "0.12em", "fontWeight": "600" } ], "body-sm": [ "14px", { "lineHeight": "21px", "fontWeight": "400" } ], "display-xl-mobile": [ "40px", { "lineHeight": "40px", "letterSpacing": "-0.03em", "fontWeight": "600" } ], "headline-2": [ "28px", { "lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600" } ], "body-md": [ "16px", { "lineHeight": "26px", "fontWeight": "400" } ], "headline-1": [ "36px", { "lineHeight": "40px", "letterSpacing": "-0.025em", "fontWeight": "600" } ], "display-xl": [ "64px", { "lineHeight": "60px", "letterSpacing": "-0.035em", "fontWeight": "600" } ], "label-code": [ "14px", { "lineHeight": "20px", "fontWeight": "500" } ], "headline-3": [ "18px", { "lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "600" } ] } } } };</script></head><body class="bg-rice-paper font-body-md text-ink antialiased selection:bg-lacquer-wash selection:text-lacquer-deep"><header class="fixed top-0 left-0 right-0 z-50 bg-warm-porcelain border-b border-border"><div class="h-16 w-full px-gutter flex items-center justify-between gap-space-lg"><div class="flex items-center gap-space-md shrink-0"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><span class="font-headline-3 text-headline-3 text-ink tracking-tight">ShopNest</span><span class="font-label-micro text-label-micro text-ink-muted uppercase border-l border-border pl-space-sm ml-space-xs hidden sm:inline-block">Khách hàng</span></div><div class="flex-1 max-w-md hidden md:block"><div class="relative flex items-center w-full"><span class="material-symbols-outlined absolute left-3 text-ink-muted text-[18px]">search</span><input class="w-full h-10 pl-10 pr-4 bg-rice-paper border border-border rounded-lg font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-lacquer-red" placeholder="Tìm kiếm sản phẩm, đơn hàng..." type="text"/></div></div><nav class="hidden lg:flex items-center gap-space-lg" data-active-classes="text-lacquer-red font-semibold"><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="trang-chu" href="#">Trang chủ</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="danh-muc" href="#">Danh mục</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="khuyen-mai" href="#">Khuyến mãi</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="shop-viet" href="#">Shop Việt</a><a class="font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="don-hang" href="#">Đơn hàng</a></nav><div class="flex items-center gap-space-md shrink-0"><div class="flex items-center gap-space-sm pl-space-sm border-l border-border"><div class="text-right hidden sm:block"><div class="font-body-sm text-body-sm font-semibold text-ink leading-tight">Nguyễn Thu Hà</div><div class="font-label-micro text-label-micro text-ink-muted uppercase">Thành viên Nếp</div></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div></header><aside class="fixed left-0 top-16 bottom-0 w-[220px] bg-warm-porcelain border-r border-border z-40 flex flex-col justify-between py-space-md"><div class="flex flex-col gap-space-sm px-space-sm"><div class="px-space-sm py-space-xs font-label-micro text-label-micro uppercase text-ink-muted tracking-wider">Tài khoản của tôi</div><nav class="flex flex-col gap-0.5" data-active-classes="bg-lacquer-wash text-lacquer-deep font-semibold border-r-2 border-lacquer-red"><a class="flex items-center gap-space-sm px-3 py-2.5 rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="don-mua" href="#"><span class="material-symbols-outlined text-[20px]">receipt_long</span><span>Đơn mua</span></a><a class="flex items-center gap-space-sm px-3 py-2.5 rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="ho-so" href="#"><span class="material-symbols-outlined text-[20px]">person</span><span>Hồ sơ</span></a><a class="flex items-center gap-space-sm px-3 py-2.5 rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="dia-chi" href="#"><span class="material-symbols-outlined text-[20px]">location_on</span><span>Địa chỉ</span></a><a class="flex items-center gap-space-sm px-3 py-2.5 rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="doi-mat-khau" href="#"><span class="material-symbols-outlined text-[20px]">lock_reset</span><span>Đổi mật khẩu</span></a><a class="flex items-center gap-space-sm px-3 py-2.5 rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="da-luu" href="#"><span class="material-symbols-outlined text-[20px]">bookmark_border</span><span>Đã lưu</span></a><a class="flex items-center gap-space-sm px-3 py-2.5 rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="kho-voucher-nep" href="#"><span class="material-symbols-outlined text-[20px]">confirmation_number</span><span>Kho voucher Nếp</span></a><a class="flex items-center gap-space-sm px-3 py-2.5 rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="thong-bao" href="#"><span class="material-symbols-outlined text-[20px]">notifications</span><span>Thông báo</span></a><a class="flex items-center gap-space-sm px-3 py-2.5 rounded font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-path="ho-tro-khach-hang" href="#"><span class="material-symbols-outlined text-[20px]">support_agent</span><span>Hỗ trợ khách hàng</span></a></nav></div><div class="px-space-sm pt-space-sm border-t border-border"><div class="p-space-sm rounded bg-rice-paper border border-border"><div class="font-label-micro text-label-micro uppercase text-ink-muted">Chăm sóc Nếp</div><div class="font-label-code text-label-code text-lacquer-red font-semibold mt-0.5">1900 6868</div></div></div></aside><div class="pl-[220px]"><main class="relative pt-16 min-h-screen bg-rice-paper p-space-lg"><div class="flex flex-col w-full">
<!-- Toast Notification Container -->
<div class="fixed top-20 right-8 z-50 flex items-center gap-space-md p-space-md bg-warm-porcelain shadow-xl rounded-xl transition-all duration-300 transform translate-y-0 opacity-100 max-w-md" id="toastNotification" style="outline: 2px solid #2F6B57; outline-offset: -2px;">
<div class="w-8 h-8 rounded-full bg-jade/10 text-jade flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<div class="flex-1 min-w-0">
<div class="font-headline-3 text-headline-3 text-ink leading-tight text-[15px]">Cập nhật thành công</div>
<div class="font-body-sm text-body-sm text-ink-muted leading-tight mt-0.5">Đã lưu thay đổi hồ sơ tài khoản Nếp.</div>
</div>
<button aria-label="Đóng" class="text-ink-muted hover:text-ink transition-colors p-1" onclick="document.getElementById('toastNotification').classList.add('opacity-0', 'pointer-events-none')">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
<!-- Validation Banner Container (Hidden by default) -->
<div class="hidden mb-space-lg p-space-md bg-lacquer-wash/50 rounded-xl flex items-start gap-space-md text-ink" id="validationBanner" style="outline: 1px solid #B23A2F;">
<span class="material-symbols-outlined text-lacquer-red text-[22px] shrink-0 mt-0.5">error</span>
<div class="flex-1">
<div class="font-headline-3 text-headline-3 text-lacquer-deep text-[15px]">Thông tin chưa hợp lệ</div>
<p class="font-body-sm text-body-sm text-ink-muted mt-0.5">Vui lòng kiểm tra lại các trường có dấu hoa thị màu đỏ và định dạng số điện thoại liên kết.</p>
</div>
<button class="text-lacquer-deep p-1" onclick="document.getElementById('validationBanner').classList.add('hidden')">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
<!-- Top State Simulator Banner -->
<div class="w-full bg-surface-container p-space-md rounded-xl mb-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
<div class="flex items-center gap-space-xs text-ink-muted">
<span class="material-symbols-outlined text-[18px] text-turmeric">tune</span>
<span class="font-label-micro text-label-micro uppercase tracking-wider text-ink">Bộ mô phỏng trạng thái UI:</span>
</div>
<div class="flex flex-wrap items-center gap-1.5">
<button class="px-3 py-1.5 rounded-full font-label-micro text-label-micro uppercase transition-all bg-lacquer-red text-warm-porcelain font-semibold" id="btnStateDefault" onclick="simulateState('default')">
        Mặc định (Hồ sơ)
      </button>
<button class="px-3 py-1.5 rounded-full font-label-micro text-label-micro uppercase transition-all bg-warm-porcelain text-ink-muted hover:text-ink hover:bg-surface-container-high" id="btnStatePassword" onclick="simulateState('password')">
        Đổi mật khẩu
      </button>
<button class="px-3 py-1.5 rounded-full font-label-micro text-label-micro uppercase transition-all bg-warm-porcelain text-ink-muted hover:text-ink hover:bg-surface-container-high" id="btnStateTheme" onclick="simulateState('theme')">
        Tuỳ chọn Giao diện
      </button>
<button class="px-3 py-1.5 rounded-full font-label-micro text-label-micro uppercase transition-all bg-warm-porcelain text-jade hover:bg-surface-container-high" onclick="simulateState('toast')">
        Đã lưu (Toast)
      </button>
<button class="px-3 py-1.5 rounded-full font-label-micro text-label-micro uppercase transition-all bg-warm-porcelain text-lacquer-red hover:bg-surface-container-high" onclick="simulateState('error')">
        Lỗi xác thực (Validation)
      </button>
</div>
</div>
<!-- Settings Rail / Sub-Navigation Tabs -->
<div class="w-full bg-warm-porcelain rounded-xl p-1.5 mb-space-xl flex flex-wrap items-center gap-1 shadow-sm">
<button class="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg font-headline-3 text-headline-3 text-[14px] bg-rice-paper text-lacquer-red font-semibold transition-all shadow-sm" id="tabProfile" onclick="switchTab('profile')">
<span class="material-symbols-outlined text-[18px]">badge</span>
<span>Hồ sơ cá nhân</span>
</button>
<button class="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg font-body-sm text-body-sm text-ink-muted hover:text-ink hover:bg-surface-container transition-all" id="tabPassword" onclick="switchTab('password')">
<span class="material-symbols-outlined text-[18px]">lock_reset</span>
<span>Bảo mật &amp; Mật khẩu</span>
</button>
<button class="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg font-body-sm text-body-sm text-ink-muted hover:text-ink hover:bg-surface-container transition-all" id="tabAppearance" onclick="switchTab('appearance')">
<span class="material-symbols-outlined text-[18px]">palette</span>
<span>Giao diện &amp; Tuỳ biến</span>
</button>
</div>
<!-- Main Content Layout: 8 columns Left, 4 columns Right -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
<!-- Left Column (8 cols) -->
<div class="lg:col-span-8 flex flex-col gap-space-xl">
<!-- SECTION 1: PROFILE ("HỒ SƠ CÁ NHÂN") -->
<section class="bg-warm-porcelain p-space-xl rounded-2xl shadow-sm flex flex-col gap-space-xl" id="secProfile">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-lacquer-red inline-block"></span>
<span class="font-label-micro text-label-micro uppercase tracking-wider text-ink-muted">Tài khoản ShopNest</span>
</div>
<h2 class="font-headline-1 text-headline-2 text-ink">Hồ sơ cá nhân</h2>
<p class="font-body-md text-body-md text-ink-muted">Quản lý thông tin hồ sơ để bảo mật tài khoản và đồng bộ đơn hàng Nếp.</p>
</div>
<!-- Avatar Management Box -->
<div class="p-space-lg rounded-xl bg-rice-paper flex flex-col sm:flex-row items-center sm:items-start gap-space-lg">
<div class="relative shrink-0">
<img class="w-20 h-20 rounded-full object-cover shadow-sm bg-warm-porcelain" data-alt="Close-up studio portrait of Nguyen Thu Ha, a cheerful 30-year-old Vietnamese woman with a neat ponytail, natural makeup, and warm smile, captured with gentle golden lighting against a subtle off-white rice paper background. Editorial and calm aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM8nEq-WBw_U2kfuzz5a8CxDtCHr34EH_mybGodJN9oyxuVN8pXwXGwjyZUkAFQhiFdtx3LAHNMYdztLmC-sMrs0Ia0kfc9bFJa__HJ2ima1QjbGV05smjOWpjGRKuDu1RMtuWfH0DPqrnEQBl7uTDw_zS96iA4_WvGbVFGFGlegJIn4SxxYj326iLncoZOE5HVkSblV7HbBeArp1t9WdLWTxswyA2prX5AwbyQQ"/>
<div class="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-lacquer-red text-warm-porcelain flex items-center justify-center shadow">
<span class="material-symbols-outlined text-[14px]">photo_camera</span>
</div>
</div>
<div class="flex flex-col gap-space-sm items-center sm:items-start text-center sm:text-left flex-1 min-w-0">
<div class="flex flex-wrap items-center gap-space-sm">
<button class="px-space-md h-10 rounded-xl bg-warm-porcelain hover:bg-lacquer-wash text-ink font-body-sm text-body-sm font-semibold transition-colors shadow-sm" type="button">
                Thay đổi ảnh đại diện
              </button>
<button class="px-space-sm h-10 rounded-xl text-ink-muted hover:text-lacquer-red font-body-sm text-body-sm transition-colors" type="button">
                Gỡ ảnh
              </button>
</div>
<p class="font-body-sm text-body-sm text-ink-muted">Định dạng JPG, PNG tối đa 5MB. Ảnh rõ nét giúp bưu tá dễ nhận diện khi giao hàng tận tay.</p>
</div>
</div>
<!-- Profile Form Inputs -->
<form class="flex flex-col gap-space-lg" onsubmit="event.preventDefault(); simulateState('toast');">
<!-- Row 1: Name -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div class="flex flex-col gap-1.5">
<label class="font-body-sm text-body-sm font-semibold text-ink flex items-center gap-1" for="inputLastName">
                Họ <span class="text-lacquer-red">*</span>
</label>
<input class="h-12 px-space-md rounded-xl bg-warm-porcelain font-body-md text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:ring-offset-2 transition-all shadow-sm" id="inputLastName" type="text" value="Nguyễn"/>
</div>
<div class="flex flex-col gap-1.5">
<label class="font-body-sm text-body-sm font-semibold text-ink flex items-center gap-1" for="inputFirstName">
                Tên <span class="text-lacquer-red">*</span>
</label>
<input class="h-12 px-space-md rounded-xl bg-warm-porcelain font-body-md text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:ring-offset-2 transition-all shadow-sm" id="inputFirstName" type="text" value="Thu Hà"/>
</div>
</div>
<!-- Row 2: Email & Phone -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div class="flex flex-col gap-1.5">
<div class="flex items-center justify-between">
<label class="font-body-sm text-body-sm font-semibold text-ink flex items-center gap-1" for="inputEmail">
                  Email <span class="text-lacquer-red">*</span>
</label>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-jade/10 text-jade font-label-micro text-label-micro">
<span class="material-symbols-outlined text-[13px]" style="font-variation-settings: 'FILL' 1;">verified</span>
                  Đã xác thực
                </span>
</div>
<div class="relative">
<input class="w-full h-12 pl-space-md pr-10 rounded-xl bg-warm-porcelain font-label-code text-label-code text-ink focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:ring-offset-2 transition-all shadow-sm" id="inputEmail" type="email" value="thuha.nguyen@gmail.com"/>
<span class="material-symbols-outlined absolute right-3 top-3 text-jade text-[20px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
</div>
<div class="flex flex-col gap-1.5">
<div class="flex items-center justify-between">
<label class="font-body-sm text-body-sm font-semibold text-ink flex items-center gap-1" for="inputPhone">
                  Số điện thoại <span class="text-lacquer-red">*</span>
</label>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-jade/10 text-jade font-label-micro text-label-micro">
<span class="material-symbols-outlined text-[13px]" style="font-variation-settings: 'FILL' 1;">link</span>
                  Đã liên kết
                </span>
</div>
<div class="relative">
<input class="w-full h-12 pl-space-md pr-10 rounded-xl bg-warm-porcelain font-label-code text-label-code text-ink focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:ring-offset-2 transition-all shadow-sm" id="inputPhone" type="text" value="0912 345 678"/>
<span class="material-symbols-outlined absolute right-3 top-3 text-ink-muted text-[20px]">phone_android</span>
</div>
</div>
</div>
<!-- Row 3: Date of Birth & Gender -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div class="flex flex-col gap-1.5">
<label class="font-body-sm text-body-sm font-semibold text-ink" for="inputDOB">Ngày sinh</label>
<div class="relative">
<input class="w-full h-12 px-space-md rounded-xl bg-warm-porcelain font-label-code text-label-code text-ink focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:ring-offset-2 transition-all shadow-sm" id="inputDOB" type="text" value="18/06/1994"/>
<span class="material-symbols-outlined absolute right-3 top-3 text-ink-muted text-[20px]">calendar_today</span>
</div>
</div>
<div class="flex flex-col gap-1.5">
<label class="font-body-sm text-body-sm font-semibold text-ink">Giới tính</label>
<div class="grid grid-cols-3 gap-2 h-12">
<label class="flex items-center justify-center gap-1.5 px-3 rounded-xl bg-lacquer-wash text-lacquer-deep font-body-sm text-body-sm font-semibold cursor-pointer select-none transition-all shadow-sm">
<input checked="" class="accent-lacquer-red w-4 h-4 hidden" name="gender" type="radio" value="female"/>
<span class="w-2 h-2 rounded-full bg-lacquer-red"></span>
<span>Nữ</span>
</label>
<label class="flex items-center justify-center gap-1.5 px-3 rounded-xl bg-rice-paper text-ink-muted hover:text-ink font-body-sm text-body-sm cursor-pointer select-none transition-all">
<input class="accent-lacquer-red w-4 h-4 hidden" name="gender" type="radio" value="male"/>
<span>Nam</span>
</label>
<label class="flex items-center justify-center gap-1.5 px-3 rounded-xl bg-rice-paper text-ink-muted hover:text-ink font-body-sm text-body-sm cursor-pointer select-none transition-all">
<input class="accent-lacquer-red w-4 h-4 hidden" name="gender" type="radio" value="other"/>
<span>Khác</span>
</label>
</div>
</div>
</div>
<!-- Buttons -->
<div class="flex flex-wrap items-center gap-space-md pt-space-sm">
<button class="h-12 px-space-xl bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain font-body-sm text-body-sm font-semibold rounded-xl transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2" type="submit">
<span class="material-symbols-outlined text-[18px]">save</span>
<span>Lưu thay đổi</span>
</button>
<button class="h-12 px-space-lg bg-surface-container hover:bg-surface-container-high text-ink font-body-sm text-body-sm font-semibold rounded-xl transition-colors" type="button">
              Đặt lại về ban đầu
            </button>
</div>
</form>
</section>
<!-- SECTION 2: PASSWORD ("BẢO MẬT & MẬT KHẨU") -->
<section class="bg-warm-porcelain p-space-xl rounded-2xl shadow-sm flex flex-col gap-space-xl" id="secPassword">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-turmeric inline-block"></span>
<span class="font-label-micro text-label-micro uppercase tracking-wider text-ink-muted">Bảo mật tài khoản</span>
</div>
<h2 class="font-headline-1 text-headline-2 text-ink">Đổi mật khẩu</h2>
<p class="font-body-md text-body-md text-ink-muted">Nên sử dụng mật khẩu mạnh có ít nhất 8 ký tự gồm chữ, số và ký hiệu đặc biệt.</p>
</div>
<form class="flex flex-col gap-space-lg" onsubmit="event.preventDefault(); simulateState('toast');">
<!-- Current Password -->
<div class="flex flex-col gap-1.5 max-w-md">
<label class="font-body-sm text-body-sm font-semibold text-ink flex items-center justify-between" for="currentPassword">
<span>Mật khẩu hiện tại <span class="text-lacquer-red">*</span></span>
<a class="font-label-micro text-label-micro text-lacquer-red hover:underline uppercase" href="#">Quên mật khẩu?</a>
</label>
<div class="relative">
<input class="w-full h-12 pl-space-md pr-12 rounded-xl bg-warm-porcelain font-label-code text-label-code text-ink focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:ring-offset-2 transition-all shadow-sm" id="currentPassword" type="password" value="ShopNestSecure123@"/>
<button class="absolute right-3 top-3 text-ink-muted hover:text-ink" onclick="togglePassVisibility('currentPassword', this)" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
<!-- New Password -->
<div class="flex flex-col gap-1.5 max-w-md">
<label class="font-body-sm text-body-sm font-semibold text-ink" for="newPassword">
              Mật khẩu mới <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<input class="w-full h-12 pl-space-md pr-12 rounded-xl bg-warm-porcelain font-label-code text-label-code text-ink focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:ring-offset-2 transition-all shadow-sm" id="newPassword" type="password" value="Thuhanguyen@2025#"/>
<button class="absolute right-3 top-3 text-ink-muted hover:text-ink" onclick="togglePassVisibility('newPassword', this)" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
<!-- Strength Indicator -->
<div class="flex flex-col gap-1 mt-1">
<div class="grid grid-cols-4 gap-1.5 h-1.5">
<div class="rounded-full bg-jade h-full"></div>
<div class="rounded-full bg-jade h-full"></div>
<div class="rounded-full bg-jade h-full"></div>
<div class="rounded-full bg-surface-container h-full"></div>
</div>
<div class="flex items-center justify-between">
<span class="font-label-micro text-label-micro text-jade font-semibold flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">shield</span>
                  Mật khẩu an toàn
                </span>
<span class="font-label-micro text-label-micro text-ink-muted">3/4 tiêu chí đạt chuẩn</span>
</div>
</div>
</div>
<!-- Confirm Password -->
<div class="flex flex-col gap-1.5 max-w-md">
<label class="font-body-sm text-body-sm font-semibold text-ink" for="confirmPassword">
              Nhập lại mật khẩu mới <span class="text-lacquer-red">*</span>
</label>
<div class="relative">
<input class="w-full h-12 pl-space-md pr-12 rounded-xl bg-warm-porcelain font-label-code text-label-code text-ink focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:ring-offset-2 transition-all shadow-sm" id="confirmPassword" type="password" value="Thuhanguyen@2025#"/>
<button class="absolute right-3 top-3 text-ink-muted hover:text-ink" onclick="togglePassVisibility('confirmPassword', this)" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
<!-- Update Password Action -->
<div class="pt-space-xs">
<button class="h-12 px-space-xl bg-rice-paper hover:bg-lacquer-wash text-ink font-body-sm text-body-sm font-semibold rounded-xl transition-all shadow-sm" type="submit">
              Cập nhật mật khẩu
            </button>
</div>
</form>
</section>
<!-- SECTION 3: APPEARANCE ("GIAO DIỆN & TUỲ BIẾN") -->
<section class="bg-warm-porcelain p-space-xl rounded-2xl shadow-sm flex flex-col gap-space-xl" id="secAppearance">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-jade inline-block"></span>
<span class="font-label-micro text-label-micro uppercase tracking-wider text-ink-muted">Cá nhân hoá trải nghiệm</span>
</div>
<h2 class="font-headline-1 text-headline-2 text-ink">Tuỳ chọn hiển thị &amp; Ngôn ngữ</h2>
<p class="font-body-md text-body-md text-ink-muted">Điều chỉnh trải nghiệm mua sắm phù hợp với thói quen của bạn.</p>
</div>
<div class="flex flex-col gap-space-lg">
<!-- Theme Mode -->
<div class="flex flex-col gap-space-sm">
<label class="font-body-sm text-body-sm font-semibold text-ink">Giao diện hiển thị</label>
<div class="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
<!-- Light Theme Card (Selected) -->
<div class="p-space-md rounded-xl bg-warm-porcelain flex flex-col gap-space-sm cursor-pointer shadow-sm" style="outline: 2px solid #B23A2F;">
<div class="h-20 rounded-lg bg-rice-paper p-2 flex flex-col justify-between">
<div class="w-8 h-2 rounded bg-lacquer-red"></div>
<div class="flex gap-1.5">
<div class="w-full h-8 rounded bg-warm-porcelain shadow-sm"></div>
<div class="w-full h-8 rounded bg-warm-porcelain shadow-sm"></div>
</div>
</div>
<div class="flex items-center justify-between">
<span class="font-body-sm text-body-sm font-semibold text-lacquer-deep">Sáng (Mặc định)</span>
<span class="material-symbols-outlined text-lacquer-red text-[18px]">check_circle</span>
</div>
</div>
<!-- Dark Theme Card -->
<div class="p-space-md rounded-xl bg-rice-paper flex flex-col gap-space-sm cursor-pointer opacity-85 hover:opacity-100 transition-opacity">
<div class="h-20 rounded-lg bg-ink p-2 flex flex-col justify-between">
<div class="w-8 h-2 rounded bg-turmeric"></div>
<div class="flex gap-1.5">
<div class="w-full h-8 rounded bg-surface-container-high/20"></div>
<div class="w-full h-8 rounded bg-surface-container-high/20"></div>
</div>
</div>
<div class="flex flex-col">
<span class="font-body-sm text-body-sm font-medium text-ink">Tối</span>
<span class="font-label-micro text-label-micro text-ink-muted">Thử nghiệm</span>
</div>
</div>
<!-- System Sync Theme Card -->
<div class="p-space-md rounded-xl bg-rice-paper flex flex-col gap-space-sm cursor-pointer opacity-85 hover:opacity-100 transition-opacity">
<div class="h-20 rounded-lg bg-gradient-to-r from-rice-paper to-ink p-2 flex items-center justify-center">
<span class="material-symbols-outlined text-ink-muted text-[24px]">devices</span>
</div>
<div class="flex flex-col">
<span class="font-body-sm text-body-sm font-medium text-ink">Theo hệ thống</span>
<span class="font-label-micro text-label-micro text-ink-muted">Tự động đồng bộ</span>
</div>
</div>
</div>
</div>
<!-- Language Selector -->
<div class="flex flex-col gap-space-sm">
<label class="font-body-sm text-body-sm font-semibold text-ink">Ngôn ngữ</label>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md max-w-lg">
<label class="flex items-center justify-between p-space-md rounded-xl bg-lacquer-wash text-lacquer-deep cursor-pointer font-body-sm text-body-sm font-semibold shadow-sm">
<div class="flex items-center gap-space-sm">
<span class="font-label-code text-label-code text-lacquer-red">VN</span>
<span>Tiếng Việt (Mặc định)</span>
</div>
<span class="material-symbols-outlined text-lacquer-red text-[20px]">radio_button_checked</span>
</label>
<label class="flex items-center justify-between p-space-md rounded-xl bg-rice-paper text-ink-muted hover:text-ink cursor-pointer font-body-sm text-body-sm">
<div class="flex items-center gap-space-sm">
<span class="font-label-code text-label-code text-ink-muted">EN</span>
<span>English</span>
</div>
<span class="material-symbols-outlined text-ink-muted text-[20px]">radio_button_unchecked</span>
</label>
</div>
</div>
<!-- Currency Selector -->
<div class="flex flex-col gap-space-sm">
<label class="font-body-sm text-body-sm font-semibold text-ink">Đơn vị tiền tệ</label>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md max-w-lg">
<label class="flex items-center justify-between p-space-md rounded-xl bg-lacquer-wash text-lacquer-deep cursor-pointer font-body-sm text-body-sm font-semibold shadow-sm">
<div class="flex items-center gap-space-sm">
<span class="font-label-code text-label-code text-lacquer-red">₫</span>
<span>VND (₫ - Đồng Việt Nam)</span>
</div>
<span class="material-symbols-outlined text-lacquer-red text-[20px]">radio_button_checked</span>
</label>
<label class="flex items-center justify-between p-space-md rounded-xl bg-rice-paper text-ink-muted hover:text-ink cursor-pointer font-body-sm text-body-sm">
<div class="flex items-center gap-space-sm">
<span class="font-label-code text-label-code text-ink-muted">$</span>
<span>USD ($)</span>
</div>
<span class="material-symbols-outlined text-ink-muted text-[20px]">radio_button_unchecked</span>
</label>
</div>
</div>
</div>
</section>
</div>
<!-- Right Column: Sticky Help & Security Panel (4 cols) -->
<div class="lg:col-span-4 flex flex-col gap-space-lg sticky top-24">
<!-- Security Status Card -->
<div class="bg-warm-porcelain p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-lg">
<div class="flex items-center gap-space-sm">
<div class="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-lacquer-red shrink-0">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">security</span>
</div>
<div>
<h3 class="font-headline-3 text-headline-3 text-ink leading-tight">Bảo mật tài khoản Nếp</h3>
<span class="font-label-micro text-label-micro text-jade uppercase font-semibold">Mức độ an toàn: Cao</span>
</div>
</div>
<!-- Security Checklist -->
<div class="flex flex-col gap-space-sm">
<div class="flex items-start gap-space-sm p-2.5 rounded-xl bg-rice-paper">
<span class="material-symbols-outlined text-jade text-[18px] shrink-0 mt-0.5" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="font-body-sm text-body-sm text-ink leading-snug">Email đã xác thực bảo mật</span>
</div>
<div class="flex items-start gap-space-sm p-2.5 rounded-xl bg-rice-paper">
<span class="material-symbols-outlined text-jade text-[18px] shrink-0 mt-0.5" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="font-body-sm text-body-sm text-ink leading-snug">Số điện thoại nhận OTP hoạt động</span>
</div>
<div class="flex items-start gap-space-sm p-2.5 rounded-xl bg-rice-paper">
<span class="material-symbols-outlined text-turmeric text-[18px] shrink-0 mt-0.5" style="font-variation-settings: 'FILL' 1;">warning</span>
<span class="font-body-sm text-body-sm text-ink leading-snug">Mật khẩu cập nhật lần cuối: 3 tháng trước</span>
</div>
</div>
<!-- Security Notice -->
<div class="p-space-md rounded-xl bg-surface-container flex flex-col gap-space-xs text-ink-muted">
<div class="flex items-center gap-1.5 text-ink font-body-sm text-body-sm font-semibold">
<span class="material-symbols-outlined text-[16px] text-lacquer-red">verified_user</span>
<span>Nguyên tắc Nếp Care</span>
</div>
<p class="font-body-sm text-body-sm leading-relaxed text-[13px]">
            ShopNest không bao giờ yêu cầu bạn cung cấp mật khẩu hoặc mã OTP qua tin nhắn hay cuộc gọi. Hãy luôn kiểm tra tên miền <span class="font-label-code text-label-code text-ink font-semibold">shopnest.vn</span> trước khi đăng nhập.
          </p>
<a class="mt-1 font-body-sm text-body-sm text-lacquer-red hover:underline font-semibold flex items-center gap-1 text-[13px]" href="#">
            Tìm hiểu chính sách bảo mật Nếp Care
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</div>
</div>
<!-- Support Box -->
<div class="bg-warm-porcelain p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md">
<div class="flex items-center gap-space-sm">
<div class="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-ink shrink-0">
<span class="material-symbols-outlined text-[20px]">support_agent</span>
</div>
<div>
<h4 class="font-headline-3 text-headline-3 text-ink text-[16px]">Cần hỗ trợ về tài khoản?</h4>
<span class="font-body-sm text-body-sm text-ink-muted text-[13px]">Đội ngũ Chăm sóc Nếp sẵn sàng</span>
</div>
</div>
<div class="flex flex-col gap-2 pt-1 font-body-sm text-body-sm">
<div class="flex items-center justify-between p-2.5 rounded-lg bg-rice-paper">
<span class="text-ink-muted text-[13px]">Hotline CSKH</span>
<a class="font-label-code text-label-code font-bold text-lacquer-red" href="tel:19006886">1900 6886 (nhánh 1)</a>
</div>
<div class="flex items-center justify-between p-2.5 rounded-lg bg-rice-paper">
<span class="text-ink-muted text-[13px]">Hộp thư điện tử</span>
<a class="font-label-code text-label-code text-ink" href="mailto:hotro@shopnest.vn">hotro@shopnest.vn</a>
</div>
<div class="flex items-center justify-between px-2 text-[12px] text-ink-muted">
<span>Giờ hoạt động</span>
<span class="font-label-code text-label-code">8:00 - 21:00 hàng ngày</span>
</div>
</div>
</div>
<!-- Activity Summary Visual Sparkline -->
<div class="bg-warm-porcelain p-space-md rounded-2xl shadow-sm flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-micro text-label-micro uppercase text-ink-muted">Hoạt động tài khoản</span>
<span class="font-body-sm text-body-sm font-semibold text-ink">Đăng nhập từ Safari MacOS</span>
<span class="font-label-code text-label-code text-[11px] text-jade">Hà Nội • Vừa xong</span>
</div>
<div class="w-16 h-8 flex items-end gap-1">
<span class="w-2 bg-jade/20 rounded-t h-3"></span>
<span class="w-2 bg-jade/40 rounded-t h-5"></span>
<span class="w-2 bg-jade/60 rounded-t h-4"></span>
<span class="w-2 bg-jade rounded-t h-7"></span>
</div>
</div>
</div>
</div>
<script>
    function simulateState(state) {
      const banner = document.getElementById('validationBanner');
      const toast = document.getElementById('toastNotification');
      const tabProfile = document.getElementById('tabProfile');
      const tabPassword = document.getElementById('tabPassword');
      const tabAppearance = document.getElementById('tabAppearance');
      
      const secProfile = document.getElementById('secProfile');
      const secPassword = document.getElementById('secPassword');
      const secAppearance = document.getElementById('secAppearance');

      if (state === 'default') {
        switchTab('profile');
        banner.classList.add('hidden');
        toast.classList.add('opacity-0', 'pointer-events-none');
        window.scrollTo({ top: secProfile.offsetTop - 80, behavior: 'smooth' });
      } else if (state === 'password') {
        switchTab('password');
        banner.classList.add('hidden');
        window.scrollTo({ top: secPassword.offsetTop - 80, behavior: 'smooth' });
      } else if (state === 'theme') {
        switchTab('appearance');
        banner.classList.add('hidden');
        window.scrollTo({ top: secAppearance.offsetTop - 80, behavior: 'smooth' });
      } else if (state === 'toast') {
        toast.classList.remove('opacity-0', 'pointer-events-none');
        banner.classList.add('hidden');
        setTimeout(() => {
          toast.classList.add('opacity-0', 'pointer-events-none');
        }, 4000);
      } else if (state === 'error') {
        banner.classList.remove('hidden');
        toast.classList.add('opacity-0', 'pointer-events-none');
        window.scrollTo({ top: banner.offsetTop - 80, behavior: 'smooth' });
      }
    }

    function switchTab(tabKey) {
      const tabs = [
        { key: 'profile', tab: document.getElementById('tabProfile'), sec: document.getElementById('secProfile') },
        { key: 'password', tab: document.getElementById('tabPassword'), sec: document.getElementById('secPassword') },
        { key: 'appearance', tab: document.getElementById('tabAppearance'), sec: document.getElementById('secAppearance') }
      ];

      tabs.forEach(item => {
        if (item.key === tabKey) {
          item.tab.className = 'flex items-center gap-space-xs px-space-md py-2.5 rounded-lg font-headline-3 text-headline-3 text-[14px] bg-rice-paper text-lacquer-red font-semibold transition-all shadow-sm';
          item.sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          item.tab.className = 'flex items-center gap-space-xs px-space-md py-2.5 rounded-lg font-body-sm text-body-sm text-ink-muted hover:text-ink hover:bg-surface-container transition-all';
        }
      });
    }

    function togglePassVisibility(inputId, btn) {
      const input = document.getElementById(inputId);
      const icon = btn.querySelector('.material-symbols-outlined');
      if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility_off';
      } else {
        input.type = 'password';
        icon.textContent = 'visibility';
      }
    }
  </script>
</div></main></div></body></html>
```
### C07 - Notifications
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;family=Newsreader:ital,opsz,wght@0,6..72,600;1,6..72,600&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{colors:{"ink-muted":"#6B6458","surface-dim":"#dedacf","turmeric":"#8A5A1A","surface-container-lowest":"#ffffff","on-tertiary":"#ffffff","lacquer-wash":"#F2DCD5","secondary":"#615e59","primary-fixed":"#ffdad5","on-background":"#1d1c15","on-surface-variant":"#58413e","tertiary-fixed":"#eae2d1","surface-bright":"#fef9ee","ink":"#1D1B17","surface-container-low":"#f8f3e8","primary-fixed-dim":"#ffb4aa","brick":"#8B2A24","secondary-fixed-dim":"#cbc6bf","on-secondary-fixed-variant":"#494641","on-error":"#ffffff","warm-porcelain":"#FFFCF4","on-secondary-container":"#67645f","surface-container":"#f2ede2","surface-tint":"#aa342a","outline-variant":"#dfbfbb","on-primary-fixed":"#410001","inverse-on-surface":"#f5f0e5","on-secondary":"#ffffff","surface-container-high":"#ede8dd","error":"#ba1a1a","secondary-fixed":"#e8e2db","tertiary":"#514b3f","jade":"#2F6B57","on-primary-fixed-variant":"#891c16","primary":"#91221a","raw-linen":"#EDE4D3","border":"#DCD1BE","tertiary-container":"#696356","background":"#fef9ee","inverse-primary":"#ffb4aa","secondary-container":"#e8e2db","on-surface":"#1d1c15","surface-container-highest":"#e7e2d7","tertiary-fixed-dim":"#cec6b5","on-tertiary-container":"#e9e0cf","error-container":"#ffdad6","on-secondary-fixed":"#1d1b17","inverse-surface":"#323029","rice-paper":"#F6F1E6","on-primary":"#ffffff","on-tertiary-fixed-variant":"#4b463a","ink-faint":"#9A8F7F","outline":"#8c716d","logo-blue":"#4991D8","lacquer-red":"#B23A2F","lacquer-deep":"#8C2A22","primary-container":"#b23a2f","surface-variant":"#e7e2d7","on-tertiary-fixed":"#1f1b11","on-error-container":"#93000a","surface":"#fef9ee","on-primary-container":"#ffd9d3"},borderRadius:{DEFAULT:"0.25rem",lg:"0.5rem",xl:"0.75rem",full:"9999px"},spacing:{"gutter":"1.5rem","space-md":"1rem","margin":"3rem","gutter-mobile":"1rem","space-xl":"2.5rem","space-lg":"1.5rem","space-xs":"0.25rem","margin-mobile":"1.25rem","space-sm":"0.5rem"},fontFamily:{"display-xl-mobile":["Newsreader"],"display-xl":["Newsreader"],"body-lg":["Be Vietnam Pro"],"headline-1":["Newsreader"],"label-micro":["Be Vietnam Pro"],"headline-3":["Be Vietnam Pro"],"display-lg-mobile":["Newsreader"],"body-md":["Be Vietnam Pro"],"display-lg":["Newsreader"],"label-code":["JetBrains Mono"],"body-sm":["Be Vietnam Pro"],"headline-2":["Newsreader"]},fontSize:{"display-xl-mobile":["40px",{lineHeight:"40px",letterSpacing:"-0.03em",fontWeight:"600"}],"display-xl":["64px",{lineHeight:"60px",letterSpacing:"-0.035em",fontWeight:"600"}],"body-lg":["18px",{lineHeight:"28px",fontWeight:"400"}],"headline-1":["36px",{lineHeight:"40px",letterSpacing:"-0.025em",fontWeight:"600"}],"label-micro":["12px",{lineHeight:"16px",letterSpacing:"0.12em",fontWeight:"600"}],"headline-3":["18px",{lineHeight:"24px",letterSpacing:"-0.01em",fontWeight:"600"}],"display-lg-mobile":["32px",{lineHeight:"34px",letterSpacing:"-0.025em",fontWeight:"600"}],"body-md":["16px",{lineHeight:"26px",fontWeight:"400"}],"display-lg":["48px",{lineHeight:"48px",letterSpacing:"-0.03em",fontWeight:"600"}],"label-code":["14px",{lineHeight:"20px",fontWeight:"500"}],"body-sm":["14px",{lineHeight:"21px",fontWeight:"400"}],"headline-2":["28px",{lineHeight:"32px",letterSpacing:"-0.02em",fontWeight:"600"}]}}}};</script></head><body class="bg-rice-paper text-ink font-body-sm text-body-sm min-h-screen selection:bg-lacquer-wash selection:text-ink"><header class="fixed top-0 left-0 right-0 h-20 bg-warm-porcelain z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-border"><div class="h-20 w-full px-gutter flex items-center justify-between gap-space-lg"><div class="flex items-center gap-space-md shrink-0"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ALJJyrCZZpwGugd0U5Q-lvSrGvUoCPG8oXHeGA84GqRrb4UgAjwSeR5luRbQmMTEb9t2QZRZqecve7DLx8yo6X1BNT19_LaSDAeUx4sKXssya0JRug58TIk4Q-F4kxlav1i1OfAzaEZrkhyez2iY_sBcuWBPh7n5pKneYwfBR62ybtq8SMih7tl8hAIDb_uPH20KbVI7bTsBblpFekqRhiLspV18Kh3duLE3NUncON2wYTXqRHH_bbZbYGDV"/><div class="flex flex-col"><span class="font-headline-3 text-headline-3 text-ink tracking-tight uppercase">ShopNest</span><span class="font-label-micro text-label-micro text-ink-muted uppercase tracking-wider">NẾP SỐNG THỦ CÔNG &amp; TIÊU DÙNG TUYỂN CHỌN</span></div></div><div class="flex-1 max-w-xl mx-auto"><div class="relative flex items-center w-full"><span class="material-symbols-outlined absolute left-space-md text-ink-faint text-[20px] pointer-events-none">search</span><input class="w-full h-11 pl-11 pr-space-md bg-warm-porcelain border border-border rounded-lg font-body-sm text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-lacquer-red focus:border-lacquer-red transition-all" placeholder="Tìm kiếm đơn hàng, sản phẩm..." type="text"/></div></div><div class="flex items-center gap-space-lg shrink-0"><nav class="hidden xl:flex items-center gap-space-md" data-active-classes="text-lacquer-red font-semibold"><a class="font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors px-space-xs py-space-xs" data-path="trang-chu" href="#">Trang chủ</a><a class="font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors px-space-xs py-space-xs" data-path="danh-muc" href="#">Danh mục</a><a class="font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors px-space-xs py-space-xs" data-path="khuyen-mai" href="#">Khuyến mãi</a><a class="font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors px-space-xs py-space-xs" data-path="shop-viet" href="#">Shop Việt</a><a class="font-body-sm text-body-sm text-ink-muted hover:text-ink transition-colors px-space-xs py-space-xs" data-path="don-hang" href="#">Đơn hàng</a></nav><div class="flex items-center gap-space-sm pl-space-md border-l border-border"><div class="flex flex-col text-right"><span class="font-body-sm text-body-sm font-semibold text-ink leading-tight">Nguyễn Thu Hà</span><span class="font-label-micro text-label-micro text-turmeric font-semibold uppercase tracking-wider">THÀNH VIÊN NẾP VÀNG</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div></header><div class="flex pt-20"><aside class="fixed left-0 top-20 bottom-0 w-60 bg-rice-paper border-r border-border z-40 flex flex-col justify-between overflow-y-auto"><div class="py-space-lg"><div class="px-space-lg mb-space-sm"><h3 class="font-label-micro text-label-micro text-ink-muted uppercase tracking-wider font-semibold">TÀI KHOẢN CỦA TÔI</h3></div><nav class="flex flex-col space-y-0.5" data-active-classes="bg-lacquer-wash text-lacquer-red font-semibold border-l-4 border-lacquer-red"><a class="flex items-center justify-between px-space-lg py-2.5 text-ink-muted hover:bg-surface-container hover:text-ink transition-all border-l-4 border-transparent" data-path="don-mua" href="#"><div class="flex items-center gap-space-sm"><span class="material-symbols-outlined text-[20px]">receipt_long</span><span class="font-body-sm text-body-sm">Đơn mua</span></div></a><a class="flex items-center justify-between px-space-lg py-2.5 text-ink-muted hover:bg-surface-container hover:text-ink transition-all border-l-4 border-transparent" data-path="ho-so" href="#"><div class="flex items-center gap-space-sm"><span class="material-symbols-outlined text-[20px]">manage_accounts</span><span class="font-body-sm text-body-sm">Hồ sơ</span></div></a><a class="flex items-center justify-between px-space-lg py-2.5 text-ink-muted hover:bg-surface-container hover:text-ink transition-all border-l-4 border-transparent" data-path="dia-chi" href="#"><div class="flex items-center gap-space-sm"><span class="material-symbols-outlined text-[20px]">pin_drop</span><span class="font-body-sm text-body-sm">Địa chỉ</span></div></a><a class="flex items-center justify-between px-space-lg py-2.5 text-ink-muted hover:bg-surface-container hover:text-ink transition-all border-l-4 border-transparent" data-path="doi-mat-khau" href="#"><div class="flex items-center gap-space-sm"><span class="material-symbols-outlined text-[20px]">lock_reset</span><span class="font-body-sm text-body-sm">Đổi mật khẩu</span></div></a><a class="flex items-center justify-between px-space-lg py-2.5 text-ink-muted hover:bg-surface-container hover:text-ink transition-all border-l-4 border-transparent" data-path="da-luu" href="#"><div class="flex items-center gap-space-sm"><span class="material-symbols-outlined text-[20px]">bookmark_border</span><span class="font-body-sm text-body-sm">Đã lưu</span></div></a><a class="flex items-center justify-between px-space-lg py-2.5 text-ink-muted hover:bg-surface-container hover:text-ink transition-all border-l-4 border-transparent" data-path="kho-voucher-nep" href="#"><div class="flex items-center gap-space-sm"><span class="material-symbols-outlined text-[20px]">confirmation_number</span><span class="font-body-sm text-body-sm">Kho voucher Nếp</span></div></a><a class="flex items-center justify-between px-space-lg py-2.5 text-ink-muted hover:bg-surface-container hover:text-ink transition-all border-l-4 border-transparent" data-path="thong-bao" href="#"><div class="flex items-center gap-space-sm"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="font-body-sm text-body-sm">Thông báo</span></div><span class="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-lacquer-red text-warm-porcelain font-label-code text-[11px] font-semibold leading-none">3</span></a><a class="flex items-center justify-between px-space-lg py-2.5 text-ink-muted hover:bg-surface-container hover:text-ink transition-all border-l-4 border-transparent" data-path="ho-tro-khach-hang" href="#"><div class="flex items-center gap-space-sm"><span class="material-symbols-outlined text-[20px]">support_agent</span><span class="font-body-sm text-body-sm">Hỗ trợ khách hàng</span></div></a></nav></div><div class="p-space-lg border-t border-border"><div class="p-space-md bg-warm-porcelain rounded-lg border border-border flex flex-col gap-1"><span class="font-label-micro text-label-micro text-ink-muted uppercase">HẠNG NẾP VÀNG</span><span class="font-label-code text-label-code text-ink font-semibold">1.420 / 2.000 Điểm</span><div class="w-full bg-raw-linen h-1.5 rounded-full overflow-hidden mt-1"><div class="bg-turmeric h-full w-[71%]"></div></div></div></div></aside><div class="pl-60 flex-1 flex flex-col min-h-[calc(100vh-5rem)]"><main class="flex-1 w-full p-gutter bg-rice-paper"><div class="flex flex-col w-full">
<!-- Top Simulation Interactive Bar (Bộ mô phỏng trạng thái thông báo) -->
<section class="w-full mb-space-lg bg-warm-porcelain border border-border rounded-lg p-space-md shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div class="flex items-center gap-space-sm shrink-0">
<span class="material-symbols-outlined text-lacquer-red text-[20px]">tune</span>
<span class="font-body-sm font-semibold text-ink uppercase tracking-wider text-[13px]">BỘ MÔ PHỎNG TRẠNG THÁI</span>
</div>
<div class="flex flex-wrap items-center gap-2">
<button class="sim-btn px-3 py-1.5 rounded-lg border border-lacquer-red bg-lacquer-wash text-lacquer-red font-body-sm text-[13px] font-semibold transition-all" id="sim-default">
          Mặc định (3 chưa đọc)
        </button>
<button class="sim-btn px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink hover:bg-warm-porcelain font-body-sm text-[13px] transition-all" id="sim-readall">
          Đã đọc tất cả
        </button>
<button class="sim-btn px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink hover:bg-warm-porcelain font-body-sm text-[13px] transition-all" id="sim-order">
          Lọc Đơn hàng (3)
        </button>
<button class="sim-btn px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink hover:bg-warm-porcelain font-body-sm text-[13px] transition-all" id="sim-promo">
          Lọc Khuyến mãi (2)
        </button>
<button class="sim-btn px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink hover:bg-warm-porcelain font-body-sm text-[13px] transition-all" id="sim-skeleton">
          Đang tải skeleton
        </button>
<button class="sim-btn px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink hover:bg-warm-porcelain font-body-sm text-[13px] transition-all" id="sim-empty">
          Danh sách trống (Empty)
        </button>
</div>
</div>
</section>
<!-- 12-Column Main Workspace Split -->
<div class="grid grid-cols-12 gap-space-lg items-start w-full">
<!-- LEFT 8 COLUMNS: Notification Stream -->
<div class="col-span-12 xl:col-span-8 flex flex-col gap-space-lg">
<!-- Stream Header & Controls -->
<div class="flex flex-col gap-space-md">
<!-- Breadcrumb -->
<nav class="flex items-center gap-2 font-label-micro text-ink-muted">
<span>Tài khoản của tôi</span>
<span class="text-ink-faint">/</span>
<span class="text-ink font-semibold">Thông báo</span>
</nav>
<!-- Main Title & Quick Actions -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm border-b border-border">
<div class="flex items-center gap-space-md">
<h1 class="font-headline-3 text-headline-3 text-ink font-bold tracking-tight">
              Thông báo
            </h1>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-lacquer-wash text-lacquer-red font-body-sm text-[13px] font-semibold border border-outline-variant/40" id="unread-counter-badge">
              3 chưa đọc
            </span>
</div>
<div class="flex items-center gap-space-md">
<button class="flex items-center gap-1.5 text-ink-muted hover:text-lacquer-red transition-colors font-body-sm text-[13px]" id="action-mark-all">
<span class="material-symbols-outlined text-[18px]">done_all</span>
<span>Đánh dấu tất cả đã đọc</span>
</button>
<span class="h-3 w-px bg-border hidden sm:inline-block"></span>
<button class="flex items-center gap-1.5 text-ink-muted hover:text-ink transition-colors font-body-sm text-[13px]" id="action-open-settings">
<span class="material-symbols-outlined text-[18px]">settings</span>
<span>Cài đặt thông báo</span>
</button>
</div>
</div>
<!-- Filter Pill Tabs -->
<div class="flex items-center gap-2 overflow-x-auto pb-1" id="filter-tabs-bar">
<button class="filter-tab px-4 py-2 rounded-lg bg-lacquer-red text-warm-porcelain font-body-sm text-body-sm font-semibold transition-all" data-filter="all">
            Tất cả (8)
          </button>
<button class="filter-tab px-4 py-2 rounded-lg bg-warm-porcelain border border-border text-ink-muted hover:text-ink hover:border-ink-muted font-body-sm text-body-sm transition-all" data-filter="order">
            Đơn hàng (3)
          </button>
<button class="filter-tab px-4 py-2 rounded-lg bg-warm-porcelain border border-border text-ink-muted hover:text-ink hover:border-ink-muted font-body-sm text-body-sm transition-all" data-filter="shop">
            Người bán &amp; Chat (1)
          </button>
<button class="filter-tab px-4 py-2 rounded-lg bg-warm-porcelain border border-border text-ink-muted hover:text-ink hover:border-ink-muted font-body-sm text-body-sm transition-all" data-filter="promo">
            Khuyến mãi (2)
          </button>
<button class="filter-tab px-4 py-2 rounded-lg bg-warm-porcelain border border-border text-ink-muted hover:text-ink hover:border-ink-muted font-body-sm text-body-sm transition-all" data-filter="system">
            Hệ thống (2)
          </button>
</div>
</div>
<!-- Notification Container (Clean cohesive list separated by 1px border) -->
<div class="w-full rounded-xl border border-border overflow-hidden bg-rice-paper" id="main-notification-container">
<!-- Live Notifications List -->
<div class="divide-y divide-border flex flex-col" id="notification-list">
<!-- Row 1: Đơn hàng (Unread) -->
<div class="notification-row group flex items-start gap-space-md p-space-md transition-colors bg-warm-porcelain hover:bg-raw-linen/40 cursor-pointer" data-category="order" data-status="unread">
<div class="pt-2 shrink-0">
<span class="status-dot block w-2 h-2 rounded-full bg-lacquer-red"></span>
</div>
<div class="w-10 h-10 rounded-lg bg-lacquer-wash text-lacquer-red flex items-center justify-center shrink-0 border border-outline-variant/30">
<span class="material-symbols-outlined text-[22px]">local_shipping</span>
</div>
<div class="flex-1 min-w-0 flex flex-col gap-1">
<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
<span class="font-body-sm font-semibold text-ink group-hover:text-lacquer-red transition-colors">
                  Đơn hàng <span class="font-label-code text-lacquer-red">#SN-24817</span> đang được giao đến bạn
                </span>
<span class="font-label-code text-[12px] text-ink-muted shrink-0">15 phút trước · 14:15</span>
</div>
<p class="font-body-sm text-ink-muted line-clamp-2">
                Bưu tá Nguyễn Văn Hùng (VNPost) đang trên đường giao kiện hàng Laptop ASUS Vivobook 14. Vui lòng chuẩn bị nhận hàng.
              </p>
</div>
<div class="shrink-0 self-center hidden sm:flex items-center pl-space-sm">
<span class="font-body-sm text-[13px] font-semibold text-lacquer-red group-hover:translate-x-1 transition-transform inline-flex items-center">
                Theo dõi đơn hàng →
              </span>
</div>
</div>
<!-- Row 2: Shop & Chat (Unread) -->
<div class="notification-row group flex items-start gap-space-md p-space-md transition-colors bg-warm-porcelain hover:bg-raw-linen/40 cursor-pointer" data-category="shop" data-status="unread">
<div class="pt-2 shrink-0">
<span class="status-dot block w-2 h-2 rounded-full bg-lacquer-red"></span>
</div>
<div class="w-10 h-10 rounded-lg bg-raw-linen text-turmeric flex items-center justify-center shrink-0 border border-border">
<span class="material-symbols-outlined text-[22px]">forum</span>
</div>
<div class="flex-1 min-w-0 flex flex-col gap-1">
<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
<span class="font-body-sm font-semibold text-ink group-hover:text-lacquer-red transition-colors">
                  Shop TechNest Official vừa trả lời tin nhắn của bạn
                </span>
<span class="font-label-code text-[12px] text-ink-muted shrink-0">1 giờ trước · 13:30</span>
</div>
<p class="font-body-sm text-ink-muted line-clamp-2">
                “Dạ chào bạn Thu Hà, sản phẩm laptop đã được dán sẵn tem bảo hành 24 tháng chính hãng ASUS...”
              </p>
</div>
<div class="shrink-0 self-center hidden sm:flex items-center pl-space-sm">
<span class="font-body-sm text-[13px] font-semibold text-lacquer-red group-hover:translate-x-1 transition-transform inline-flex items-center">
                Mở cuộc trò chuyện →
              </span>
</div>
</div>
<!-- Row 3: Khuyến mãi (Unread) -->
<div class="notification-row group flex items-start gap-space-md p-space-md transition-colors bg-warm-porcelain hover:bg-raw-linen/40 cursor-pointer" data-category="promo" data-status="unread">
<div class="pt-2 shrink-0">
<span class="status-dot block w-2 h-2 rounded-full bg-lacquer-red"></span>
</div>
<div class="w-10 h-10 rounded-lg bg-lacquer-wash text-lacquer-red flex items-center justify-center shrink-0 border border-outline-variant/30">
<span class="material-symbols-outlined text-[22px]">sell</span>
</div>
<div class="flex-1 min-w-0 flex flex-col gap-1">
<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
<span class="font-body-sm font-semibold text-ink group-hover:text-lacquer-red transition-colors">
                  Ưu đãi độc quyền: Giảm 12% danh mục Thiết bị số &amp; Phụ kiện
                </span>
<span class="font-label-code text-[12px] text-ink-muted shrink-0">3 giờ trước · 11:00</span>
</div>
<p class="font-body-sm text-ink-muted line-clamp-2">
                Voucher <span class="font-label-code font-semibold text-lacquer-red">NEPTECH12</span> đã được thêm vào Kho voucher Nếp của bạn. Áp dụng cho đơn từ 2.000.000 ₫ đến hết 15/11.
              </p>
</div>
<div class="shrink-0 self-center hidden sm:flex items-center pl-space-sm">
<span class="font-body-sm text-[13px] font-semibold text-lacquer-red group-hover:translate-x-1 transition-transform inline-flex items-center">
                Lưu &amp; Dùng ngay →
              </span>
</div>
</div>
<!-- Row 4: Đơn hàng (Read) -->
<div class="notification-row group flex items-start gap-space-md p-space-md transition-colors bg-rice-paper hover:bg-warm-porcelain cursor-pointer" data-category="order" data-status="read">
<div class="pt-2 shrink-0">
<span class="status-dot block w-2 h-2 rounded-full bg-ink-faint/30"></span>
</div>
<div class="w-10 h-10 rounded-lg bg-surface-container text-ink-muted flex items-center justify-center shrink-0 border border-border">
<span class="material-symbols-outlined text-[22px]">task_alt</span>
</div>
<div class="flex-1 min-w-0 flex flex-col gap-1">
<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
<span class="font-body-sm font-normal text-ink group-hover:text-lacquer-red transition-colors">
                  Đơn hàng <span class="font-label-code text-ink">#SN-24802</span> giao thành công
                </span>
<span class="font-label-code text-[12px] text-ink-muted shrink-0">09/11/2026 · 16:45</span>
</div>
<p class="font-body-sm text-ink-muted line-clamp-2">
                Kiện hàng Tã bỉm quần hữu cơ sợi tre An Nhiên size L đã được giao an toàn tại Tràng Tiền, Hoàn Kiếm.
              </p>
</div>
<div class="shrink-0 self-center hidden sm:flex items-center pl-space-sm">
<span class="font-body-sm text-[13px] font-medium text-ink-muted group-hover:text-lacquer-red group-hover:translate-x-1 transition-all inline-flex items-center">
                Đánh giá sản phẩm →
              </span>
</div>
</div>
<!-- Row 5: Khuyến mãi (Read) -->
<div class="notification-row group flex items-start gap-space-md p-space-md transition-colors bg-rice-paper hover:bg-warm-porcelain cursor-pointer" data-category="promo" data-status="read">
<div class="pt-2 shrink-0">
<span class="status-dot block w-2 h-2 rounded-full bg-ink-faint/30"></span>
</div>
<div class="w-10 h-10 rounded-lg bg-surface-container text-ink-muted flex items-center justify-center shrink-0 border border-border">
<span class="material-symbols-outlined text-[22px]">palette</span>
</div>
<div class="flex-1 min-w-0 flex flex-col gap-1">
<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
<span class="font-body-sm font-normal text-ink group-hover:text-lacquer-red transition-colors">
                  Xưởng Gốm Bát Tràng An Nhiên mở đợt men rạn ngọc mới
                </span>
<span class="font-label-code text-[12px] text-ink-muted shrink-0">07/11/2026 · 09:15</span>
</div>
<p class="font-body-sm text-ink-muted line-clamp-2">
                Bộ sưu tập bát gốm nung củi truyền thống đã lên kệ với số lượng giới hạn 50 bộ nung mẻ thủ công.
              </p>
</div>
<div class="shrink-0 self-center hidden sm:flex items-center pl-space-sm">
<span class="font-body-sm text-[13px] font-medium text-ink-muted group-hover:text-lacquer-red group-hover:translate-x-1 transition-all inline-flex items-center">
                Xem bộ sưu tập →
              </span>
</div>
</div>
<!-- Row 6: Hệ thống (Read) -->
<div class="notification-row group flex items-start gap-space-md p-space-md transition-colors bg-rice-paper hover:bg-warm-porcelain cursor-pointer" data-category="system" data-status="read">
<div class="pt-2 shrink-0">
<span class="status-dot block w-2 h-2 rounded-full bg-ink-faint/30"></span>
</div>
<div class="w-10 h-10 rounded-lg bg-surface-container text-jade flex items-center justify-center shrink-0 border border-border">
<span class="material-symbols-outlined text-[22px]">verified_user</span>
</div>
<div class="flex-1 min-w-0 flex flex-col gap-1">
<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
<span class="font-body-sm font-normal text-ink group-hover:text-lacquer-red transition-colors">
                  Cập nhật chính sách Bảo hộ người mua Nếp Care 15 ngày
                </span>
<span class="font-label-code text-[12px] text-ink-muted shrink-0">05/11/2026 · 10:00</span>
</div>
<p class="font-body-sm text-ink-muted line-clamp-2">
                ShopNest nâng cấp quy trình đồng kiểm và hoàn tiền tự động trong 24h đối với tài khoản thành viên Nếp Vàng.
              </p>
</div>
<div class="shrink-0 self-center hidden sm:flex items-center pl-space-sm">
<span class="font-body-sm text-[13px] font-medium text-ink-muted group-hover:text-lacquer-red group-hover:translate-x-1 transition-all inline-flex items-center">
                Xem điều khoản →
              </span>
</div>
</div>
<!-- Row 7: Hệ thống (Read) -->
<div class="notification-row group flex items-start gap-space-md p-space-md transition-colors bg-rice-paper hover:bg-warm-porcelain cursor-pointer" data-category="system" data-status="read">
<div class="pt-2 shrink-0">
<span class="status-dot block w-2 h-2 rounded-full bg-ink-faint/30"></span>
</div>
<div class="w-10 h-10 rounded-lg bg-surface-container text-ink-muted flex items-center justify-center shrink-0 border border-border">
<span class="material-symbols-outlined text-[22px]">devices</span>
</div>
<div class="flex-1 min-w-0 flex flex-col gap-1">
<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
<span class="font-body-sm font-normal text-ink group-hover:text-lacquer-red transition-colors">
                  Đăng nhập thành công từ thiết bị mới
                </span>
<span class="font-label-code text-[12px] text-ink-muted shrink-0">03/11/2026 · 20:15</span>
</div>
<p class="font-body-sm text-ink-muted line-clamp-2">
                Tài khoản của bạn vừa đăng nhập từ Safari MacOS tại Hà Nội. Nếu không phải bạn, hãy đổi mật khẩu ngay để bảo vệ tài khoản.
              </p>
</div>
<div class="shrink-0 self-center hidden sm:flex items-center pl-space-sm">
<span class="font-body-sm text-[13px] font-medium text-ink-muted group-hover:text-lacquer-red group-hover:translate-x-1 transition-all inline-flex items-center">
                Kiểm tra bảo mật →
              </span>
</div>
</div>
<!-- Row 8: Đơn hàng (Read) -->
<div class="notification-row group flex items-start gap-space-md p-space-md transition-colors bg-rice-paper hover:bg-warm-porcelain cursor-pointer" data-category="order" data-status="read">
<div class="pt-2 shrink-0">
<span class="status-dot block w-2 h-2 rounded-full bg-ink-faint/30"></span>
</div>
<div class="w-10 h-10 rounded-lg bg-surface-container text-ink-muted flex items-center justify-center shrink-0 border border-border">
<span class="material-symbols-outlined text-[22px]">currency_exchange</span>
</div>
<div class="flex-1 min-w-0 flex flex-col gap-1">
<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
<span class="font-body-sm font-normal text-ink group-hover:text-lacquer-red transition-colors">
                  Xác nhận hoàn tiền đơn hàng <span class="font-label-code text-ink">#SN-24690</span>
</span>
<span class="font-label-code text-[12px] text-ink-muted shrink-0">22/10/2026 · 14:00</span>
</div>
<p class="font-body-sm text-ink-muted line-clamp-2">
                Số tiền <span class="font-label-code font-semibold text-ink">580.000 ₫</span> đã được hoàn về thẻ Visa quốc tế liên kết theo yêu cầu của bạn.
              </p>
</div>
<div class="shrink-0 self-center hidden sm:flex items-center pl-space-sm">
<span class="font-body-sm text-[13px] font-medium text-ink-muted group-hover:text-lacquer-red group-hover:translate-x-1 transition-all inline-flex items-center">
                Chi tiết hoàn tiền →
              </span>
</div>
</div>
</div>
<!-- Skeleton Loading Simulation (Hidden by default) -->
<div class="hidden divide-y divide-border flex-col p-0 bg-rice-paper" id="skeleton-loader">
<div class="p-space-md flex items-start gap-space-md animate-pulse">
<div class="w-2 h-2 rounded-full bg-raw-linen mt-2 shrink-0"></div>
<div class="w-10 h-10 rounded-lg bg-raw-linen shrink-0"></div>
<div class="flex-1 flex flex-col gap-2">
<div class="h-4 bg-raw-linen rounded w-2/5"></div>
<div class="h-3 bg-raw-linen rounded w-4/5"></div>
</div>
<div class="w-24 h-4 bg-raw-linen rounded shrink-0"></div>
</div>
<div class="p-space-md flex items-start gap-space-md animate-pulse">
<div class="w-2 h-2 rounded-full bg-raw-linen mt-2 shrink-0"></div>
<div class="w-10 h-10 rounded-lg bg-raw-linen shrink-0"></div>
<div class="flex-1 flex flex-col gap-2">
<div class="h-4 bg-raw-linen rounded w-1/3"></div>
<div class="h-3 bg-raw-linen rounded w-3/4"></div>
</div>
<div class="w-20 h-4 bg-raw-linen rounded shrink-0"></div>
</div>
<div class="p-space-md flex items-start gap-space-md animate-pulse">
<div class="w-2 h-2 rounded-full bg-raw-linen mt-2 shrink-0"></div>
<div class="w-10 h-10 rounded-lg bg-raw-linen shrink-0"></div>
<div class="flex-1 flex flex-col gap-2">
<div class="h-4 bg-raw-linen rounded w-1/2"></div>
<div class="h-3 bg-raw-linen rounded w-5/6"></div>
</div>
<div class="w-28 h-4 bg-raw-linen rounded shrink-0"></div>
</div>
</div>
<!-- Empty State (Hidden by default) -->
<div class="hidden flex-col items-center justify-center p-space-xl py-16 text-center bg-warm-porcelain" id="empty-state">
<div class="w-16 h-16 rounded-full bg-rice-paper border border-border flex items-center justify-center text-ink-muted mb-space-md">
<span class="material-symbols-outlined text-[32px] text-ink-muted">notifications_off</span>
</div>
<h3 class="font-headline-3 text-headline-3 text-ink font-semibold mb-1">Chưa có thông báo mới</h3>
<p class="font-body-sm text-ink-muted max-w-md mb-space-lg leading-relaxed">
            Những cập nhật quan trọng về đơn hàng, tin nhắn từ xưởng và khuyến mãi Nếp sẽ xuất hiện tại đây khi phát sinh giao dịch.
          </p>
<a class="px-5 py-2.5 rounded-lg bg-lacquer-red hover:bg-lacquer-deep text-warm-porcelain font-body-sm font-semibold transition-all shadow-[0_1px_4px_rgba(178,58,47,0.2)]" href="#">
            Khám phá chợ hôm nay
          </a>
</div>
</div>
<!-- Pagination / Footer of Stream -->
<div class="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs text-ink-muted font-body-sm text-[13px]" id="stream-footer">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[16px] text-ink-faint">info</span>
<span>Hiển thị <span class="font-label-code font-semibold text-ink" id="visible-count">8</span> thông báo gần nhất</span>
</div>
<button class="px-3 py-1.5 rounded border border-border hover:border-ink hover:text-ink transition-colors font-body-sm text-[13px] bg-warm-porcelain" id="btn-load-more">
          Tải thêm thông báo cũ hơn
        </button>
</div>
</div>
<!-- RIGHT 4 COLUMNS: Sticky Notification Preferences Rail -->
<div class="col-span-12 xl:col-span-4 flex flex-col gap-space-lg xl:sticky xl:top-24">
<!-- Preferences Card -->
<div class="bg-warm-porcelain border border-border rounded-2xl p-space-lg flex flex-col gap-space-lg shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
<!-- Header -->
<div class="flex items-center justify-between pb-space-sm border-b border-border">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-lacquer-red text-[20px]">notifications_active</span>
<h2 class="font-body-sm font-semibold text-ink text-[16px]">Kênh nhận thông báo</h2>
</div>
<span class="font-label-micro text-ink-muted uppercase">Tùy biến</span>
</div>
<!-- Toggles List -->
<div class="flex flex-col divide-y divide-border">
<!-- Toggle 1: Vận chuyển & đơn hàng -->
<div class="py-space-md flex items-start justify-between gap-space-md first:pt-0">
<div class="flex flex-col gap-0.5">
<span class="font-body-sm font-semibold text-ink text-[14px]">Cập nhật vận chuyển &amp; đơn mua</span>
<span class="font-body-sm text-ink-muted text-[12px] leading-snug">Nhận tin SMS &amp; thông báo ứng dụng khi kiện hàng đổi trạng thái</span>
</div>
<label class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-raw-linen peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lacquer-red"></div>
</label>
</div>
<!-- Toggle 2: Chat & Người bán -->
<div class="py-space-md flex items-start justify-between gap-space-md">
<div class="flex flex-col gap-0.5">
<span class="font-body-sm font-semibold text-ink text-[14px]">Tin nhắn trực tiếp từ người bán</span>
<span class="font-body-sm text-ink-muted text-[12px] leading-snug">Thông báo tức thì khi xưởng thủ công hoặc gian hàng đối tác phản hồi</span>
</div>
<label class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-raw-linen peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lacquer-red"></div>
</label>
</div>
<!-- Toggle 3: Ưu đãi Voucher -->
<div class="py-space-md flex items-start justify-between gap-space-md">
<div class="flex flex-col gap-0.5">
<span class="font-body-sm font-semibold text-ink text-[14px]">Ưu đãi &amp; Voucher Nếp độc quyền</span>
<span class="font-body-sm text-ink-muted text-[12px] leading-snug">Gợi ý mã giảm giá chọn lọc theo phong cách tiêu dùng của bạn</span>
</div>
<label class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-raw-linen peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lacquer-red"></div>
</label>
</div>
<!-- Toggle 4: Bản tin văn hoá -->
<div class="py-space-md flex items-start justify-between gap-space-md last:pb-0">
<div class="flex flex-col gap-0.5">
<span class="font-body-sm font-semibold text-ink text-[14px]">Bản tin văn hoá Nếp sống</span>
<span class="font-body-sm text-ink-muted text-[12px] leading-snug">Câu chuyện làng nghề và phong cách sống tuyển chọn gửi mỗi tuần</span>
</div>
<label class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
<input class="sr-only peer" type="checkbox"/>
<div class="w-11 h-6 bg-raw-linen peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lacquer-red"></div>
</label>
</div>
</div>
<!-- Verified Contacts Box -->
<div class="p-space-md bg-rice-paper rounded-xl border border-border flex flex-col gap-space-sm">
<div class="flex items-center justify-between">
<span class="font-label-micro text-ink-muted uppercase tracking-wider font-semibold">PHƯƠNG THỨC ĐÃ XÁC THỰC</span>
<span class="material-symbols-outlined text-jade text-[18px]">lock</span>
</div>
<div class="flex flex-col gap-2 pt-1">
<!-- Email -->
<div class="flex items-center justify-between text-ink text-[13px]">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[16px] text-ink-muted">mail</span>
<span class="font-label-code">thuha.nguyen@gmail.com</span>
</div>
<span class="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container text-jade font-label-micro text-[10px] font-semibold">
                ĐÃ XÁC THỰC
              </span>
</div>
<!-- Phone -->
<div class="flex items-center justify-between text-ink text-[13px]">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[16px] text-ink-muted">smartphone</span>
<span class="font-label-code">0912 345 678</span>
</div>
<span class="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container text-jade font-label-micro text-[10px] font-semibold">
                ĐÃ LIÊN KẾT
              </span>
</div>
</div>
</div>
<!-- Security Note -->
<div class="flex items-start gap-2.5 p-space-sm rounded-lg bg-surface-container-high/50 text-ink-muted font-body-sm text-[12px] leading-relaxed">
<span class="material-symbols-outlined text-turmeric text-[18px] shrink-0 mt-0.5">shield</span>
<span>
            Mọi thông báo quan trọng về bảo mật và biến động giao dịch tài chính luôn được gửi bắt buộc qua email và SMS được chứng thực.
          </span>
</div>
</div>
<!-- Quick Tips / Support Box -->
<div class="p-space-md rounded-xl bg-warm-porcelain border border-border flex items-center justify-between">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-ink-muted text-[20px]">help_center</span>
<span class="font-body-sm text-[13px] text-ink">Bạn không nhận được thông báo?</span>
</div>
<a class="font-body-sm text-[13px] text-lacquer-red hover:underline font-semibold" href="#">Kiểm tra ngay</a>
</div>
</div>
</div>
<!-- Interactive Client-side Script for States & Tabs Simulation -->
<script>
    (function() {
      const simDefault = document.getElementById('sim-default');
      const simReadAll = document.getElementById('sim-readall');
      const simOrder = document.getElementById('sim-order');
      const simPromo = document.getElementById('sim-promo');
      const simSkeleton = document.getElementById('sim-skeleton');
      const simEmpty = document.getElementById('sim-empty');

      const simButtons = [simDefault, simReadAll, simOrder, simPromo, simSkeleton, simEmpty];

      const notifList = document.getElementById('notification-list');
      const skeletonLoader = document.getElementById('skeleton-loader');
      const emptyState = document.getElementById('empty-state');
      const streamFooter = document.getElementById('stream-footer');
      const unreadBadge = document.getElementById('unread-counter-badge');
      const visibleCount = document.getElementById('visible-count');
      const actionMarkAll = document.getElementById('action-mark-all');
      const filterTabs = document.querySelectorAll('.filter-tab');

      function setSimActive(activeBtn) {
        simButtons.forEach(btn => {
          if (btn === activeBtn) {
            btn.className = 'sim-btn px-3 py-1.5 rounded-lg border border-lacquer-red bg-lacquer-wash text-lacquer-red font-body-sm text-[13px] font-semibold transition-all';
          } else {
            btn.className = 'sim-btn px-3 py-1.5 rounded-lg border border-border bg-rice-paper text-ink hover:bg-warm-porcelain font-body-sm text-[13px] transition-all';
          }
        });
      }

      function setFilterTabActive(category) {
        filterTabs.forEach(tab => {
          const cat = tab.getAttribute('data-filter');
          if (cat === category) {
            tab.className = 'filter-tab px-4 py-2 rounded-lg bg-lacquer-red text-warm-porcelain font-body-sm text-body-sm font-semibold transition-all';
          } else {
            tab.className = 'filter-tab px-4 py-2 rounded-lg bg-warm-porcelain border border-border text-ink-muted hover:text-ink hover:border-ink-muted font-body-sm text-body-sm transition-all';
          }
        });
      }

      function showContent() {
        notifList.classList.remove('hidden');
        skeletonLoader.classList.add('hidden');
        emptyState.classList.add('hidden');
        streamFooter.classList.remove('hidden');
      }

      function filterCategory(cat) {
        showContent();
        setFilterTabActive(cat);
        const rows = notifList.querySelectorAll('.notification-row');
        let count = 0;
        rows.forEach(row => {
          const rowCat = row.getAttribute('data-category');
          if (cat === 'all' || rowCat === cat) {
            row.style.display = 'flex';
            count++;
          } else {
            row.style.display = 'none';
          }
        });
        visibleCount.textContent = count;
      }

      function markAllAsRead() {
        const rows = notifList.querySelectorAll('.notification-row');
        rows.forEach(row => {
          row.setAttribute('data-status', 'read');
          row.classList.remove('bg-warm-porcelain');
          row.classList.add('bg-rice-paper');
          const dot = row.querySelector('.status-dot');
          if (dot) {
            dot.className = 'status-dot block w-2 h-2 rounded-full bg-ink-faint/30';
          }
          const title = row.querySelector('.font-semibold');
          if (title && !title.classList.contains('text-lacquer-red')) {
            title.classList.remove('font-semibold');
            title.classList.add('font-normal');
          }
        });
        unreadBadge.textContent = '0 chưa đọc';
        unreadBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container text-ink-muted font-body-sm text-[13px] border border-border';
      }

      function restoreDefaultUnread() {
        const rows = notifList.querySelectorAll('.notification-row');
        // Rows 1, 2, 3 were unread originally
        rows.forEach((row, idx) => {
          if (idx < 3) {
            row.setAttribute('data-status', 'unread');
            row.classList.remove('bg-rice-paper');
            row.classList.add('bg-warm-porcelain');
            const dot = row.querySelector('.status-dot');
            if (dot) {
              dot.className = 'status-dot block w-2 h-2 rounded-full bg-lacquer-red';
            }
          }
        });
        unreadBadge.textContent = '3 chưa đọc';
        unreadBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full bg-lacquer-wash text-lacquer-red font-body-sm text-[13px] font-semibold border border-outline-variant/40';
      }

      // Event Listeners for Sim Controls
      simDefault.addEventListener('click', () => {
        setSimActive(simDefault);
        restoreDefaultUnread();
        filterCategory('all');
      });

      simReadAll.addEventListener('click', () => {
        setSimActive(simReadAll);
        markAllAsRead();
        filterCategory('all');
      });

      simOrder.addEventListener('click', () => {
        setSimActive(simOrder);
        filterCategory('order');
      });

      simPromo.addEventListener('click', () => {
        setSimActive(simPromo);
        filterCategory('promo');
      });

      simSkeleton.addEventListener('click', () => {
        setSimActive(simSkeleton);
        notifList.classList.add('hidden');
        emptyState.classList.add('hidden');
        skeletonLoader.classList.remove('hidden');
        skeletonLoader.classList.add('flex');
        streamFooter.classList.add('hidden');
      });

      simEmpty.addEventListener('click', () => {
        setSimActive(simEmpty);
        notifList.classList.add('hidden');
        skeletonLoader.classList.add('hidden');
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
        streamFooter.classList.add('hidden');
        unreadBadge.textContent = '0 chưa đọc';
      });

      // Filter Tab Click Handlers
      filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const filter = tab.getAttribute('data-filter');
          filterCategory(filter);
        });
      });

      // Quick action "Đánh dấu tất cả đã đọc"
      actionMarkAll.addEventListener('click', () => {
        markAllAsRead();
      });

      // Click row to toggle read
      notifList.addEventListener('click', (e) => {
        const row = e.target.closest('.notification-row');
        if (!row) return;
        if (row.getAttribute('data-status') === 'unread') {
          row.setAttribute('data-status', 'read');
          row.classList.remove('bg-warm-porcelain');
          row.classList.add('bg-rice-paper');
          const dot = row.querySelector('.status-dot');
          if (dot) dot.className = 'status-dot block w-2 h-2 rounded-full bg-ink-faint/30';
          
          // Re-calculate unread count
          const unreadRows = notifList.querySelectorAll('.notification-row[data-status="unread"]').length;
          unreadBadge.textContent = unreadRows + ' chưa đọc';
          if (unreadRows === 0) {
            unreadBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container text-ink-muted font-body-sm text-[13px] border border-border';
          }
        }
      });
    })();
  </script>
</div></main><footer class="w-full bg-warm-porcelain border-t border-border py-space-md px-gutter"><div class="flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-micro text-label-micro text-ink-muted"><div class="flex items-center gap-space-md"><span class="font-semibold text-ink uppercase tracking-wider">ShopNest Việt Nam</span><span>© 2024 Nếp Sống Thủ Công. Bảo lưu mọi quyền.</span></div><div class="flex items-center gap-space-lg"><a class="hover:text-lacquer-red transition-colors" href="#">Quy chế hoạt động</a><a class="hover:text-lacquer-red transition-colors" href="#">Chính sách bảo mật</a><a class="hover:text-lacquer-red transition-colors" href="#">Tiêu chuẩn nghệ nhân Nếp</a><a class="hover:text-lacquer-red transition-colors" href="#">Liên hệ giải quyết khiếu nại</a></div></div></footer></div></div></body></html>
```
### C08 — Chat and chatbot
```html
<!DOCTYPE html>

<html lang="vi"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_standard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,wght@0,600;1,600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100..900&family=JetBrains+Mono:wght@100..900&family=Newsreader:wght@100..900&display=swap" rel="stylesheet"/><style>@layer base{html,body{margin:0;padding:0;}body{overscroll-behavior:none;}main>:first-child{margin-top:0!important;}main>:last-child{margin-bottom:0!important;}}::-webkit-scrollbar{display:none;}</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config={darkMode:"class",theme:{extend:{colors:{"tertiary-fixed-dim":"#cec6b5","logo-blue":"#4991D8","on-secondary-fixed-variant":"#494641","inverse-primary":"#ffb4aa","ink-faint":"#9A8F7F","on-secondary-container":"#67645f","on-tertiary-container":"#e9e0cf","brick":"#8B2A24","on-primary":"#ffffff","surface-container-lowest":"#ffffff","on-error-container":"#93000a","on-surface-variant":"#58413e","raw-linen":"#EDE4D3","on-error":"#ffffff","secondary":"#615e59","surface-dim":"#dedacf","turmeric":"#8A5A1A","outline-variant":"#dfbfbb","on-primary-fixed-variant":"#891c16","tertiary":"#514b3f","lacquer-red":"#B23A2F","surface-variant":"#e7e2d7","on-tertiary-fixed-variant":"#4b463a","ink-muted":"#6B6458","warm-porcelain":"#FFFCF4","on-secondary":"#ffffff","primary-fixed-dim":"#ffb4aa","secondary-fixed-dim":"#cbc6bf","on-tertiary":"#ffffff","on-secondary-fixed":"#1d1b17","surface-container-highest":"#e7e2d7","surface-container":"#f2ede2","on-background":"#1d1c15","on-primary-container":"#ffd9d3","tertiary-fixed":"#eae2d1","inverse-on-surface":"#f5f0e5","on-primary-fixed":"#410001","rice-paper":"#F6F1E6","background":"#fef9ee","secondary-container":"#e8e2db","surface-tint":"#aa342a","lacquer-wash":"#F2DCD5","tertiary-container":"#696356","surface":"#fef9ee","primary":"#91221a","error-container":"#ffdad6","ink":"#1D1B17","lacquer-deep":"#8C2A22","error":"#ba1a1a","surface-container-low":"#f8f3e8","surface-container-high":"#ede8dd","primary-fixed":"#ffdad5","jade":"#2F6B57","on-tertiary-fixed":"#1f1b11","secondary-fixed":"#e8e2db","outline":"#8c716d","primary-container":"#b23a2f","on-surface":"#1d1c15","surface-bright":"#fef9ee","inverse-surface":"#323029","border":"#DCD1BE"},borderRadius:{DEFAULT:"0.25rem",lg:"0.5rem",xl:"0.75rem",full:"9999px"},spacing:{"space-md":"1rem","margin-mobile":"1.25rem","space-lg":"1.5rem","space-sm":"0.5rem","space-xs":"0.25rem",margin:"3rem","gutter-mobile":"1rem",gutter:"1.5rem","space-xl":"2.5rem"},fontFamily:{"headline-2":["Newsreader"],"label-code":["JetBrains Mono"],"display-xl":["Newsreader"],"label-micro":["Be Vietnam Pro"],"body-md":["Be Vietnam Pro"],"display-xl-mobile":["Newsreader"],"body-sm":["Be Vietnam Pro"],"headline-1":["Newsreader"],"display-lg":["Newsreader"],"headline-3":["Be Vietnam Pro"],"display-lg-mobile":["Newsreader"],"body-lg":["Be Vietnam Pro"]},fontSize:{"headline-2":["28px",{lineHeight:"32px",letterSpacing:"-0.02em",fontWeight:"600"}],"label-code":["14px",{lineHeight:"20px",fontWeight:"500"}],"display-xl":["64px",{lineHeight:"60px",letterSpacing:"-0.035em",fontWeight:"600"}],"label-micro":["12px",{lineHeight:"16px",letterSpacing:"0.12em",fontWeight:"600"}],"body-md":["16px",{lineHeight:"26px",fontWeight:"400"}],"display-xl-mobile":["40px",{lineHeight:"40px",letterSpacing:"-0.03em",fontWeight:"600"}],"body-sm":["14px",{lineHeight:"21px",fontWeight:"400"}],"headline-1":["36px",{lineHeight:"40px",letterSpacing:"-0.025em",fontWeight:"600"}],"display-lg":["48px",{lineHeight:"48px",letterSpacing:"-0.03em",fontWeight:"600"}],"headline-3":["18px",{lineHeight:"24px",letterSpacing:"-0.01em",fontWeight:"600"}],"display-lg-mobile":["32px",{lineHeight:"34px",letterSpacing:"-0.025em",fontWeight:"600"}],"body-lg":["18px",{lineHeight:"28px",fontWeight:"400"}]}}}};</script></head><body class="bg-rice-paper text-ink font-body-md"><header class="fixed top-0 left-0 right-0 z-50 bg-warm-porcelain/95 backdrop-blur-md border-b border-border shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div class="h-20 w-full px-gutter flex items-center justify-between gap-gutter"><div class="flex items-center gap-space-lg flex-shrink-0"><div class="flex items-center gap-space-sm"><img alt="ShopnestLogo.png" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO6BdYQOctxtRrm2XPo2BUVk7h4W_PwQ0-XrrFRNDsGbQsw0P7cI7v5D97VvWpOwT1Kj-n4do7PHMdmiRTO50-xVva2O62JzprzmGrMpOXq69e29WNwK_p-RuwnxbCkqIH3W_6qArjO4Qu95FlcK9xfc7WS79tZGfkj9gWmkG6_o2zovFRNujOsGRXF3_qFAfVzGVt4E9rtLXfi2amHX4oFO59AJV1zeZxSlZG5g"/><span class="font-headline-3 text-headline-3 text-lacquer-red tracking-tight">ShopNest</span></div><div class="relative w-80 hidden lg:block"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint text-[20px]">search</span><input class="w-full h-11 pl-10 pr-4 bg-rice-paper text-ink font-body-sm text-body-sm rounded-lg border border-border placeholder:text-ink-faint focus:outline-none focus:border-lacquer-red focus:ring-1 focus:ring-lacquer-red transition-all" placeholder="Tìm kiếm sản phẩm..." type="text"/></div></div><nav class="hidden xl:flex items-center gap-space-lg h-full" data-active-classes="text-lacquer-red font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-lacquer-red"><a class="relative h-full flex items-center font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="trang-chu" href="#">Trang chủ</a><a class="relative h-full flex items-center font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="danh-muc" href="#">Danh mục</a><a class="relative h-full flex items-center font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="khuyen-mai" href="#">Khuyến mãi</a><a class="relative h-full flex items-center font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="shop-viet" href="#">Shop Việt</a><a class="relative h-full flex items-center font-body-sm text-body-sm text-on-surface-variant hover:text-lacquer-red transition-colors" data-path="don-hang" href="#">Đơn hàng</a><a aria-current="page" class="relative h-full flex items-center transition-colors text-lacquer-red font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-lacquer-red" data-path="tro-chuyen-ho-tro" href="#">Tin nhắn hỗ trợ</a></nav><div class="flex items-center gap-space-md flex-shrink-0"><div class="flex items-center gap-space-sm pl-space-md border-l border-border"><div class="flex flex-col text-right"><span class="font-body-sm text-body-sm font-semibold text-ink leading-tight">Nguyễn Thu Hà</span><span class="font-label-micro text-label-micro text-turmeric uppercase tracking-wider font-semibold">THÀNH VIÊN NẾP VÀNG</span></div><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></div></header><main class="w-full pt-20 bg-rice-paper min-h-[calc(100vh-5rem)]"><div class="flex flex-col w-full">
<!-- Interactive State Simulation Controller Bar -->
<div class="w-full bg-warm-porcelain border-b border-border py-2 px-gutter flex items-center justify-between text-body-sm select-none">
<div class="flex items-center gap-space-sm overflow-x-auto">
<span class="font-label-micro text-ink-muted uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
<span class="material-symbols-outlined text-[16px] text-turmeric">tune</span>
        Kịch bản mẫu:
      </span>
<button class="state-pill px-3 py-1 rounded-full text-body-sm font-medium transition-all bg-lacquer-red text-warm-porcelain" id="state-btn-default" onclick="switchChatState('default')">
        Mặc định (Shop TechNest)
      </button>
<button class="state-pill px-3 py-1 rounded-full text-body-sm font-medium transition-all bg-raw-linen text-ink hover:bg-lacquer-wash" id="state-btn-bot" onclick="switchChatState('bot')">
        Hội thoại Trợ lý ShopNest
      </button>
<button class="state-pill px-3 py-1 rounded-full text-body-sm font-medium transition-all bg-raw-linen text-ink hover:bg-lacquer-wash" id="state-btn-typing" onclick="switchChatState('typing')">
        Đang nhập liệu (Typing)
      </button>
<button class="state-pill px-3 py-1 rounded-full text-body-sm font-medium transition-all bg-raw-linen text-ink hover:bg-lacquer-wash" id="state-btn-error" onclick="switchChatState('error')">
        Lỗi gửi tin (Failed)
      </button>
<button class="state-pill px-3 py-1 rounded-full text-body-sm font-medium transition-all bg-raw-linen text-ink hover:bg-lacquer-wash" id="state-btn-empty" onclick="switchChatState('empty')">
        Hộp thư rỗng (Empty)
      </button>
</div>
<div class="hidden md:flex items-center gap-2 text-ink-faint font-label-code text-body-sm">
<span class="inline-block w-2 h-2 rounded-full bg-jade"></span>
      Hệ thống tin nhắn tức thời Nếp Sync
    </div>
</div>
<!-- Main 3-Pane Workspace Container -->
<div class="w-full max-w-[1440px] mx-auto p-4 lg:p-6" style="height: calc(100vh - 128px); min-height: 680px;">
<div class="w-full h-full bg-warm-porcelain rounded-xl border border-border flex overflow-hidden shadow-sm">
<!-- ================= PANE 1: CONVERSATION LIST (320px) ================= -->
<aside class="w-80 flex-shrink-0 border-r border-border flex flex-col bg-warm-porcelain h-full">
<!-- Search & Filter Area -->
<div class="p-3 border-b border-border bg-rice-paper/50 flex flex-col gap-2">
<div class="relative w-full">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint text-[18px]">search</span>
<input class="w-full h-9 pl-9 pr-3 bg-warm-porcelain text-ink font-body-sm text-body-sm rounded-lg border border-border placeholder:text-ink-faint focus:outline-none focus:border-lacquer-red focus:ring-1 focus:ring-lacquer-red transition-all" placeholder="Tìm cuộc trò chuyện..." type="text"/>
</div>
<div class="flex items-center gap-1 overflow-x-auto text-[13px] text-ink-muted">
<button class="px-2.5 py-1 rounded-md bg-lacquer-wash text-lacquer-red font-medium">Tất cả</button>
<button class="px-2.5 py-1 rounded-md hover:bg-raw-linen transition-colors">Chưa đọc (2)</button>
<button class="px-2.5 py-1 rounded-md hover:bg-raw-linen transition-colors">Người bán</button>
<button class="px-2.5 py-1 rounded-md hover:bg-raw-linen transition-colors">Trợ lý</button>
</div>
</div>
<!-- Conversation Scrollable List -->
<div class="flex-1 overflow-y-auto divide-y divide-border/60">
<!-- Special Row: ShopNest Assistant -->
<div class="p-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-rice-paper/70 bg-rice-paper/30" id="row-assistant" onclick="switchChatState('bot')">
<div class="w-10 h-10 rounded-full bg-lacquer-wash text-lacquer-red border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[20px]">smart_toy</span>
</div>
<div class="flex-1 min-w-0">
<div class="flex items-center justify-between gap-1 mb-0.5">
<span class="font-headline-3 text-[14px] leading-tight text-ink font-semibold truncate">Trợ lý ShopNest</span>
<span class="font-label-code text-[11px] text-ink-faint flex-shrink-0">24/7</span>
</div>
<div class="flex items-center gap-1.5 mb-1">
<span class="font-label-micro text-[10px] px-1.5 py-0.5 bg-turmeric/10 text-turmeric rounded border border-turmeric/30 uppercase tracking-wider font-semibold">AI HỖ TRỢ</span>
</div>
<p class="font-body-sm text-[13px] text-ink-muted truncate">Tra cứu đơn, chính sách đổi trả, voucher...</p>
</div>
<span class="w-2 h-2 rounded-full bg-lacquer-red flex-shrink-0 mt-2"></span>
</div>
<!-- Shop Conversation Rows -->
<!-- Row 1: TechNest (Active by default) -->
<div class="p-3 flex items-start gap-3 cursor-pointer transition-colors border-l-4 border-lacquer-red bg-lacquer-wash/25" id="row-technest" onclick="switchChatState('default')">
<div class="relative w-10 h-10 rounded-full bg-raw-linen flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-lacquer-red border border-border">
              TN
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-jade ring-2 ring-warm-porcelain"></span>
</div>
<div class="flex-1 min-w-0">
<div class="flex items-center justify-between gap-1 mb-0.5">
<div class="flex items-center gap-1.5 truncate">
<span class="font-headline-3 text-[14px] leading-tight text-ink font-semibold truncate">TechNest Official</span>
<span class="font-label-micro text-[9px] px-1 py-0.2 bg-jade/10 text-jade rounded font-semibold uppercase">Shop Việt</span>
</div>
<span class="font-label-code text-[11px] text-ink-muted flex-shrink-0">14:25</span>
</div>
<p class="font-body-sm text-[13px] text-ink truncate">Dạ bưu tá Nguyễn Văn Hùng đã nhận tải phát...</p>
</div>
</div>
<!-- Row 2: Gốm Bát Tràng An Nhiên -->
<div class="p-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-rice-paper/50">
<div class="relative w-10 h-10 rounded-full bg-raw-linen flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-turmeric border border-border">
              GB
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-jade ring-2 ring-warm-porcelain"></span>
</div>
<div class="flex-1 min-w-0">
<div class="flex items-center justify-between gap-1 mb-0.5">
<div class="flex items-center gap-1.5 truncate">
<span class="font-headline-3 text-[14px] leading-tight text-ink font-semibold truncate">Gốm Bát Tràng An Nhiên</span>
<span class="font-label-micro text-[9px] px-1 py-0.2 bg-jade/10 text-jade rounded font-semibold uppercase">Shop Việt</span>
</div>
<span class="font-label-code text-[11px] text-ink-faint flex-shrink-0">11:05</span>
</div>
<p class="font-body-sm text-[13px] text-ink-muted truncate">Dạ bộ 4 bát men rạn của bạn đã được đóng nẹp gỗ...</p>
</div>
</div>
<!-- Row 3: An Nhiên Baby Care -->
<div class="p-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-rice-paper/50">
<div class="relative w-10 h-10 rounded-full bg-raw-linen flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-ink-muted border border-border">
              AB
            </div>
<div class="flex-1 min-w-0">
<div class="flex items-center justify-between gap-1 mb-0.5">
<span class="font-headline-3 text-[14px] leading-tight text-ink font-semibold truncate">An Nhiên Baby Care</span>
<span class="font-label-code text-[11px] text-ink-faint flex-shrink-0">09/11</span>
</div>
<p class="font-body-sm text-[13px] text-ink-muted truncate">Cảm ơn bạn đã đánh giá 5 sao cho tã bỉm sợi tre...</p>
</div>
</div>
<!-- Row 4: Bếp Nhà Mình -->
<div class="p-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-rice-paper/50">
<div class="relative w-10 h-10 rounded-full bg-raw-linen flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-ink-muted border border-border">
              BN
            </div>
<div class="flex-1 min-w-0">
<div class="flex items-center justify-between gap-1 mb-0.5">
<span class="font-headline-3 text-[14px] leading-tight text-ink font-semibold truncate">Bếp Nhà Mình</span>
<span class="font-label-code text-[11px] text-ink-faint flex-shrink-0">05/11</span>
</div>
<p class="font-body-sm text-[13px] text-ink-muted truncate">Nồi chiên không dầu LockAir 7L được bảo hành chính hãng...</p>
</div>
</div>
<!-- Row 5: Mộc Studio -->
<div class="p-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-rice-paper/50">
<div class="relative w-10 h-10 rounded-full bg-raw-linen flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-ink-muted border border-border">
              MS
            </div>
<div class="flex-1 min-w-0">
<div class="flex items-center justify-between gap-1 mb-0.5">
<span class="font-headline-3 text-[14px] leading-tight text-ink font-semibold truncate">Mộc Studio</span>
<span class="font-label-code text-[11px] text-ink-faint flex-shrink-0">28/10</span>
</div>
<p class="font-body-sm text-[13px] text-ink-muted truncate">Xưởng vừa có vải cotton mộc đợt mới, bạn cần đặt...</p>
</div>
</div>
</div>
</aside>
<!-- ================= PANE 2: CENTER CHAT DISPLAY (Flexible) ================= -->
<section class="flex-1 flex flex-col h-full bg-rice-paper/30 relative">
<!-- Center Chat Header -->
<div class="h-16 px-5 border-b border-border bg-warm-porcelain flex items-center justify-between flex-shrink-0" id="chat-header-shop">
<div class="flex items-center gap-3 min-w-0">
<div class="relative w-10 h-10 rounded-full bg-raw-linen flex items-center justify-center flex-shrink-0 text-lacquer-red font-bold border border-border">
              TN
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-jade ring-2 ring-warm-porcelain"></span>
</div>
<div class="min-w-0">
<div class="flex items-center gap-2">
<h2 class="font-headline-3 text-body-md text-ink font-semibold leading-tight truncate">TechNest Official</h2>
<span class="font-label-micro text-[10px] px-1.5 py-0.5 bg-jade/10 text-jade border border-jade/20 rounded font-semibold uppercase">Shop Việt Tuyển Chọn</span>
</div>
<div class="flex items-center gap-1.5 mt-0.5">
<span class="inline-block w-1.5 h-1.5 rounded-full bg-jade"></span>
<span class="font-body-sm text-[12px] text-ink-muted">Đang hoạt động · Phản hồi trung bình trong 5 phút</span>
</div>
</div>
</div>
<!-- Header Utility Actions -->
<div class="flex items-center gap-2">
<button class="h-9 px-3 rounded-lg border border-border bg-warm-porcelain text-ink font-body-sm text-[13px] hover:bg-lacquer-wash hover:text-lacquer-red transition-colors flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px]">storefront</span>
<span class="hidden sm:inline">Xem gian hàng</span>
</button>
<button class="w-9 h-9 rounded-lg border border-border bg-warm-porcelain text-ink-muted hover:text-lacquer-red hover:bg-lacquer-wash flex items-center justify-center transition-colors" title="Báo cáo hoặc Hỗ trợ">
<span class="material-symbols-outlined text-[18px]">flag</span>
</button>
</div>
</div>
<!-- Chat Header for ShopNest Bot State (Hidden by default) -->
<div class="hidden h-16 px-5 border-b border-border bg-warm-porcelain items-center justify-between flex-shrink-0" id="chat-header-bot">
<div class="flex items-center gap-3 min-w-0">
<div class="w-10 h-10 rounded-full bg-lacquer-wash text-lacquer-red flex items-center justify-center flex-shrink-0 border border-border">
<span class="material-symbols-outlined text-[20px]">smart_toy</span>
</div>
<div class="min-w-0">
<div class="flex items-center gap-2">
<h2 class="font-headline-3 text-body-md text-ink font-semibold leading-tight truncate">Trợ lý Nếp AI</h2>
<span class="font-label-micro text-[10px] px-1.5 py-0.5 bg-turmeric/10 text-turmeric border border-turmeric/30 rounded font-semibold uppercase">Tự động hoá 24/7</span>
</div>
<div class="flex items-center gap-1.5 mt-0.5">
<span class="inline-block w-1.5 h-1.5 rounded-full bg-jade"></span>
<span class="font-body-sm text-[12px] text-ink-muted">Sẵn sàng hỗ trợ giải đáp mọi nghiệp vụ mua sắm</span>
</div>
</div>
</div>
<button class="h-9 px-3 rounded-lg border border-border bg-warm-porcelain text-ink font-body-sm text-[13px] hover:bg-lacquer-wash hover:text-lacquer-red transition-colors flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px]">support_agent</span>
<span>Gặp tư vấn viên</span>
</button>
</div>
<!-- Message Body Scroll Container -->
<div class="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-4" id="messages-container">
<!-- State: EMPTY STATE (Hidden) -->
<div class="hidden my-auto flex-col items-center justify-center text-center p-8" id="view-empty">
<div class="w-16 h-16 rounded-full bg-raw-linen flex items-center justify-center text-ink-faint mb-3 border border-border">
<span class="material-symbols-outlined text-[32px]">chat_bubble_outline</span>
</div>
<h3 class="font-headline-3 text-body-lg text-ink font-semibold mb-1">Chưa có tin nhắn trong hộp thư này</h3>
<p class="font-body-sm text-ink-muted max-w-sm mb-4">Bạn có thể chọn một cuộc trò chuyện từ danh sách bên trái hoặc nhắn tin hỏi các đối tác Shop Việt.</p>
<button class="h-10 px-4 rounded-lg bg-lacquer-red text-warm-porcelain font-body-sm font-medium hover:bg-lacquer-deep transition-all" onclick="switchChatState('default')">
              Mở cuộc trò chuyện TechNest
            </button>
</div>
<!-- State: BOT CONVERSATION (Hidden) -->
<div class="hidden flex-col gap-4" id="view-bot-messages">
<div class="flex items-center justify-center my-1">
<span class="font-label-code text-[11px] text-ink-faint bg-raw-linen/60 px-3 py-0.5 rounded-full border border-border">
                Phiên trợ giúp lúc 14:10 · Mã phiên #AI-9921
              </span>
</div>
<!-- Bot Message -->
<div class="flex items-start gap-2.5 max-w-[80%]">
<div class="w-8 h-8 rounded-full bg-lacquer-wash text-lacquer-red flex items-center justify-center flex-shrink-0 mt-0.5 border border-border">
<span class="material-symbols-outlined text-[16px]">smart_toy</span>
</div>
<div class="flex flex-col">
<div class="bg-warm-porcelain border border-border text-ink p-3.5 rounded-2xl rounded-tl-none font-body-sm">
                  Xin chào Thu Hà! Tôi là Trợ lý số của ShopNest. Tôi thấy bạn có đơn hàng <span class="font-label-code font-semibold text-lacquer-red">#SN-24817</span> (Laptop ASUS Vivobook) đang trên đường giao. Bạn cần trợ giúp nội dung nào?
                </div>
<span class="font-label-code text-[11px] text-ink-faint mt-1 ml-1">14:10</span>
</div>
</div>
<!-- Customer Message -->
<div class="flex items-start justify-end gap-2.5 max-w-[80%] self-end">
<div class="flex flex-col items-end">
<div class="bg-lacquer-red text-warm-porcelain p-3.5 rounded-2xl rounded-tr-none font-body-sm">
                  Chính sách đồng kiểm hàng công nghệ khi shipper giao đến được thực hiện ra sao bạn?
                </div>
<span class="font-label-code text-[11px] text-ink-faint mt-1 mr-1">14:12</span>
</div>
</div>
<!-- Bot Message with Accordion Info -->
<div class="flex items-start gap-2.5 max-w-[85%]">
<div class="w-8 h-8 rounded-full bg-lacquer-wash text-lacquer-red flex items-center justify-center flex-shrink-0 mt-0.5 border border-border">
<span class="material-symbols-outlined text-[16px]">smart_toy</span>
</div>
<div class="flex flex-col">
<div class="bg-warm-porcelain border border-border text-ink p-3.5 rounded-2xl rounded-tl-none font-body-sm flex flex-col gap-2">
<p>Theo quy chuẩn "Nếp Đồng Kiểm", với thiết bị điện tử có giá trị cao:</p>
<div class="p-2.5 bg-rice-paper rounded-lg border border-border text-[13px] flex flex-col gap-1.5">
<div class="flex items-center gap-1.5 font-semibold text-jade">
<span class="material-symbols-outlined text-[16px]">verified</span>
                      Được phép:
                    </div>
<p class="text-ink-muted">Mở thùng carton ngoài, kiểm tra tem niêm phong ShopNest, kiểm tra hộp máy nguyên vẹn không móp méo và đối chiếu phiếu bảo hành.</p>
</div>
<p class="text-ink-muted text-[13px]">Bưu tá sẽ đồng kiểm và quay video xác thực cùng bạn. Nếu có bất thường, bạn có quyền từ chối nhận ngay mà không mất bất kỳ chi phí nào.</p>
</div>
<span class="font-label-code text-[11px] text-ink-faint mt-1 ml-1">14:13</span>
</div>
</div>
</div>
<!-- State: TECHNEST CONVERSATION (Default) -->
<div class="flex flex-col gap-4" id="view-technest-messages">
<!-- Date Divider -->
<div class="flex items-center justify-center my-1">
<span class="font-label-code text-[11px] text-ink-faint bg-raw-linen/60 px-3 py-0.5 rounded-full border border-border">
                Hôm nay, 12/11/2026
              </span>
</div>
<!-- In-chat Order Announcement Card -->
<div class="mx-auto max-w-lg w-full bg-warm-porcelain border border-border rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm">
<div class="flex items-center gap-3 min-w-0">
<div class="w-12 h-12 rounded-lg bg-rice-paper border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
<span class="material-symbols-outlined text-ink-muted text-[24px]">laptop_chromebook</span>
</div>
<div class="min-w-0">
<div class="flex items-center gap-1.5">
<span class="font-label-code text-[11px] text-ink-muted">Đơn #SN-24817</span>
<span class="font-label-micro text-[9px] px-1.5 py-0.2 bg-turmeric/10 text-turmeric rounded font-semibold uppercase">Đang giao</span>
</div>
<h4 class="font-body-sm text-[13px] font-semibold text-ink truncate">ASUS Vivobook 14 OLED (M1405VA)</h4>
<p class="font-label-code text-[12px] text-lacquer-red font-medium">14.990.000 ₫</p>
</div>
</div>
<button class="h-8 px-3 rounded-lg border border-border bg-rice-paper hover:bg-lacquer-wash text-ink font-body-sm text-[12px] font-medium flex-shrink-0 transition-colors">
                Xem đơn
              </button>
</div>
<!-- Customer Message 1 -->
<div class="flex items-start justify-end gap-2.5 max-w-[80%] self-end">
<div class="flex flex-col items-end">
<div class="bg-lacquer-red text-warm-porcelain p-3.5 rounded-2xl rounded-tr-none font-body-sm leading-relaxed">
                  Chào shop, mình vừa đặt đơn laptop ASUS Vivobook 14 OLED, nhờ shop kiểm tra kỹ tem niêm phong và đóng gói cẩn thận giúp mình nhé.
                </div>
<span class="font-label-code text-[11px] text-ink-faint mt-1 mr-1">14:15</span>
</div>
</div>
<!-- Shop Message 1 -->
<div class="flex items-start gap-2.5 max-w-[80%]">
<div class="w-8 h-8 rounded-full bg-raw-linen flex items-center justify-center flex-shrink-0 mt-0.5 text-lacquer-red font-bold text-[12px] border border-border">
                TN
              </div>
<div class="flex flex-col">
<div class="bg-warm-porcelain border border-border text-ink p-3.5 rounded-2xl rounded-tl-none font-body-sm leading-relaxed">
                  Dạ TechNest chào bạn Thu Hà! Đơn hàng <span class="font-label-code font-semibold">#SN-24817</span> của bạn đã được xưởng kiểm định ngoại quan, dán tem bảo hành điện tử chính hãng 24 tháng và bọc màng khí chống sốc 3 lớp trước khi bàn giao cho bưu tá VNPost ạ.
                </div>
<span class="font-label-code text-[11px] text-ink-faint mt-1 ml-1">14:18</span>
</div>
</div>
<!-- Shop Message with Image Proof -->
<div class="flex items-start gap-2.5 max-w-[80%]">
<div class="w-8 h-8 rounded-full bg-raw-linen flex items-center justify-center flex-shrink-0 mt-0.5 text-lacquer-red font-bold text-[12px] border border-border">
                TN
              </div>
<div class="flex flex-col">
<div class="bg-warm-porcelain border border-border text-ink p-3 rounded-2xl rounded-tl-none font-body-sm leading-relaxed flex flex-col gap-2.5">
<p>Đây là ảnh kiện hàng của bạn trước khi đóng thùng nẹp gỗ tiêu chuẩn Nếp gửi sang bưu cục Hà Nội Hub 02:</p>
<!-- Packaging Photo Thumbnail -->
<div class="relative rounded-lg overflow-hidden border border-border bg-raw-linen group cursor-pointer max-w-xs">
<img class="w-full h-44 object-cover group-hover:scale-102 transition-transform duration-200" data-alt="A clean, secure delivery parcel package in a cardboard box sealed with branded red tamper-evident tape, labeled for ShopNest fragile electronics shipping, resting on a wooden craft inspection table with warm studio lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvXwxFJ14kIu_fonQR8Izqp4bqpDNODCfwZ99hpJhH1_jL7S9VnM76CAoWHoVPyZTjZS881b8R6_W-iTIb8sYwWbeR9DLXj589Nm9c-X8LCK9P0FZYgYI15TubMtMsglh6a95moNCcPcHT6PgJi9tDrLPF0ZCMP6dxkNm4EWfj3fv6Y7PBt4Y-XEKN14AmNwmuNvNlFZnQa1z3Mg-05-AgybOEvJsa19ISxPEGfA"/>
<div class="absolute bottom-2 left-2 bg-ink/75 text-warm-porcelain font-label-code text-[11px] px-2 py-0.5 rounded backdrop-blur-sm">
                      Mã kiện: #PK-24817-A
                    </div>
</div>
</div>
<span class="font-label-code text-[11px] text-ink-faint mt-1 ml-1">14:19</span>
</div>
</div>
<!-- Customer Message 2 -->
<div class="flex items-start justify-end gap-2.5 max-w-[80%] self-end">
<div class="flex flex-col items-end">
<div class="bg-lacquer-red text-warm-porcelain p-3.5 rounded-2xl rounded-tr-none font-body-sm leading-relaxed">
                  Tuyệt vời, cảm ơn shop rất nhiều. Dự kiến mấy giờ chiều nay bưu tá sẽ giao đến Tràng Tiền bạn nhỉ?
                </div>
<span class="font-label-code text-[11px] text-ink-faint mt-1 mr-1">14:22</span>
</div>
</div>
<!-- Shop Message 3 -->
<div class="flex items-start gap-2.5 max-w-[80%]">
<div class="w-8 h-8 rounded-full bg-raw-linen flex items-center justify-center flex-shrink-0 mt-0.5 text-lacquer-red font-bold text-[12px] border border-border">
                TN
              </div>
<div class="flex flex-col">
<div class="bg-warm-porcelain border border-border text-ink p-3.5 rounded-2xl rounded-tl-none font-body-sm leading-relaxed">
                  Dạ bưu tá Nguyễn Văn Hùng đã nhận tải phát lúc 14:00, dự kiến sẽ liên hệ bạn trước 16:30 chiều nay ạ. Khi nhận bạn nhớ đồng kiểm mở hộp cùng bưu tá nhé!
                </div>
<span class="font-label-code text-[11px] text-ink-faint mt-1 ml-1">14:25</span>
</div>
</div>
<!-- FAILED SEND STATE ROW (Hidden by default, shown when 'error' active) -->
<div class="hidden flex-items-end justify-end gap-2.5 max-w-[80%] self-end" id="row-failed-msg">
<div class="flex flex-col items-end">
<div class="bg-lacquer-red/80 text-warm-porcelain p-3.5 rounded-2xl rounded-tr-none font-body-sm leading-relaxed border border-brick">
                  Cho mình hỏi thêm là phụ kiện sạc 65W đi kèm theo máy có được bảo hành chung luôn không shop?
                </div>
<div class="flex items-center gap-1.5 mt-1 text-brick font-body-sm text-[12px]">
<span class="material-symbols-outlined text-[16px]">error</span>
<span>Không thể gửi tin nhắn. Lỗi mạng cục bộ.</span>
<button class="underline font-medium hover:text-lacquer-deep ml-1">Thử lại</button>
</div>
</div>
</div>
<!-- TYPING INDICATOR ROW (Hidden by default, shown when 'typing' active) -->
<div class="hidden items-center gap-2.5 max-w-[80%]" id="row-typing-indicator">
<div class="w-8 h-8 rounded-full bg-raw-linen flex items-center justify-center flex-shrink-0 text-lacquer-red font-bold text-[12px] border border-border">
                TN
              </div>
<div class="bg-warm-porcelain border border-border px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-ink-faint animate-bounce" style="animation-delay: 0ms;"></span>
<span class="w-2 h-2 rounded-full bg-ink-faint animate-bounce" style="animation-delay: 150ms;"></span>
<span class="w-2 h-2 rounded-full bg-ink-faint animate-bounce" style="animation-delay: 300ms;"></span>
<span class="font-body-sm text-[12px] text-ink-muted ml-2">TechNest đang soạn tin...</span>
</div>
</div>
</div>
</div>
<!-- Quick Replies Bar (Zero emojis, contextual chips) -->
<div class="px-5 py-2 bg-rice-paper/70 border-t border-border flex items-center gap-2 overflow-x-auto" id="quick-replies-bar">
<span class="font-label-micro text-[11px] text-ink-muted uppercase tracking-wider flex-shrink-0">Gợi ý nhanh:</span>
<button class="px-3 py-1 bg-warm-porcelain border border-border hover:border-lacquer-red text-ink font-body-sm text-[13px] rounded-full whitespace-nowrap transition-colors" onclick="handleQuickReply('Đồng kiểm khi nhận hàng')">
            Đồng kiểm khi nhận hàng
          </button>
<button class="px-3 py-1 bg-warm-porcelain border border-border hover:border-lacquer-red text-ink font-body-sm text-[13px] rounded-full whitespace-nowrap transition-colors" onclick="handleQuickReply('Tra cứu mã vận đơn VNPost')">
            Tra cứu mã vận đơn VNPost
          </button>
<button class="px-3 py-1 bg-warm-porcelain border border-border hover:border-lacquer-red text-ink font-body-sm text-[13px] rounded-full whitespace-nowrap transition-colors" onclick="handleQuickReply('Yêu cầu xuất hoá đơn VAT')">
            Yêu cầu xuất hoá đơn VAT
          </button>
<button class="px-3 py-1 bg-warm-porcelain border border-border hover:border-lacquer-red text-ink font-body-sm text-[13px] rounded-full whitespace-nowrap transition-colors" onclick="handleQuickReply('Liên hệ tổng đài 1900 6886')">
            Liên hệ tổng đài 1900 6886
          </button>
</div>
<!-- Message Composer at Bottom -->
<div class="p-3 lg:p-4 bg-warm-porcelain border-t border-border flex flex-col gap-2">
<!-- Composer Actions Toolbar -->
<div class="flex items-center gap-1 text-ink-muted">
<button class="p-1.5 rounded hover:bg-raw-linen hover:text-ink transition-colors" title="Đính kèm tệp hoặc hình ảnh">
<span class="material-symbols-outlined text-[20px]">attach_file</span>
</button>
<button class="p-1.5 rounded hover:bg-raw-linen hover:text-ink transition-colors" title="Gửi liên kết sản phẩm">
<span class="material-symbols-outlined text-[20px]">shopping_bag</span>
</button>
<button class="p-1.5 rounded hover:bg-raw-linen hover:text-ink transition-colors" title="Gửi thẻ đơn hàng liên quan">
<span class="material-symbols-outlined text-[20px]">package_2</span>
</button>
<span class="w-[1px] h-4 bg-border mx-1"></span>
<span class="font-body-sm text-[12px] text-ink-faint">Nhấn Enter để gửi tin, Shift + Enter để xuống dòng</span>
</div>
<!-- Input row -->
<div class="flex items-end gap-2">
<div class="flex-1 relative">
<textarea class="w-full h-11 py-2.5 px-3.5 bg-rice-paper text-ink font-body-sm text-body-sm rounded-xl border border-border placeholder:text-ink-faint focus:outline-none focus:border-lacquer-red focus:ring-1 focus:ring-lacquer-red transition-all resize-none" id="chat-input" placeholder="Nhập tin nhắn gửi đến TechNest Official..." rows="1"></textarea>
</div>
<button class="h-11 px-5 rounded-xl bg-lacquer-red hover:bg-lacquer-deep active:scale-98 text-warm-porcelain font-body-sm font-semibold flex items-center gap-2 transition-all flex-shrink-0" onclick="sendChatMessage()">
<span>Gửi</span>
<span class="material-symbols-outlined text-[18px]">send</span>
</button>
</div>
</div>
</section>
<!-- ================= PANE 3: ORDER CONTEXT RAIL (320px) ================= -->
<aside class="w-80 flex-shrink-0 border-l border-border bg-warm-porcelain h-full flex flex-col overflow-y-auto" id="order-context-rail">
<!-- Rail Header -->
<div class="p-4 border-b border-border flex items-center justify-between bg-rice-paper/40">
<div>
<h3 class="font-headline-3 text-[15px] font-semibold text-ink leading-tight">Ngữ cảnh đơn hàng</h3>
<span class="font-label-code text-[12px] text-lacquer-red font-medium">#SN-24817</span>
</div>
<span class="font-label-micro text-[10px] px-2 py-0.5 rounded bg-turmeric/10 text-turmeric font-semibold uppercase tracking-wider">
            Đang giao hàng
          </span>
</div>
<div class="p-4 flex flex-col gap-4">
<!-- Delivery Progress Card -->
<div class="bg-rice-paper/60 rounded-xl p-3.5 border border-border flex flex-col gap-2.5">
<div class="flex items-start justify-between">
<div>
<span class="font-label-micro text-[10px] text-ink-muted uppercase tracking-wider">Thời gian dự kiến</span>
<p class="font-body-sm text-[13px] font-semibold text-ink">Hôm nay, 14/11 - 15/11/2026</p>
</div>
<span class="material-symbols-outlined text-turmeric text-[22px]">local_shipping</span>
</div>
<div class="pt-2 border-t border-border flex items-center justify-between text-[12px]">
<span class="text-ink-muted">Đơn vị vận chuyển:</span>
<span class="font-body-sm font-medium text-ink">VNPost Express</span>
</div>
<div class="flex items-center justify-between text-[12px]">
<span class="text-ink-muted">Mã vận đơn:</span>
<span class="font-label-code text-ink font-semibold">VNPOST-8849204VN</span>
</div>
</div>
<!-- Product Details In-Chat -->
<div class="flex flex-col gap-2">
<span class="font-label-micro text-[11px] text-ink-muted uppercase tracking-wider">Sản phẩm trong hội thoại</span>
<div class="p-3 rounded-xl border border-border bg-warm-porcelain flex gap-3">
<div class="w-16 h-16 rounded-lg bg-rice-paper border border-border flex-shrink-0 overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A modern slim Asus Vivobook laptop in understated metallic finish displayed closed on an architectural natural linen background with soft side light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrcgMkBpFdWzPNW2cL33gXTW4mXOkeuJWoeTB8iRPByrtBRPE2XYTqEfkWobU0_mAFKb979jSC1bFiMc8i7Zp19RgPj7wcSc_ezHDiqG0PP3Z1DskYAlg-AzdEUvSMhxfXeaeH4rLRBxvWeENMao62nXgsjBmyz-uHt-obuU0v5yZZG668Clmvn67_6e2SS1L8Q33SX3IHD7B2HB8AJYRV_4NKsktP25Dc665fug"/>
</div>
<div class="flex-1 min-w-0 flex flex-col justify-between">
<h4 class="font-body-sm text-[13px] font-semibold text-ink leading-snug line-clamp-2">Laptop ASUS Vivobook 14 OLED (M1405VA)</h4>
<div class="flex items-center justify-between mt-1">
<span class="font-body-sm text-[11px] text-ink-muted">i5 · 16GB · 512GB</span>
<span class="font-label-code text-[13px] text-lacquer-red font-semibold">14.990.000 ₫</span>
</div>
</div>
</div>
</div>
<!-- Shipping Address Summary -->
<div class="flex flex-col gap-2">
<span class="font-label-micro text-[11px] text-ink-muted uppercase tracking-wider">Địa chỉ giao nhận</span>
<div class="p-3 rounded-xl border border-border bg-rice-paper/40 flex flex-col gap-1 text-[13px]">
<div class="flex items-center gap-1.5 font-semibold text-ink">
<span class="material-symbols-outlined text-[16px] text-ink-muted">person</span>
                Nguyễn Thu Hà · 0912 345 678
              </div>
<div class="flex items-start gap-1.5 text-ink-muted pl-0.5">
<span class="material-symbols-outlined text-[16px] text-ink-muted flex-shrink-0 mt-0.5">location_on</span>
<span class="leading-relaxed">Số 18, Ngõ 42, Phố Tràng Tiền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội</span>
</div>
</div>
</div>
<!-- Policy Guarantee Reminder -->
<div class="p-3 rounded-xl bg-jade/5 border border-jade/20 flex items-start gap-2.5">
<span class="material-symbols-outlined text-jade text-[20px] flex-shrink-0 mt-0.5">verified_user</span>
<div class="text-[12px] leading-relaxed text-ink">
<span class="font-semibold text-jade">Cam kết Nếp Care:</span> Đồng kiểm mở hộp trực tiếp cùng shipper. Bảo hiểm 100% rủi ro vận chuyển và chính sách đổi trả 15 ngày toàn diện.
            </div>
</div>
<!-- Rail Actions -->
<div class="flex flex-col gap-2 mt-auto pt-2">
<button class="w-full h-10 rounded-xl border border-border bg-warm-porcelain text-ink font-body-sm text-[13px] font-semibold hover:bg-lacquer-wash hover:text-lacquer-red transition-all flex items-center justify-center gap-1.5">
<span class="material-symbols-outlined text-[18px]">alt_route</span>
              Theo dõi đơn hàng chi tiết
            </button>
<a class="w-full text-center text-ink-muted hover:text-lacquer-red font-body-sm text-[12px] transition-colors py-1" href="#">
              Xem chi tiết hoá đơn điện tử (VAT)
            </a>
</div>
</div>
</aside>
</div>
</div>
</div>
<script>
  function switchChatState(state) {
    // Reset buttons
    const pills = document.querySelectorAll('.state-pill');
    pills.forEach(p => {
      p.className = 'state-pill px-3 py-1 rounded-full text-body-sm font-medium transition-all bg-raw-linen text-ink hover:bg-lacquer-wash';
    });

    const activeBtn = document.getElementById('state-btn-' + state);
    if (activeBtn) {
      activeBtn.className = 'state-pill px-3 py-1 rounded-full text-body-sm font-medium transition-all bg-lacquer-red text-warm-porcelain';
    }

    // Elements
    const headerShop = document.getElementById('chat-header-shop');
    const headerBot = document.getElementById('chat-header-bot');
    const rowTechnest = document.getElementById('row-technest');
    const rowAssistant = document.getElementById('row-assistant');
    const orderRail = document.getElementById('order-context-rail');

    const viewTechnest = document.getElementById('view-technest-messages');
    const viewBot = document.getElementById('view-bot-messages');
    const viewEmpty = document.getElementById('view-empty');
    const typingRow = document.getElementById('row-typing-indicator');
    const failedRow = document.getElementById('row-failed-msg');
    const quickReplies = document.getElementById('quick-replies-bar');
    const chatInput = document.getElementById('chat-input');

    // Hide all main message layers first
    viewTechnest.classList.add('hidden');
    viewBot.classList.add('hidden');
    viewEmpty.classList.add('hidden');
    viewEmpty.classList.remove('flex');
    typingRow.classList.add('hidden');
    typingRow.classList.remove('flex');
    failedRow.classList.add('hidden');
    failedRow.classList.remove('flex');

    // Default reset for sidebars
    rowTechnest.classList.remove('border-l-4', 'border-lacquer-red', 'bg-lacquer-wash/25');
    rowAssistant.classList.remove('border-l-4', 'border-lacquer-red', 'bg-lacquer-wash/25');

    if (state === 'default') {
      headerShop.classList.remove('hidden');
      headerShop.classList.add('flex');
      headerBot.classList.add('hidden');
      headerBot.classList.remove('flex');
      
      rowTechnest.classList.add('border-l-4', 'border-lacquer-red', 'bg-lacquer-wash/25');
      viewTechnest.classList.remove('hidden');
      orderRail.classList.remove('hidden');
      quickReplies.classList.remove('hidden');
      chatInput.placeholder = "Nhập tin nhắn gửi đến TechNest Official...";
    } else if (state === 'bot') {
      headerShop.classList.add('hidden');
      headerShop.classList.remove('flex');
      headerBot.classList.remove('hidden');
      headerBot.classList.add('flex');

      rowAssistant.classList.add('border-l-4', 'border-lacquer-red', 'bg-lacquer-wash/25');
      viewBot.classList.remove('hidden');
      viewBot.classList.add('flex');
      orderRail.classList.remove('hidden');
      quickReplies.classList.remove('hidden');
      chatInput.placeholder = "Hỏi Trợ lý ShopNest về đơn hàng, voucher, hoặc quy định...";
    } else if (state === 'typing') {
      headerShop.classList.remove('hidden');
      headerShop.classList.add('flex');
      headerBot.classList.add('hidden');
      
      rowTechnest.classList.add('border-l-4', 'border-lacquer-red', 'bg-lacquer-wash/25');
      viewTechnest.classList.remove('hidden');
      typingRow.classList.remove('hidden');
      typingRow.classList.add('flex');
      orderRail.classList.remove('hidden');
      quickReplies.classList.remove('hidden');
      chatInput.placeholder = "Nhập tin nhắn gửi đến TechNest Official...";
    } else if (state === 'error') {
      headerShop.classList.remove('hidden');
      headerShop.classList.add('flex');
      headerBot.classList.add('hidden');
      
      rowTechnest.classList.add('border-l-4', 'border-lacquer-red', 'bg-lacquer-wash/25');
      viewTechnest.classList.remove('hidden');
      failedRow.classList.remove('hidden');
      failedRow.classList.add('flex');
      orderRail.classList.remove('hidden');
      quickReplies.classList.remove('hidden');
      chatInput.placeholder = "Nhập tin nhắn gửi đến TechNest Official...";
    } else if (state === 'empty') {
      headerShop.classList.remove('hidden');
      headerShop.classList.add('flex');
      headerBot.classList.add('hidden');

      viewEmpty.classList.remove('hidden');
      viewEmpty.classList.add('flex');
      quickReplies.classList.add('hidden');
      chatInput.placeholder = "Bắt đầu cuộc trò chuyện mới...";
    }

    // Scroll to bottom of message box
    const container = document.getElementById('messages-container');
    if (container) {
      setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
    }
  }

  function handleQuickReply(text) {
    const input = document.getElementById('chat-input');
    if (input) {
      input.value = text;
      input.focus();
    }
  }

  function sendChatMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;
    
    const text = input.value.trim();
    const viewTechnest = document.getElementById('view-technest-messages');
    
    // Create new customer message element
    const newMsg = document.createElement('div');
    newMsg.className = 'flex items-start justify-end gap-2.5 max-w-[80%] self-end animate-fade-in';
    newMsg.innerHTML = `
      <div class="flex flex-col items-end">
        <div class="bg-lacquer-red text-warm-porcelain p-3.5 rounded-2xl rounded-tr-none font-body-sm leading-relaxed">
          ${text.replace(/</g, "<").replace(/>/g, ">")}
        </div>
        <span class="font-label-code text-[11px] text-ink-faint mt-1 mr-1">Vừa xong</span>
      </div>
    `;

    viewTechnest.appendChild(newMsg);
    input.value = '';

    const container = document.getElementById('messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
</script></main></body></html>
```