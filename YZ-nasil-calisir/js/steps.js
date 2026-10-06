/**
 * Lesson chapters for middle school (ages 10–14). Bıdık, the apprentice
 * robot chef, learns how long to cook a dumpling. Every chapter: one idea,
 * one thing to do, and a teacher note with the real terms.
 */
const teacher = (html) => `<details class="teacher"><summary>Öğretmen notu</summary>${html}</details>`;

export const STEPS = [
  {
    id: 'veri',
    label: 'Mantılar',
    title: 'Bıdık\'a kural değil, örnek veriyoruz',
    body: `
      <p>Bıdık'ın derdi şu: mantıları bazen çiğ kalıyor, bazen lapa oluyor. Ona kural söylemeyeceğiz; masaya bir sürü pişmiş mantı dizeceğiz, Bıdık kendi çözecek.</p>
      <p>Masada sağa gittikçe mantılar büyüyor, yukarı çıktıkça daha uzun pişmişler. <span class="sweet">Pembeler tam kıvamında</span>, <span class="salty">sarılar olmamış</span>: ya çiğ kalmış ya da fazla pişmiş. Pembeler masada nerede toplanmış? Bir desen görüyor musun? Önce kendin bul, sonra cevaba bak.</p>
      <details class="answer"><summary>Cevaba bak</summary><p>Pembeler masada çapraz bir şerit oluşturuyor: mantı büyüdükçe kıvamına gelmesi için gereken süre de uzuyor. Küçük mantı kısa, büyük mantı uzun pişmeli.</p></details>
      <p>Sen deseni gözünle görüyorsun. Bıdık ise masaya bakmıyor; ona yalnızca sayılar gidiyor. <b>"Bıdık'ın gözüyle bak"</b> düğmesine bas: masa Bıdık'a nasıl görünüyor?</p>
      <p>Neden kural yazmıyoruz? Bu masada kuralı biz biliyoruz ama gerçek işlerin çoğunda kimse yazamaz: "fotoğrafta kedi var mı?" için kural yazmayı bir dene! Bu yüzden makineye kural değil örnek veriyoruz.</p>
      ${teacher('<p>Bu masa <b>eğitim verisi</b>dir. Her mantı bir <b>örnek</b>: iki <b>özellik</b> (boy: 0–1, pişme süresi: 0–10 dakika) ve bir <b>etiket</b> (tam kıvamında = 1, olmamış = 0). Masada <span data-count="dishes">64</span> örnek var. Masanın gizli kuralı: ideal süre 3 + 6·boy dakika, ±1,5 dakika tolerans. Bu yüzden "kıvamında" bölgesi çapraz bir şerittir. Şerit tek bir düz çizgiyle ayrılamaz; yani doğrusal olmayan bir kuraldır ve gizli katmanı olmayan bir model bunu öğrenemez. Örnek bilerek basittir: öğrencinin deseni görebilmesi, modelin öğrendiğini gözle denetlemeyi mümkün kılar. Model ise örtüyü değil, 64 sayı çiftini alır; öğrenmenin gerekçesi de burada kuralın bilinmemesi değil, gerçek görevlerde (görüntü, ses, dil) kuralın yazılamamasıdır.</p>')}`,
    focus: 'board',
    say: 'Ooo, bu kadar mantı mı? Hangisi kıvamında, hangisi olmamış, bakayım!',
    mood: 'curious',
    action: 'Bıdık\'ın gözüyle bak',
    act(c) {
      c.toggleBidikView();
    },
    enter(c) {
      c.bidikView = false;
      c.board.tintTarget = 0;
      c.network.setWeightsVisible(false);
      c.tokens.visible = false;
      c.board.hideAll();
      c.board.dishes.forEach((_, i) => c.later(0.15 + i * 0.045, () => c.board.revealDish(i)));
      c.later(0.4, () => c.sound.play('refill', { volume: 0.5 }));
    },
  },
  {
    id: 'model',
    label: 'Kafası',
    title: 'Bıdık\'ın kafasının içine bakalım',
    body: `
      <p>Bıdık'ın kafasının içi işte böyle. Mantının boyu ve pişme süresi soldan giriyor. Ortadaki sekiz <b>yardımcı</b> bu iki sayıyı dinleyip fısıldaşıyor; en sağdaki son sözü söylüyor: <i>tam kıvamında mı?</i></p>
      <p>Yardımcıları <b>ipler</b> bağlıyor. Her ip bir fısıltı taşıyor; kalın ip, güçlü fısıltı demek. <span class="salty2">Kırmızı ip</span> fısıltıyı olduğu gibi iletiyor: "artır!" <span class="slate">Mavi ip</span> tersine çeviriyor: "azalt!"</p>
      <p>Şu anda ipler rastgele. <b>"İpleri karıştır!"</b> düğmesine birkaç kez bas: Bıdık'a hep aynı mantıyı soruyoruz, ama ipler değişince cevabı da değişiyor. Öğrenmek, bu ipleri doğru ayarlamak demek; az sonra Bıdık bunu yapacak.</p>
      ${teacher('<p>Bu bir <b>yapay sinir ağı</b>: 2 giriş, 8 düğümlü bir gizli katman, 1 çıkış. İpler <b>ağırlık</b>tır (2·8 + 8 = 24 tane); ayrıca gizli ve çıkış düğümlerinin her birinde bir <b>sapma</b> (bias) değeri vardır (9 tane). Toplam 33 <b>parametre</b>. İpin kalınlığı ağırlığın büyüklüğünü, rengi işaretini gösterir: kırmızı = pozitif, mavi = negatif. Başlangıçta hepsi rastgeledir; "İpleri karıştır" ağırlıkları yeni rastgele değerlerle baştan kurar ve aynı örneği ağdan geçirir: çıktı her seferinde başka olur. (Antrenmandan sonra basılırsa öğrenilenler de silinir.)</p>')}`,
    focus: 'network',
    say: 'İplerim karman çorman! "İpleri karıştır"a bas, aynı mantıya ne diyeceğim bakalım.',
    mood: 'worried',
    action: 'İpleri karıştır!',
    enter(c) {
      c.board.revealAll();
      c.network.setWeightsVisible(true);
      c.tokens.visible = false;
      // the same mid-size dumpling every time, so only the strings change
      c.shuffleTries = [];
      c.shuffleExample = c.data.reduce((a, d) => (Math.hypot(d.x[0] - 0.5, d.x[1] - 0.5) < Math.hypot(a.x[0] - 0.5, a.x[1] - 0.5) ? d : a));
      c.later(0.5, () => c.sound.play('pick'));
    },
    act(c) {
      c.shuffleWeights();
    },
  },
  {
    id: 'ileri',
    label: 'Oyun',
    title: 'Hadi bir oyun: önce sen, sonra Bıdık',
    body: `
      <p>Masadan bir mantı seçtim; halkalı tabakta duruyor. Boyuna ve kaç dakika piştiğine bak, bir de komşularına: etrafındaki mantılar pembe mi, sarı mı? Sence tam kıvamında mı, yoksa olmamış mı? Korkma, yanlış cevap sorun değil; sadece tahmin!</p>
      <p>Sen söyleyince sıra Bıdık'a geçiyor. Mantının iki sayısı (boy ve süre) soldan giriyor, iplerden geçip sekiz yardımcıya ulaşıyor; parlayan yardımcılar en çok heyecanlananlar. Her yardımcı fikrini en sağdakine fısıldıyor, o da bir yüzde söylüyor: "%80 kıvamında" gibi. %50'yi geçerse Bıdık "tam kıvamında!" diyor, geçmezse "olmamış!" diyor. Ama dikkat: Bıdık daha öğrenmedi, ipleri rastgele. Şimdilik bilse de şans.</p>
      ${teacher('<p>Bu bir <b>ileri geçiş</b>tir: her düğüm girdilerini ağırlıklarla çarpıp toplar, sapmayı ekler, sonra bir <b>aktivasyon fonksiyonu</b>ndan (burada tanh) geçirir. Çıkış düğümü sigmoid fonksiyonuyla 0–1 arasında bir olasılık üretir; eşik 0,5. Eğitilmemiş bir model rastgele ağırlıklarla çalıştığı için çoğunlukla yanılır.</p>')}`,
    focus: 'game',
    say: 'Bir mantı seçtim. Önce sen söyle, sonra ben deneyeyim!',
    mood: 'curious',
    guess: true,
    action: 'Başka bir mantı seç',
    enter(c) {
      c.board.revealAll();
      c.network.setWeightsVisible(true);
      c.tokens.visible = false;
      c.later(0.5, () => c.newGuessRound());
    },
    act(c) {
      c.newGuessRound();
    },
  },
  {
    id: 'hata',
    label: 'Düzelt',
    title: 'Yanılmak sorun değil, düzeltmek önemli',
    body: `
      <p>Bıdık yanılınca ne oluyor biliyor musun? Üzülmüyor, öğreniyor! Önce "ne kadar yanıldım?" diye bakıyor; buna <b>hata puanı</b> diyoruz. Sonra her ipi, hatayı azaltacak yöne doğru <i>azıcık</i> oynatıyor: kimini kalınlaştırıyor, kimini inceltiyor.</p>
      <p><b>"Hadi düzelt!"</b> düğmesine bas ve izle: önce mantının sayıları soldan sağa akıyor, Bıdık tahminini söylüyor. Sonra <b>mor ışıklar</b> beliriyor ve ters yöne, sağdan sola gidiyor. Bu, "hangi ip hataya ne kadar sebep oldu?" sorusunun cevabı. Ardından ipler biraz değişiyor ve hata puanı düşüyor. İşte öğrenmek dediğimiz şey tam olarak bu. Birkaç kez bas, her seferinde puan biraz daha düşsün.</p>
      ${teacher('<p>Modelin tahmini ile gerçek etiket arasındaki uyumsuzluk bir sayıyla ölçülür: <b>kayıp</b> (loss). Burada ikili çapraz entropi kullanılıyor ve ekrandaki "hata puanı" masadaki tüm mantılar için kaybın ortalamasıdır. <b>Geri yayılım</b> her ağırlığın kaybı ne yöne, ne kadar değiştirdiğini (türevini) hesaplar; <b>gradyan inişi</b> ağırlıkları o yönün tersine küçük bir adım oynatır. Her düğmeye basış, masadaki tüm mantılara bakan bir adımdır.</p>')}`,
    focus: 'network',
    say: 'Yanıldım galiba. Olsun! Bakalım hangi ip suçlu?',
    mood: 'thinking',
    action: 'Hadi düzelt!',
    stats: true,
    enter(c) {
      c.board.revealAll(); // the dishes may still be hidden if chapter 1 was skipped mid-reveal
      c.network.setWeightsVisible(true);
      c.tokens.visible = false;
      c.updateStats();
    },
    act(c) {
      c.learnStep();
    },
  },
  {
    id: 'egitim',
    label: 'Antrenman',
    title: 'Tekrar, tekrar, tekrar!',
    body: `
      <p>Bir düzeltme yetmez tabii. Bıdık masadaki mantılara yüzlerce kez bakıp her seferinde ipleri azıcık düzeltiyor. Buna <b>antrenman</b> diyoruz. Bisiklete binmeyi öğrenmek gibi: düşe kalka ama sonunda oluyor. Bu 600 bakış bilgisayarda bir saniye bile sürmez; sen izleyebil diye yavaşlattık: ilk bakışlar tek tek geçiyor, sonra Bıdık hızlanıyor. Örtüye, iplere ve "Doğru bildi" sayısına bak. Doğru sayısı önce yavaş yavaş, en sonda hızla yükseliyor.</p>
      <p>Antrenman sırasında masa örtüsüne bak. <span class="sweet">Pembe</span> şerit Bıdık'ın "burada tam kıvamında" dediği yer, <span class="salty">sarı</span> bölgeler "burada olmamış" dediği yerler. Kimse ona "büyük mantı uzun pişer" demedi. Örneklere baka baka kendi buldu. Süper, değil mi?</p>
      ${teacher('<p><b>Eğitim</b>: tam yığın gradyan inişi, öğrenme hızı 1,2, 600 adım; her adımda masadaki mantıların hepsi kullanılır. Kayıp düşerken doğruluk yükselir. Örtüdeki renk, modelin her (boy, süre) noktası için tahminidir; pembe ile sarının kesiştiği çizgi <b>karar sınırı</b>dır. Çapraz şerit yalnızca gizli katman sayesinde öğrenilebilir.</p>')}`,
    focus: 'game',
    say: 'Hadi antrenman! Düşe kalka öğrenirim, göreceksin.',
    mood: 'happy',
    action: 'Antrenman başlasın!',
    secondary: 'Her şeyi unut',
    stats: true,
    enter(c) {
      c.board.revealAll(); // the dishes may still be hidden if chapter 1 was skipped mid-reveal
      c.network.setWeightsVisible(true);
      c.tokens.visible = false;
      c.board.tintTarget = c.net.steps > 0 ? 1 : 0;
      c.board.paint((s, t) => c.net.predict([s, t]));
      c.updateStats();
    },
    act(c) {
      c.toggleTraining();
    },
    act2(c) {
      c.resetNet();
    },
    exit(c) {
      c.stopTraining();
    },
  },
  {
    id: 'test',
    label: 'Sınav',
    title: 'Sınav zamanı: yepyeni bir mantı!',
    body: `
      <p>Bıdık çalıştı, şimdi sınav! Masaya hiç görmediği bir mantı koy: örtüye tıkla ya da kaydırıcılarla boyunu ve süresini ayarla. Önce sen tahmin et; sonra Bıdık cevaplıyor ve örtü onun haritasıyla boyanıyor.</p>
      <p>Haritada şeridin kenarına bir mantı koymayı dene: orada Bıdık kararsız kalabilir, "%55 kıvamında" gibi. Hiç dert değil; biz de bazen "hmm, bir dakika daha mı pişseydi?" demez miyiz? Önemli olan şu: Bıdık hiç görmediği bir mantı için de fikir yürütebiliyor.</p>
      ${teacher('<p>Görülmemiş örneklerde doğru tahmin yapabilmeye <b>genelleme</b> denir. Bu bölümdeki mantı eğitim verisinde yoktur; doğru cevap, tahminden sonra masanın gizli kuralına göre gösterilir. Örtüdeki harita (modelin her noktadaki tahmini) öğrenci tahminini söyledikten sonra açılır, yeni mantı yerleştirilince kapanır; böylece öğrenci Bıdık\'ın cevabını görmeden karar verir. Model az eğitildiyse bir önceki bölümde antrenmanı çalıştırın.</p>')}`,
    focus: 'board',
    say: 'Yeni mantı mı? Heyecanlandım! Bakalım bilebilecek miyim.',
    mood: 'curious',
    sliders: true,
    guess: true,
    enter(c) {
      c.board.revealAll(); // the dishes may still be hidden if chapter 1 was skipped mid-reveal
      c.network.setWeightsVisible(true);
      c.tokens.visible = false;
      c.board.tintTarget = c.net.steps > 0 ? 1 : 0;
      c.board.paint((s, t) => c.net.predict([s, t]));
      c.setProbe(0.62, 0.45, true);
    },
    exit(c) {
      c.board.probe.visible = false;
    },
  },
  {
    id: 'llm',
    label: 'Sohbet',
    title: 'Sohbet robotları da tıpkı Bıdık gibi',
    body: `
      <p>Bıdık artık mantıyı biliyor. Peki ya telefonundaki sohbet robotu? Onun mutfağı da aynı; sadece masada mantı yerine kelimeler var. Bu yüzden mantıları kaldırdık, yerine kelime karoları dizdik.</p>
      <p>ChatGPT gibi sohbet robotları da Bıdık'la aynı yöntemle öğrendi: tahmin et, yanıl, düzelt, tekrar et. Sadece oyunları farklı: "kıvamında mı?" yerine <b>"sıradaki kelime ne?"</b> oyunu oynuyorlar.</p>
      <p>Milyonlarca kitap ve yazı okudular. Her seferinde sıradaki kelimeyi tahmin ettiler, yanılınca iplerini düzelttiler. Bıdık'ın 33 ipi var; onların milyarlarca ipi var.</p>
      <p>Şimdi sen oyna: aşağıdaki kelimelerden birini seçerek cümleyi büyüt. Bıdık hep en olası olanı (en uzun çubuk) seçer; sen istersen daha az olası bir kelimeyle komik bir cümle kurabilirsin!</p>
      ${teacher('<p><b>Büyük dil modelleri</b> metni <b>token</b> denen parçalara (kelime ya da kelime parçası) böler ve bir sonraki token için olasılık dağılımı üretir. Aynı döngüyle eğitilir: tahmin et → kaybı ölç → ağırlıkları düzelt; fark, milyarlarca (en büyüklerinde trilyonlarca) parametre ve çok daha büyük veridir. Sohbet edebilmeleri için bu ön eğitimin üstüne insan geri bildirimiyle ek bir eğitim de yapılır. Buradaki kelimeler ve yüzdeler gerçek bir dil modelinden gelmiyor; fikri göstermek için elle yazıldı (tarayıcıda çalışan gerçek bir sayma modeli Ders 04\'te var). "Bıdık seçsin" hep en olası kelimeyi alır (açgözlü seçim); öğrenci daha az olasıları da seçebilir ve cümlenin olasılığı, seçilen kelimelerin olasılıklarının çarpımı olarak gösterilir. Gerçek modeller genellikle olasılıklardan rastgele örnekleme yapar (sıcaklık ayarı; Ders 04).</p>')}`,
    focus: 'tokens',
    say: 'Mantı bitti, şimdi kelime oyunu! Sıradaki kelimeyi sen seç: aşağıdaki kelimelerden birine bas.',
    mood: 'happy',
    action: 'Bıdık seçsin',
    enter(c) {
      c.board.tintTarget = 0;
      c.board.hideAll();
      c.network.setWeightsVisible(false);
      c.network.visible = false;
      c.tokens.visible = true;
      c.tokens.reset(true);
      c.updateTokenReadout();
    },
    act(c) {
      if (c.tokens.finished) {
        c.tokens.reset(true);
        c.sound.play('pick');
        c.updateTokenReadout();
      } else c.pickWord();
    },
    exit(c) {
      c.tokens.visible = false;
      c.network.visible = true;
      c.board.revealAll();
      c.network.setWeightsVisible(true);
    },
  },
  {
    id: 'ozet',
    label: 'Bilgi testi',
    title: 'Bilgi testi: şimdi sıra sende!',
    body: `
      <p>Bıdık öğrendi, peki ya sen? Önce dört adımı hatırlayalım:</p>
      <ol class="cycle">
        <li><b>Tahmin et</b><span>Bıdık mantının iki sayısına bakıp bir yüzde söyler.</span></li>
        <li><b>Ne kadar yanıldın?</b><span>Hata puanı bunu ölçer.</span></li>
        <li><b>Azıcık düzelt</b><span>İpler hatayı azaltacak yöne biraz oynar.</span></li>
        <li><b>Tekrar et</b><span>Yüzlerce kez. Sonunda hiç görmediği mantıyı da bilir.</span></li>
      </ol>
      <p>Şimdi altı kısa soru. Her soruda tek bir doğru cevap var, hadi bakalım:</p>
      <div class="quiz" id="quiz"></div>
      ${teacher('<p>Özet: (1) Model kural ezberlemez, örneklerden öğrenir. (2) Model, ağırlıklarla dolu bir tahmin makinesidir. (3) Eğitim: tahmin et, kaybı ölç, ağırlıkları azıcık düzelt; bunu çok kez tekrarla. (4) Genelleme: görülmemiş örneklerde de doğru tahmin. (5) Dil modelleri aynı döngüyü "sıradaki token" görevinde uygular.</p>')}`,
    focus: 'overview',
    say: 'Artık mantıyı tam kıvamında pişirebiliyorum! Peki ya sen?',
    mood: 'proud',
    quiz: true,
    enter(c) {
      c.board.revealAll();
      c.board.tintTarget = c.net.steps > 0 ? 1 : 0;
      c.board.paint((s, t) => c.net.predict([s, t]));
      c.network.setWeightsVisible(true);
      c.tokens.visible = false;
      c.startAmbientPulses();
      c.buildQuiz();
    },
    exit(c) {
      c.stopAmbientPulses();
    },
  },
];

export const QUIZ = [
  {
    q: 'Bıdık mantıyı ne kadar pişireceğini nasıl öğrendi?',
    options: ['"Büyük mantı daha uzun pişer" kuralını ona biz söyledik', 'Masadaki pişmiş mantı örneklerine baka baka', 'İnternette mantı tariflerini aradı'],
    answer: 1,
    why: 'Aynen öyle! Kural söylemedik, internete de bakmadı; deseni masadaki örneklerden kendi buldu.',
    nope: 'Hayır. Ona ne kural söyledik ne de internete baktı; sadece masadaki pişmiş mantıları gösterdik, deseni kendi buldu.',
  },
  {
    q: 'Bıdık masaya "baktığında" aslında ne görüyor?',
    options: ['Renkli mantıların fotoğrafını', 'Ustanın yazdığı gizli kuralı', 'Her mantı için iki sayı ve bir etiket'],
    answer: 2,
    why: 'Doğru! "Bıdık\'ın gözüyle bak" düğmesinde gördün: örtü yok, renk yok; her mantı bir boy, bir süre ve 1 ya da 0.',
    nope: 'Hayır. Bıdık ne fotoğraf görüyor ne de kural biliyor; ona her mantı için iki sayı (boy, süre) ve bir etiket (1 ya da 0) gidiyor.',
  },
  {
    q: 'Bıdık öğrenirken kafasında ne değişiyor?',
    options: ['Yeni yardımcılar ekleniyor', 'İplerin kalınlığı ve rengi azıcık ayarlanıyor', 'Masadaki mantıları tek tek ezberliyor'],
    answer: 1,
    why: 'Bildin! Yardımcıların sayısı hep sekiz; öğrenmek, ipleri azıcık azıcık ayarlamak demek.',
    nope: 'Hayır. Yardımcı sayısı hiç değişmedi, mantıları da tek tek ezberlemiyor; öğrenirken değişen şey iplerin kalınlığı ve rengi.',
  },
  {
    q: '"Hata puanı" neyi gösterir?',
    options: ['Bıdık\'ın tahminlerinin ne kadar yanlış olduğunu', 'Bıdık\'ın masaya kaç kez baktığını', 'Bir mantının kaç dakika piştiğini'],
    answer: 0,
    why: 'Doğru! Hata puanı "ne kadar yanıldım?" sorusunun cevabı; antrenmanda gitgide düşmesi gerekir.',
    nope: 'Hayır. Kaç kez baktığı ayrı bir sayaç; hata puanı ise tahminlerin ne kadar yanlış olduğunu ölçer ve öğrendikçe düşer.',
  },
  {
    q: 'Sınavda Bıdık\'a neden hiç görmediği bir mantı verdik?',
    options: ['Masadaki mantıları hatırlıyor mu diye bakmak için', 'Sınav sırasında da ipleri düzeltsin diye', 'Ezberlemiş mi, gerçekten öğrenmiş mi anlamak için'],
    answer: 2,
    why: 'Aynen! Gördüğü mantıları ezberlemiş de olabilir. Yeni bir mantıyı da bilebiliyorsa gerçekten öğrenmiş demektir.',
    nope: 'Hayır. Sınavda ipler değişmiyor ve amaç hatırlamayı ölçmek değil; yeni bir mantıyı da bilebiliyorsa ezberlememiş, gerçekten öğrenmiştir.',
  },
  {
    q: 'Sohbet robotları nasıl öğrendi?',
    options: ['İnsanlar her soruya cevabı tek tek yazdı', 'Milyonlarca yazıda sıradaki kelimeyi tahmin edip yanıldıkça düzelterek', 'İnternetteki cevapları ezberleyip aynen kopyalayarak'],
    answer: 1,
    why: 'Bildin! Bıdık\'la aynı döngü: tahmin et, yanıl, düzelt, tekrar et. Sadece oyunları "sıradaki kelime ne?".',
    nope: 'Hayır. Cevapları kimse tek tek yazmadı, ezberleyip kopyalamıyorlar da; sıradaki kelimeyi tahmin ede ede, yanıldıkça düzelterek öğrendiler.',
  },
];
