(() => {
  const synth = window.speechSynthesis;
  let queue = [], position = 0, session = 0, state = 'idle', media = null, utterance = null, callbacks = {}, pending = null;
  let rate = .85, voices = [], voiceA = '', voiceB = '';
  try { const saved = JSON.parse(localStorage.getItem('kotoba-audio-settings') || '{}'); rate = [.65,.85,1].includes(saved.rate) ? saved.rate : .85; voiceA = saved.voiceA || ''; voiceB = saved.voiceB || ''; } catch {}
  const label = (ja,en) => window.KotobaI18n?.text(ja,en) ?? (document.documentElement.lang === 'en' ? en : ja);
  const hash = text => { let n = 2166136261; for (const c of text) { n ^= c.codePointAt(0); n = Math.imul(n,16777619); } return (n >>> 0).toString(16).padStart(8,'0'); };
  const phraseId = (text,region) => `phrase-${region || 'common'}-${hash(text)}`;
  const approvedFile = id => { const f = window.KotobaAudioFiles?.[id]; return f?.reviewed === true && typeof f.src === 'string' && /^(assets\/audio\/|https:\/\/)/.test(f.src) ? f : null; };
  const emit = (message = '') => { document.dispatchEvent(new CustomEvent('kotoba-audio',{detail:{state,position,total:queue.length,message,segment:queue[position] || null}})); };
  function stop() { session++; clearTimeout(pending); pending = null; if(media) { media.pause(); media.removeAttribute('src'); media.load(); media = null; } synth?.cancel(); utterance = null; state = 'idle'; callbacks.onStop?.(); callbacks = {}; queue = []; position = 0; emit(); }
  function play(segments, hooks = {}) { stop(); if(!segments.length) return; queue = segments; callbacks = hooks; state = 'playing'; run(session); }
  function finish() { state = 'idle'; const done = callbacks.onEnd; callbacks = {}; emit(label('再生が終わりました','Playback finished')); done?.(); }
  function advance(token) { if(token !== session) return; position++; if(position >= queue.length) return finish(); pending = setTimeout(() => { pending = null; if(state === 'playing') run(token); }, 450); }
  function fail(token, message) { if(token !== session) return; state = 'idle'; emit(message); callbacks.onError?.(message); callbacks = {}; }
  function run(token, forceTTS = false) {
    if(token !== session || state !== 'playing') return;
    const seg = queue[position]; if(!seg) return finish();
    callbacks.onSegment?.(position,seg); const file = !forceTTS && approvedFile(seg.id);
    if(file) {
      const slow = rate <= .65 && typeof file.slowSrc === 'string' && /^(assets\/audio\/|https:\/\/)/.test(file.slowSrc);
      media = new Audio(slow ? file.slowSrc : file.src); media.playbackRate = slow ? 1 : rate; state = 'playing'; emit(label('音声ファイルを再生中','Playing an audio recording'));
      media.onended = () => { media = null; advance(token); };
      media.onerror = () => { if(token !== session) return; media = null; run(token,true); };
      media.play().catch(() => { if(token !== session) return; media = null; run(token,true); }); return;
    }
    if(!synth || !window.SpeechSynthesisUtterance) return fail(token,label('このブラウザでは読み上げを使えません。日本語音声対応のブラウザで開いてください。','Speech is unavailable in this browser. Use a browser with Japanese speech support.'));
    utterance = new SpeechSynthesisUtterance(seg.text); utterance.lang = 'ja-JP'; utterance.rate = rate;
    const chosen = seg.speaker === 'B' ? voiceB : voiceA;
    const voice = voices.find(v=>v.voiceURI === chosen) || voices[seg.speaker === 'B' && voices.length > 1 ? 1 : 0];
    if(voice) utterance.voice = voice;
    utterance.onstart = () => { if(token === session) emit(label('標準的な日本語の読み上げを再生中','Playing standard Japanese text-to-speech')); };
    utterance.onend = () => { utterance = null; advance(token); };
    utterance.onerror = e => { if(!['canceled','interrupted'].includes(e.error)) fail(token,label('読み上げを開始できませんでした。端末の日本語音声を確認して、もう一度「聞く」を押してください。','Speech could not start. Check your device’s Japanese voice and press Listen again.')); };
    synth.speak(utterance); emit(label('読み上げを準備中','Preparing speech'));
  }
  function pause() { if(state !== 'playing') return; state = 'paused'; media ? media.pause() : synth?.pause(); emit(); }
  function resume() { if(state !== 'paused') return; state = 'playing'; if(media) media.play().catch(()=>fail(session,label('再生できませんでした。','Playback failed.'))); else if(utterance) synth?.resume(); else run(session); emit(); }
  function loadVoices() { voices = (synth?.getVoices() || []).filter(v=>/^ja(?:-|_)?/i.test(v.lang)); document.dispatchEvent(new CustomEvent('kotoba-voices')); }
  function setSettings(settings) { stop(); if(settings.rate) rate = Number(settings.rate); if('voiceA' in settings) voiceA = settings.voiceA; if('voiceB' in settings) voiceB = settings.voiceB; try{ localStorage.setItem('kotoba-audio-settings',JSON.stringify({rate,voiceA,voiceB})); }catch{} }
  window.KotobaAudio = {play,stop,pause,resume,phraseId,approvedFile,setSettings,get voices(){return voices;},get state(){return state;},get settings(){return {rate,voiceA,voiceB};},say(text,{region='common',speaker='A',id}={}){play([{id:id || phraseId(text,region),text,speaker}]);}};
  if(synth?.addEventListener) synth.addEventListener('voiceschanged',loadVoices); loadVoices();
  document.addEventListener('visibilitychange',()=>{if(document.hidden) pause();});
  window.addEventListener('pagehide',stop);
})();
