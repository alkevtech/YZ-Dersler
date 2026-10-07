/**
 * Lesson 02 · Ezber mi, öğrenme mi? Bıdık trains on a training table and is
 * graded on a separate test table. Few examples → memorising; many → learning;
 * wrong labels → confusion. Middle school, one idea per chapter.
 */
const teacher = (html) => `<details class="teacher"><summary>Öğretmen notu</summary>${html}</details>`;

export const STEPS = [
  {
    id: 'masalar',
    label: 'İki masa',
    title: 'İki masa: antrenman ve sınav',
    body: `
      <p>Bu sefer mutfakta iki masa var. Soldaki <b>antrenman masası</b>: Bıdık öğrenirken yalnızca buradaki mantılara bakacak. Sağdaki <b>sınav masası</b>: buradaki mantıları antrenmanda <i>hiç</i> görmeyecek; onlarla ancak sınavda, puanlanırken karşılaşacak.</p>
      <p><b>"Bıdık'ın gördüğü masa"</b> düğmesine bas: antrenman sırasında Bıdık'ın gözünde mutfak böyle.</p>
      <p>Neden iki masa? Çünkü "öğrendim" demek kolay. Gerçekten öğrenip öğrenmediğini ancak hiç görmediği mantılarda anlarız. Tıpkı senin sınavda kitaptakinin aynısı değil, benzer soruları çözmen gibi.</p>
      ${teacher('<p>Makine öğrenmesinde veri en az ikiye bölünür: <b>eğitim kümesi</b> (model bununla öğrenir) ve <b>test kümesi</b> (yalnızca ölçmek için, eğitimde asla kullanılmaz). Burada eğitim havuzunda 64, test masasında 32 mantı var; ikisi de aynı gizli kuraldan (ideal süre 3 + 6·boy dakika, ±1,5 dk) üretilmiştir ama farklı mantılardır. Gerçek projelerde üçüncü bir <b>doğrulama kümesi</b> de kullanılır.</p>')}`,
    focus: 'overview',
    say: 'Soldaki masada çalışacağım, sağdakinde sınav olacağım. Hile yok!',
    mood: 'curious',
    action: 'Bıdık\'ın gördüğü masa',
    enter(c) {
      c.setCount(64, true);
      c.resetNet(true);
      c.network.setWeightsVisible(true);
      c.showTest(true);
    },
    act(c) {
      c.toggleBidikView();
    },
    exit(c) {
      c.bidikView = false;
      c.testBoard.visible = true;
    },
  },
  {
    id: 'az',
    label: 'Az örnek',
    title: 'Deney 1: Bıdık\'a sadece 6 mantı ver',
    body: `
      <p>Antrenman masasına yalnızca <b>6 mantı</b> koyduk. Bıdık bunlara yüzlerce kez bakıp iplerini düzeltecek. Sonra her iki masada da kaç mantıyı doğru bildiğine bakacağız.</p>
      <p>Tahmin et: antrenman masasında kaç puan alır? Peki sınav masasında? <b>"Antrenman başlasın!"</b> düğmesine bas, birlikte görelim. Örtülerin renklerine de dikkat et: pembe bölge Bıdık'ın "kıvamında" dediği yer.</p>
      ${teacher('<p>Eğitim: tam yığın gradyan inişi, 600 adım, öğrenme hızı 1,2, yalnızca seçilen 6 örnekle. Model 33 parametreyle 6 noktayı kolayca ezberler (eğitim doğruluğu %100) ama öğrendiği karar sınırı gerçek şeride benzemez; test doğruluğu %78 (32 mantıdan 25\'i). Karşılaştırma için: sınav masasında 20 "kıvamında", 12 "olmamış" mantı var; hep "kıvamında" diyen bir model %62 alır. Antrenman izlensin diye yavaşlatıldı (yaklaşık 6 saniye). Eğitim ile test başarısı arasındaki bu açıklık <b>aşırı öğrenmenin</b> (overfitting) göstergesidir.</p>')}`,
    focus: 'overview',
    say: 'Altı mantı mı? Kolay! Hepsini aklımda tutarım.',
    mood: 'happy',
    action: 'Antrenman başlasın!',
    secondary: 'Her şeyi unut',
    stats: true,
    enter(c) {
      c.setNoise(false);
      c.setCount(6);
      c.resetNet(true);
      c.showTest(true);
      c.network.setWeightsVisible(true);
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
    id: 'ezber',
    label: 'Ezber',
    title: 'Antrenmanda tam puan, sınavda fiyasko',
    body: `
      <p>Gördün mü? Antrenman masasında <b>hepsini</b> bildi; sınav masasında bir sürü yanlış yaptı. Kırmızı halkalı mantılar yanlış bildikleri. Bıdık altı mantının yerini <b>ezberledi</b>, ama "büyük mantı daha uzun pişer" kuralını <b>öğrenmedi</b>.</p>
      <p>Örtüye bak: pembe bölge, gerçek çapraz şerit yerine tuhaf bir şekil aldı. Altı noktayı doğru bilen bir sürü farklı şekil çizilebilir; Bıdık bunlardan birini seçti, yanlış olanı.</p>
      <p><b>"Başka 6 mantı seç"</b> düğmesine birkaç kez bas: Bıdık her seferinde başka 6 mantıyla öğreniyor. Antrenmanda hep tam puan alıyor; peki sınav puanı ve harita ne oluyor?</p>
      ${teacher('<p>Eğitim doğruluğu yüksek, test doğruluğu düşükse model <b>genelleme</b> yapamıyordur. Az veriyle model, veriye uyan pek çok hipotezden birini seçer; hangisinin gerçek kuralı yansıttığını veri belirleyemez. Kırmızı halkalar test kümesindeki yanlış tahminlerdir. "Başka 6 mantı seç" havuzdan rastgele 6 mantı alıp aynı modeli yeniden eğitir: eğitim hep %100, test %50–84 arasında değişir ve karar sınırı seçime göre büyük ölçüde değişir (yüksek varyans). Önceki bölümde antrenman yapılmadan gelinirse model aynı 6 mantıyla kendiliğinden eğitilir; sonuç her seferinde aynıdır (%100 / %78).</p>')}`,
    focus: 'test',
    say: 'Ama… ama antrenmanda hepsini bilmiştim! Sınavda neden olmadı?',
    mood: 'worried',
    action: 'Başka 6 mantı seç',
    stats: true,
    enter(c) {
      c.ensureSixTrained();
      c.sixTries = [Math.round(c.net.evaluate(c.test).acc * 100)];
      c.showTest(true);
      c.network.setWeightsVisible(true);
      c.updateStats();
      c.later(0.8, () => c.markWrong());
    },
    act(c) {
      c.otherSix();
    },
    exit(c) {
      c.clearMarks();
    },
  },
  {
    id: 'cok',
    label: 'Çok örnek',
    title: 'Deney 2: 64 mantıyla tekrar dene',
    body: `
      <p>Şimdi antrenman masasını dolduralım: <b>64 mantı</b>. Aynı Bıdık, aynı ipler, aynı sayıda tekrar. Tek fark, örnek sayısı. Antrenmanı başlat ve iki masayı karşılaştır.</p>
      <p>Sonra kaydırıcıyla mantı sayısını değiştirip yeniden antrenman yap: <b>16</b> ve <b>32</b>'yi dene. Her denemen aşağıdaki tabloya yazılır. Sınav puanı kaç mantıdan sonra %90'ı geçiyor? Bunu bulmak senin deneyin.</p>
      ${teacher('<p>Örnek sayısı arttıkça veriye uyan hipotezlerin kümesi daralır ve model gerçek kurala yaklaşmak zorunda kalır. Kaydırıcı havuzun ilk n mantısını kullanır; sonuçlar (antrenman / sınav): 4: %100 / %81 · 6: %100 / %78 · 8: %100 / %78 · 16: %100 / %81 · 20: %100 / %84 · 24: %100 / %81 · 32: %100 / %94 · 48 ve 64: %100 / %100. 4 ile 24 arasında sınav puanı %78–84 civarında oynar: az örnekte hangi mantıların seçildiği sayıdan daha çok etkiler (Bölüm 3). Sıçrama 32\'de gelir. Genelleme için modelin kapasitesiyle veri miktarı dengeli olmalıdır; büyük dil modellerinin trilyonlarca kelimeyle eğitilmesinin nedeni de budur.</p>')}`,
    focus: 'overview',
    say: 'Bu sefer ezberleyemem, çok fazlalar. Öğrenmem lazım!',
    mood: 'thinking',
    action: 'Antrenman başlasın!',
    secondary: 'Her şeyi unut',
    stats: true,
    controls: `<div class="sliders"><label>Mantı sayısı <input type="range" id="sl-count" min="4" max="64" value="64" step="1" /><output id="out-count">64</output></label></div>`,
    enter(c) {
      c.setNoise(false);
      c.setCount(64);
      c.resetNet(true);
      c.showTest(true);
      c.network.setWeightsVisible(true);
      c.updateStats();
      if (c.runs.length) c.readout(`<span class="big">Deney tablosu</span>Şimdiye kadarki antrenmanların. 64 mantıyla başlat, sonra kaydırıcıyla dene.${c.runsTable()}`);
      const sl = c.$('#sl-count');
      const out = c.$('#out-count');
      sl.addEventListener('input', () => {
        out.textContent = sl.value;
        c.stopTraining();
        c.setCount(Number(sl.value));
        c.resetNet(true);
        c.updateStats();
      });
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
    id: 'yanlis',
    label: 'Yanlış etiket',
    title: 'Deney 3: Dalgın usta yanlış etiketlemiş',
    body: `
      <p>Bu sefer 64 mantı var ama bir sorun var: dalgın usta mantıların <b>dörtte birine yanlış etiket</b> yapıştırmış. Kıvamındakilere "olmamış", olmamışlara "kıvamında" demiş. Masaya bak: <span class="purple">mor halkalı</span> 16 mantının etiketi yanlış; şeridin dışında pembe, içinde sarı kalanlar onlar.</p>
      <p>Bıdık bunları da doğru sanıp öğrenmeye çalışacak. Sence ne olur? Antrenmanı başlat; iki masadaki puanları önceki deneyle karşılaştır.</p>
      ${teacher('<p><b>Etiket gürültüsü</b>: eğitim verisinin %25\'inde etiket ters çevrilmiştir (belirli tohumla, her seferinde aynı mantılar). Model çelişkili örnekleri uzlaştırmaya çalışır; hem eğitim hem test doğruluğu düşer, karar sınırı bozulur. Bu deneyde 64 örneğin 16\'sı ters etiketlidir (masada mor halkalı); sonuç eğitimde %67 (43/64), testte %81 (26/32). Test puanının eğitimden yüksek çıkması şaşırtıcı değildir: eğitim doğruluğu ustanın <i>yanlış</i> etiketlerine göre ölçülür (kuralı kusursuz öğrenen bir model bile en fazla %75 alır), test ise doğru etiketlerle ölçülür. Model 16 ters etiketin 10\'unu olduğu gibi öğrenmiştir, yani hatayı ezberlemiştir. Ders: modelin kalitesi verinin kalitesini geçemez ("çöp girer, çöp çıkar"). Gerçek projelerde veri temizliği ve etiket denetimi bu yüzden zaman alır.</p>')}`,
    focus: 'train',
    say: 'Şu pembe mantı şeridin çok dışında… Usta, emin misin?',
    mood: 'worried',
    action: 'Antrenman başlasın!',
    secondary: 'Etiketleri düzelt',
    stats: true,
    enter(c) {
      c.setCount(64);
      c.setNoise(true);
      c.resetNet(true);
      c.showTest(true);
      c.network.setWeightsVisible(true);
      c.updateStats();
    },
    act(c) {
      c.toggleTraining();
    },
    act2(c) {
      c.stopTraining();
      const now = !c.noisy;
      c.setNoise(now);
      c.resetNet(true);
      c.updateStats();
      c.setAction2(now ? 'Etiketleri düzelt' : 'Ustayı yine dalgınlaştır');
      c.say(now ? 'Etiketler yine karıştı!' : 'Oh, etiketler düzeldi. Şimdi tekrar deneyeyim!', 3);
    },
    exit(c) {
      c.stopTraining();
      c.setNoise(false);
    },
  },
  {
    id: 'ozet',
    label: 'Bilgi testi',
    title: 'Bilgi testi: ezber mi, öğrenme mi?',
    body: `
      <p>Üç deney yaptık. Önce hatırlayalım:</p>
      <ol class="cycle">
        <li><b>Sınav masası</b><span>Hiç görülmemiş mantılar: ezberi yakalamanın tek yolu.</span></li>
        <li><b>6 mantı</b><span>Antrenmanda %100, sınavda %78: ezber.</span></li>
        <li><b>32–64 mantı</b><span>Sınavda da %94–100: öğrenme.</span></li>
        <li><b>Yanlış etiket</b><span>İki masada da puan düştü; Bıdık hataları da ezberledi.</span></li>
      </ol>
      <p>Şimdi altı kısa soru; her soruda tek bir doğru cevap var:</p>
      <div class="quiz" id="quiz"></div>
      ${teacher('<p>Özet: (1) Eğitim ve test kümeleri ayrılır; test verisi eğitimde kullanılmaz. (2) Az veri + esnek model = aşırı öğrenme: eğitimde yüksek, testte düşük başarı. (3) Daha çok ve çeşitli veri genellemeyi iyileştirir. (4) Yanlış etiketler modeli bozar; veri kalitesi model kalitesini sınırlar.</p>')}`,
    focus: 'overview',
    say: 'Artık ezberle öğrenmeyi karıştırmıyorum. Ya sen?',
    mood: 'proud',
    quiz: true,
    enter(c) {
      c.setNoise(false);
      c.setCount(64);
      c.showTest(true);
      c.network.setWeightsVisible(true);
      // a clean, fully trained Bıdık behind the quiz (the noisy run stays in chapter 5)
      c.resetNet(true);
      c.trainSilently(600);
      c.updateStats();
    },
  },
];

export const QUIZ = [
  {
    q: 'Sınav masasındaki mantıları Bıdık\'a antrenmanda neden göstermedik?',
    options: ['Antrenman daha kısa sürsün diye', 'Ezberleyip ezberlemediğini anlamak için', 'Sınav mantıları daha zor olduğu için'],
    answer: 1,
    why: 'Doğru! Gördüğü mantıları ezberlemiş olabilir; hiç görmediği mantılarda da başarılıysa gerçekten öğrenmiştir.',
    nope: 'Hayır. Sınav mantıları ne daha zor ne de süre için saklandı; amaç Bıdık\'ın ezberleyip ezberlemediğini anlamaktı.',
  },
  {
    q: '6 mantıyla antrenman yapınca ne oldu?',
    options: ['İki masada da düşük puan aldı', 'İki masada da tam puan aldı', 'Antrenmanda tam puan, sınavda düşük puan aldı'],
    answer: 2,
    why: 'Aynen! Altı mantıyı ezberledi (%100) ama kuralı öğrenemedi; sınavda %78\'de kaldı.',
    nope: 'Tekrar düşün: antrenman masasında hepsini bildi ama sınav masasında 7 yanlış yaptı.',
  },
  {
    q: 'Bir yapay zeka antrenmanda %100, sınavda %70 alıyor. Ne düşünürsün?',
    options: ['Antrenman masasını ezberlemiş, kuralı öğrenmemiş', 'Sınavda şanssızlık olmuş; bir daha sınasak %100 alır', 'Çok iyi öğrenmiş; %70 de yüksek bir puan'],
    answer: 0,
    why: 'Bildin! Antrenmanla sınav arasındaki büyük fark ezberin işaretidir.',
    nope: 'Hayır. Asıl ipucu iki puan arasındaki fark: antrenmanda kusursuz, yeni mantılarda zayıfsa ezberlemiştir.',
  },
  {
    q: 'Ezberi azaltmanın en iyi yolu hangisi?',
    options: ['Daha çok ve çeşitli mantıyla antrenman yapmak', 'Aynı 6 mantıya daha çok kez baktırmak', 'Sınav masasındaki mantıları da antrenmana katmak'],
    answer: 0,
    why: 'Evet! 32 mantıyla sınav puanı %94\'e, 48 ve 64 mantıyla %100\'e çıktı.',
    nope: 'Hayır. Aynı 6 mantıya daha çok bakmak ezberi güçlendirir; sınav mantılarını antrenmana katarsak da sınav artık hiçbir şey ölçmez. Çare: daha çok ve çeşitli örnek.',
  },
  {
    q: 'Dalgın usta etiketlerin dörtte birini yanlış yazınca ne oldu?',
    options: ['Bıdık yanlış etiketleri fark edip düzeltti', 'İki masada da puan düştü; yanlışların bir kısmını ezberledi', 'Yalnızca antrenman masası etkilendi, sınavda yine %100 aldı'],
    answer: 1,
    why: 'Doğru! Antrenmanda %67, sınavda %81 aldı; 16 yanlış etiketin 10\'unu olduğu gibi ezberledi.',
    nope: 'Hayır. Bıdık yanlış etiketleri fark edemez, onları da doğru sanar; iki masada da puanı düştü.',
  },
  {
    q: 'Bir yapay zekanın ne kadar iyi öğreneceğini en çok ne belirler?',
    options: ['Antrenmanda aldığı puan', 'Ne kadar hızlı bir bilgisayarda çalıştığı', 'Örneklerinin sayısı, çeşitliliği ve doğruluğu'],
    answer: 2,
    why: 'Aynen! Çok, çeşitli ve doğru örnek olmadan en iyi model bile öğrenemez.',
    nope: 'Hayır. Antrenman puanı yanıltabilir, hız da öğrenmeyi değiştirmez; modelin öğrenebileceği şey verisinin sayısı, çeşitliliği ve doğruluğuyla sınırlı.',
  },
];
