(() => {
  const install = regions => {
    let added=0;
    for(const region of regions)for(const item of region.items)if(item.noteEn)item.noteEn=item.noteEn.replace(/^A a /,'A ');
    // Shared Japanese and an Okinawa-main-island greeting were previously
    // presented as attested island speech. Keep their identities, clarify scope.
    const shared=['ありがとう、助かったよ','元気ね？','またね、気をつけて'];
    for(const region of regions.filter(r=>['amami','miyakojima','yaeyama'].includes(r.id))){
      for(const item of region.items){
        if(item.phrase==='めんそーれ、ゆっくりしてね'){
          Object.assign(item,{currentUse:'reference',verified:false,sourceLevel:'shared',note:'沖縄本島の歓迎語を含む学習例。この島の固有語や現代使用を確認した例ではありません。',noteEn:'A teaching example containing an Okinawa-main-island greeting. Native island-language use and present-day local use are not verified.'});
        }else if(shared.includes(item.phrase)){
          Object.assign(item,{currentUse:'reference',verified:false,sourceLevel:'shared',note:'共通の日本語による学習例。この島に固有のことばとして確認した例ではありません。',noteEn:'A teaching example in shared Japanese, not a verified expression specific to this island language.'});
        }
      }
    }
    for(const row of window.KotobaRegionalAdditions||[]){
      const region=regions.find(r=>r.id===row.region);
      if(!region||region.items.some(i=>i.phrase===row.phrase))continue;
      const {region:regionId,sourceUrl,sourceTitle,...item}=row;
      region.items.push({...item,verified:true,evidenceScope:'local',currentUse:row.currentUse||'reference',evidence:{label:sourceTitle,labelEn:'Local dialect reference',url:sourceUrl,area:row.region==='kitakyushu'&&row.phrase==='グラグラ'?'九州北部（福岡・佐賀・大分）':row.scopeJa||region.name,areaEn:row.region==='kitakyushu'&&row.phrase==='グラグラ'?row.noteEn:row.scopeEn||region.en,generation:'資料で確認した語彙。現在の使用は話者・世代・場面で異なります。',generationEn:'Vocabulary documented in a local reference. Present-day use varies by speaker, generation, and situation.'},learningExample:true});
      added++;
    }
    return added;
  };
  window.KotobaRegionalContent={install};
})();
