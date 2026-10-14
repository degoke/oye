import { videoMessages } from './video-messages.js';
import { demoMessages } from './demo-messages.js';
import { objectiveMessages } from './objective-messages.js';
import { voiceMessages } from './voice-messages.js';
import { speechMessages } from './speech-messages.js';
import type { Language } from './preferences.js';

// Generated translations are reviewed and checked in as static interface copy.
export const messages: Record<string, { yo: string; ha: string; ig: string }> = {
  ...objectiveMessages,
  ...demoMessages,
  ...videoMessages,
  ...speechMessages,
  ...voiceMessages,
  ". This partial answer is not used in later conversation context.": {
    "yo": "A kò ní lo ìdáhùn àìpé yìí nínú ìjíròrò tó tẹ̀ lé.",
    "ha": ". Ba a amfani da wannan amsar da ba ta cika ba a sauran tattaunawar.",
    "ig": "A naghị eji azịza a na-ezughị ezu n’ime mkparịta ụka ndị na-esote."
  },
  "10 minutes": {
    "yo": "Ìṣẹ́jú 10",
    "ha": "Minti 10",
    "ig": "Nkeji 10"
  },
  "20 minutes": {
    "yo": "Ìṣẹ́jú 20",
    "ha": "Minti 20",
    "ig": "Nkeji 20"
  },
  "30 minutes": {
    "yo": "Ìṣẹ́jú 30",
    "ha": "Minti 30",
    "ig": "Nkeji 30"
  },
  "5 minutes": {
    "yo": "Ìṣẹ́jú 5",
    "ha": "Minti 5",
    "ig": "Nkeji 5"
  },
  "A closer look": {
    "yo": "Ṣàyẹ̀wò dáadáa",
    "ha": "Duba dalla-dalla",
    "ig": "Ilele ya nke ọma"
  },
  "A concept to understand": {
    "yo": "Èrò kan láti lóye",
    "ha": "Wani ra’ayi da za a fahimta",
    "ig": "Echiche ị ga-aghọta"
  },
  "A few questions to shape your learning. It's fine to be unsure.": {
    "yo": "Àwọn ìbéèrè díẹ̀ láti mú ẹ̀kọ́ rẹ bá àìní rẹ mu. Ó dáa bí o kò bá dá ọ lójú.",
    "ha": "Wasu ’yan tambayoyi don tsara koyonku. Ba laifi idan ba ku da tabbaci.",
    "ig": "Ajụjụ ole na ole ga-enyere aka ịhazi mmụta gị. Ọ dị mma ma ị maghị azịza ya."
  },
  "A little help, whenever you need it.": {
    "yo": "Ìrànlọ́wọ́ díẹ̀ nígbàkigbà tí o bá nílò rẹ̀.",
    "ha": "Ƙaramin taimako, duk lokacin da kuke buƙata.",
    "ig": "Obere enyemaka, mgbe ọ bụla ịchọrọ ya."
  },
  "A new question": {
    "yo": "Ìbéèrè tuntun",
    "ha": "Sabuwar tambaya",
    "ig": "Ajụjụ ọhụrụ"
  },
  "A question, a topic, a little curiosity…": {
    "yo": "Ìbéèrè kan, kókó kan, ìfẹ́ láti mọ̀ díẹ̀…",
    "ha": "Tambaya, batu, ko ɗan sha’awa…",
    "ig": "Ajụjụ, isiokwu, ma ọ bụ obere ọchịchọ ịmata ihe…"
  },
  "A useful place to start": {
    "yo": "Ibi tó dára láti bẹ̀rẹ̀",
    "ha": "Wuri mai amfani don farawa",
    "ig": "Ebe bara uru ịmalite"
  },
  "Answer each question or choose \"I don't know yet\".": {
    "yo": "Dáhùn gbogbo ìbéèrè tàbí yan \"Mi ò tíì mọ̀\".",
    "ha": "Ku amsa kowace tambaya ko ku zaɓi “Ban sani ba tukuna.”",
    "ig": "Zaa ajụjụ nke ọ bụla ma ọ bụ họrọ “Amabeghị m.”"
  },
  "Answer the saved follow-up question.": {
    "yo": "Dáhùn ìbéèrè àfikún tí a ti fipamọ́.",
    "ha": "Ku amsa tambayar bin diddigi da aka adana.",
    "ig": "Zaa ajụjụ sochirinụ e chekwara."
  },
  "Answers save when you continue. You can come back later.": {
    "yo": "A máa ń fipamọ́ àwọn ìdáhùn rẹ nígbà tí o bá tẹ̀ síwájú. O lè padà wá lẹ́yìn náà.",
    "ha": "Ana adana amsoshinku idan kun ci gaba. Za ku iya dawowa daga baya.",
    "ig": "A na-echekwa azịza gị ka ị na-aga n’ihu. Ị nwere ike ịlaghachi ma emechaa."
  },
  "Ask a new question": {
    "yo": "Béèrè ìbéèrè tuntun",
    "ha": "Ku yi sabuwar tambaya",
    "ig": "Jụọ ajụjụ ọhụrụ"
  },
  "Ask a question or explore an example, in your language.": {
    "yo": "Béèrè ìbéèrè kan tàbí ṣàyẹ̀wò àpẹẹrẹ kan ní èdè rẹ.",
    "ha": "Ku yi tambaya ko ku binciki misali cikin harshenku.",
    "ig": "Jụọ ajụjụ ma ọ bụ nyochaa ihe atụ n’asụsụ gị."
  },
  "Ask the tutor about this lesson": {
    "yo": "Béèrè lọ́wọ́ olùkọ́ nípa ẹ̀kọ́ yìí",
    "ha": "Ku tambayi malami game da wannan darasi",
    "ig": "Jụọ onye nkụzi gbasara ihe mmụta a"
  },
  "Ask what is puzzling you. We can take it one idea at a time.": {
    "yo": "Béèrè nípa ohun tó ń da ọ lójú. A lè jíròrò èrò kan lẹ́ẹ̀kọ̀ọ̀kan.",
    "ha": "Ku tambayi abin da ya rikita ku. Za mu iya bin ra’ayi ɗaya bayan ɗaya.",
    "ig": "Jụọ maka ihe na-agbagwoju gị anya. Anyị nwere ike ile otu echiche anya n’otu oge."
  },
  "Assessment progress": {
    "yo": "Ìlọsíwájú àyẹ̀wò",
    "ha": "Ci gaban tantancewa",
    "ig": "Ọganihu nyocha"
  },
  "Automated language review. Native-speaker review is pending.": {
    "yo": "Àtúnyẹ̀wò èdè aládàáṣiṣẹ́. A ṣì ń dúró de àtúnyẹ̀wò láti ọ̀dọ̀ agbọ̀rọ̀sọ ìbílẹ̀.",
    "ha": "Binciken harshe na atomatik. Ana jiran bita daga mai magana da harshen tun asali.",
    "ig": "Nnyocha asụsụ nke igwe mere. A ka na-eche nyocha onye na-asụ asụsụ a dịka asụsụ mbụ ya."
  },
  "Back": {
    "yo": "Padà",
    "ha": "Koma",
    "ig": "Laghachi"
  },
  "Back to learning": {
    "yo": "Padà sí ẹ̀kọ́",
    "ha": "Koma zuwa koyo",
    "ig": "Laghachi n’ịmụ ihe"
  },
  "Cancel preparation": {
    "yo": "Fagilé ìmúrasílẹ̀",
    "ha": "Soke shiri",
    "ig": "Kagbuo nkwadebe"
  },
  "Check my application": {
    "yo": "Ṣàyẹ̀wò ìwé-ẹ̀bẹ̀ mi",
    "ha": "Duba buƙatata",
    "ig": "Lelee akwụkwọ anamachọihe m"
  },
  "Check your choices and try again.": {
    "yo": "Ṣàyẹ̀wò àwọn àṣàyàn rẹ kí o sì tún gbìyànjú.",
    "ha": "Ku duba zaɓuɓɓukanku sannan ku sake gwadawa.",
    "ig": "Lelee nhọrọ gị ma nwaa ọzọ."
  },
  "Checking your translated questions and learning goals.": {
    "yo": "A ń ṣàyẹ̀wò àwọn ìbéèrè tí a túmọ̀ àti àwọn góńgó ẹ̀kọ́ rẹ.",
    "ha": "Ana duba tambayoyinku da aka fassara da manufofin koyonku.",
    "ig": "A na-enyocha ajụjụ ndị a sụgharịrị na ebumnuche mmụta gị."
  },
  "Choose a live learning journey to generate a lesson.": {
    "yo": "Yan ìrìnàjò ẹ̀kọ́ tó ń lọ lọ́wọ́lọ́wọ́ láti ṣẹ̀dá ẹ̀kọ́ kan.",
    "ha": "Ku zaɓi tafiyar koyo mai gudana don samar da darasi.",
    "ig": "Họrọ njem mmụta na-aga ugbu a iji mepụta ihe mmụta."
  },
  "Choose an available answer or say you are unsure.": {
    "yo": "Yan ìdáhùn tó wà, tàbí sọ pé o kò dá ọ lójú.",
    "ha": "Zaɓi amsar da ke akwai ko ka ce ba ka da tabbaci.",
    "ig": "Họrọ azịza dịnụ ma ọ bụ kwuo na i jighị n'aka."
  },
  "Choose one of the available answers.": {
    "yo": "Yan ọ̀kan lára àwọn ìdáhùn tó wà.",
    "ha": "Zaɓi ɗaya daga cikin amsoshin da ake da su.",
    "ig": "Họrọ otu n'ime azịza ndị dịnụ."
  },
  "Choose something to learn": {
    "yo": "Yan ohun kan láti kọ́.",
    "ha": "Zaɓi abin da za ka koya",
    "ig": "Họrọ ihe ị ga-amụta"
  },
  "Clear history": {
    "yo": "Pa ìtàn rẹ́.",
    "ha": "Goge tarihi",
    "ig": "Kpochapụ akụkọ"
  },
  "Clear my demo history": {
    "yo": "Pa ìtàn àpẹẹrẹ mi rẹ́.",
    "ha": "Goge tarihin demo ɗina",
    "ig": "Kpochapụ akụkọ ngosi m"
  },
  "Clear your learning history?": {
    "yo": "Pa ìtàn ẹ̀kọ́ rẹ́?",
    "ha": "Kana son a goge tarihin koyonka?",
    "ig": "Ị chọrọ ikpochapụ akụkọ mmụta gị?"
  },
  "Complete your starting questions first.": {
    "yo": "Kọ́kọ́ parí àwọn ìbéèrè ìbẹ̀rẹ̀ rẹ.",
    "ha": "Da farko, kammala tambayoyin farawa.",
    "ig": "Buru ụzọ zaa ajụjụ mmalite gị niile."
  },
  "Confirm answer": {
    "yo": "Fìdí ìdáhùn múlẹ̀.",
    "ha": "Tabbatar da amsa",
    "ig": "Kwenye azịza"
  },
  "Continue conversation": {
    "yo": "Tẹ̀ síwájú nínú ìjíròrò.",
    "ha": "Ci gaba da tattaunawa",
    "ig": "Gaa n'ihu na mkparịta ụka"
  },
  "Continue learning": {
    "yo": "Tẹ̀ síwájú nínú ẹ̀kọ́.",
    "ha": "Ci gaba da koyo",
    "ig": "Gaa n'ihu n'ịmụ ihe"
  },
  "Conversation sources": {
    "yo": "Àwọn orísun ìjíròrò.",
    "ha": "Majiyoyin tattaunawa",
    "ig": "Isi mmalite mkparịta ụka"
  },
  "Could not connect. Check your connection and try again.": {
    "yo": "Kò ṣeé ṣe láti so pọ̀. Ṣàyẹ̀wò ìsopọ̀ rẹ kí o sì tún gbìyànjú.",
    "ha": "Ba a iya haɗawa ba. Duba haɗin intanet ɗinka ka sake gwadawa.",
    "ig": "Enweghị ike ijikọ. Lelee njikọ gị ma nwaa ọzọ."
  },
  "Development example": {
    "yo": "Àpẹẹrẹ ìdàgbàsókè.",
    "ha": "Misalin ci gaba",
    "ig": "Ihe atụ mmepe"
  },
  "Development examples are disabled.": {
    "yo": "A ti pa àwọn àpẹẹrẹ ìdàgbàsókè.",
    "ha": "An kashe misalan ci gaba.",
    "ig": "Agbanyụrụ ihe atụ mmepe."
  },
  "Earlier evidence: {before}. Latest usable evidence: {after}.": {
    "yo": "Ẹ̀rí ìṣáájú: {before}. Ẹ̀rí tuntun tó ṣeé lò: {after}.",
    "ha": "Shaidar baya: {before}. Shaida mafi sabuwa da za a iya amfani da ita: {after}.",
    "ig": "Ihe akaebe mbụ: {before}. Ihe akaebe kacha ọhụrụ a pụrụ iji: {after}."
  },
  "Earlier explanation {number}": {
    "yo": "Àlàyé tó ṣáájú {number}",
    "ha": "Bayani na baya {number}",
    "ig": "Nkọwa mbụ {number}"
  },
  "Every journey starts with a question.": {
    "yo": "Gbogbo ìrìnàjò bẹ̀rẹ̀ pẹ̀lú ìbéèrè kan.",
    "ha": "Kowace tafiya tana farawa da tambaya.",
    "ig": "Ụzọ njem ọ bụla na-amalite site n'ajụjụ."
  },
  "Evidence is limited. This finding cannot demonstrate understanding.": {
    "yo": "Ẹ̀rí kò tó. Àbájáde yìí kò lè fi òye hàn.",
    "ha": "Shaidar ba ta wadatar ba. Wannan sakamako ba zai iya nuna fahimta ba.",
    "ig": "Ihe akaebe dị ụkọ. Nchọpụta a enweghị ike igosi nghọta."
  },
  "Expand the saved attempts to compare your words and feedback.": {
    "yo": "Ṣí àwọn ìgbìyànjú tí a fipamọ́ sílẹ̀ láti fi àwọn ọ̀rọ̀ rẹ àti àbá wé ara wọn.",
    "ha": "Faɗaɗa jerin ƙoƙarin da aka adana don kwatanta kalmominka da martanin da aka ba ka.",
    "ig": "Gbasaa mbọ ndị echekwara ka i jiri okwu gị na nzaghachi tụnyere."
  },
  "Explain Back is not configured yet.": {
    "yo": "A kò tíì ṣètò iṣẹ́ Ṣàlàyé Padà.",
    "ha": "Ba a saita Explain Back ba tukuna.",
    "ig": "A hazibeghị Explain Back."
  },
  "Explain Back is unavailable.": {
    "yo": "Iṣẹ́ Ṣàlàyé Padà kò sí lọ́wọ́lọ́wọ́.",
    "ha": "Ba a samu Explain Back ba.",
    "ig": "Explain Back adịghị ugbu a."
  },
  "Explain again with what you learned": {
    "yo": "Ṣàlàyé lẹ́ẹ̀kan sí i pẹ̀lú ohun tí o ti kọ́.",
    "ha": "Sake yin bayani da abin da ka koya",
    "ig": "Kọwaa ya ọzọ site n'ihe ị mụtara"
  },
  "Explain it in your words": {
    "yo": "Ṣàlàyé rẹ̀ ní ọ̀rọ̀ tìrẹ.",
    "ha": "Bayyana shi da kalmominka",
    "ig": "Jiri okwu nke gị kọwaa ya"
  },
  "Explain more simply": {
    "yo": "Ṣàlàyé rẹ̀ lọ́nà tó rọrùn sí i.",
    "ha": "Yi bayani a sauƙaƙe",
    "ig": "Kọwaa ya n'ụzọ dị mfe karị"
  },
  "Explain the idea in your own words.": {
    "yo": "Ṣàlàyé èrò náà ní ọ̀rọ̀ tìrẹ.",
    "ha": "Bayyana ra'ayin da kalmominka.",
    "ig": "Jiri okwu nke gị kọwaa echiche ahụ."
  },
  "Failed reply": {
    "yo": "Ìdáhùn kò já sí rere.",
    "ha": "An kasa samar da amsa",
    "ig": "Nzaghachi dara ada"
  },
  "Find my starting point": {
    "yo": "Wá ibi ìbẹ̀rẹ̀ mi.",
    "ha": "Nemo inda zan fara",
    "ig": "Chọta ebe m ga-amalite"
  },
  "Find my starting point first": {
    "yo": "Kọ́kọ́ wá ibi ìbẹ̀rẹ̀ mi.",
    "ha": "Da farko, nemo inda zan fara",
    "ig": "Buru ụzọ chọta ebe m ga-amalite"
  },
  "Finding sources and shaping your starting questions.": {
    "yo": "Wíwá àwọn orísun àti ṣíṣe àgbékalẹ̀ àwọn ìbéèrè ìbẹ̀rẹ̀ rẹ.",
    "ha": "Neman majiyoyi da tsara tambayoyinku na farko.",
    "ig": "Ịchọta isi mmalite na ịhazi ajụjụ mmalite gị."
  },
  "Finish or skip your starting questions first.": {
    "yo": "Kọ́kọ́ parí àwọn ìbéèrè ìbẹ̀rẹ̀ rẹ tàbí fo wọ́n kọjá.",
    "ha": "Da farko, ku kammala tambayoyinku na farko ko ku tsallake su.",
    "ig": "Buru ụzọ mechaa ajụjụ mmalite gị ma ọ bụ hapụ ha."
  },
  "For lessons, questions, and your tutor.": {
    "yo": "Fún àwọn ẹ̀kọ́, ìbéèrè àti olùkọ́ rẹ.",
    "ha": "Don darussa, tambayoyi, da malamin ku.",
    "ig": "Maka nkuzi, ajụjụ na onye nkuzi gị."
  },
  "Give me another example": {
    "yo": "Fún mi ní àpẹẹrẹ mìíràn",
    "ha": "Ku ba ni wani misali",
    "ig": "Nye m ihe atụ ọzọ"
  },
  "Help me practice": {
    "yo": "Ràn mí lọ́wọ́ láti ṣe ìdánrawò",
    "ha": "Ku taimaka mini in yi atisaye",
    "ig": "Nyere m aka ime omume"
  },
  "How does compound interest work?": {
    "yo": "Báwo ni èlé àpapọ̀ ṣe ń ṣiṣẹ́?",
    "ha": "Yaya tsarin ribar da ake samu kan riba yake?",
    "ig": "Kedu ka ọmụrụ nwa a na-agbakọta si arụ ọrụ?"
  },
  "How would you explain the idea?": {
    "yo": "Báwo ni ẹ ṣe máa ṣàlàyé èrò náà?",
    "ha": "Yaya za ku bayyana wannan ra’ayi?",
    "ig": "Kedu ka ị ga-esi kọwaa echiche ahụ?"
  },
  "I don't know yet": {
    "yo": "Mi ò tíì mọ̀",
    "ha": "Ban sani ba tukuna",
    "ig": "Amaghị m ugbu a"
  },
  "I want to build websites": {
    "yo": "Mo fẹ́ ṣẹ̀dá àwọn ojú òpó ayélujára",
    "ha": "Ina son ƙirƙirar shafukan yanar gizo",
    "ig": "Achọrọ m ịrụ saịtị weebụ"
  },
  "I'm not sure yet": {
    "yo": "Mi ò tíì dá mi lójú",
    "ha": "Ban tabbata ba tukuna",
    "ig": "Amachaghị m nke ọma ugbu a"
  },
  "Imagine helping a friend understand this idea. Start with your own explanation. We will ask a short follow-up before offering feedback.": {
    "yo": "Ẹ ronú pé ẹ ń ran ọ̀rẹ́ kan lọ́wọ́ láti lóye èrò yìí. Ẹ bẹ̀rẹ̀ pẹ̀lú àlàyé tiyín. A ó bi yín ní ìbéèrè ìtẹ̀lé kúkúrú kí a tó fún yín ní àbá.",
    "ha": "Ku yi tunanin kuna taimaka wa aboki ya fahimci wannan ra’ayi. Ku fara da bayanin da kanku za ku bayar. Za mu yi wata gajeriyar tambaya ta gaba kafin mu ba da ra’ayi.",
    "ig": "Were ya na ị na-enyere enyi gị aka ịghọta echiche a. Bido site n'ịkọwa ya n'okwu nke gị. Anyị ga-ajụ gị ajụjụ dị mkpirikpi tupu anyị enye nzaghachi."
  },
  "Interrupted reply": {
    "yo": "Ìdáhùn tí a dá dúró",
    "ha": "Amsa da aka katse",
    "ig": "Azịza e kwụsịrị"
  },
  "It's okay to say you are unsure. Your words are saved before feedback.": {
    "yo": "Ó dára láti sọ pé ẹ kò dá yín lójú. A ó fi àwọn ọ̀rọ̀ yín pamọ́ kí a tó fún yín ní àbá.",
    "ha": "Ba laifi idan ba ku da tabbas. Ana adana kalmominku kafin a ba ku ra’ayi.",
    "ig": "Ọ dị mma ikwu na ị maghị nke ọma. A na-echekwa okwu gị tupu nzaghachi."
  },
  "Keep my history": {
    "yo": "Pa ìtàn mi mọ́",
    "ha": "Ku adana tarihina.",
    "ig": "Debe akụkọ mmụta m"
  },
  "Latest explanation": {
    "yo": "Àlàyé tuntun jù lọ",
    "ha": "Bayani na baya-bayan nan",
    "ig": "Nkọwa kacha ọhụrụ"
  },
  "Learn anything. In your language. In your way.": {
    "yo": "Kọ́ ohunkóhun. Ní èdè yín. Ní ọ̀nà yín.",
    "ha": "Ku koyi duk abin da kuke so. A cikin harshenku. Ta yadda kuke so.",
    "ig": "Mụta ihe ọ bụla. N'asụsụ gị. N'ụzọ nke gị."
  },
  "Learning": {
    "yo": "Ẹ̀kọ́",
    "ha": "Koyo",
    "ig": "Mmụta"
  },
  "Learning language": {
    "yo": "Èdè tí ẹ ń kọ́",
    "ha": "Harshen koyo",
    "ig": "Asụsụ mmụta"
  },
  "Learning preferences": {
    "yo": "Àwọn ààyò ẹ̀kọ́",
    "ha": "Zaɓuɓɓukan koyo",
    "ig": "Mmasị mmụta gị"
  },
  "Learning that understands you.": {
    "yo": "Ẹ̀kọ́ tó lóye yín.",
    "ha": "Koyo da ya fahimce ku.",
    "ig": "Mmụta nke na-aghọta gị."
  },
  "Let's find your starting point.": {
    "yo": "Ẹ jẹ́ ká wá ibi ìbẹ̀rẹ̀ yín.",
    "ha": "Mu gano inda za ku fara.",
    "ig": "Ka anyị chọta ebe ị ga-amalite."
  },
  "Let's work through it": {
    "yo": "Ẹ jẹ́ ká ṣiṣẹ́ lórí rẹ papọ̀",
    "ha": "Mu bi matakan tare.",
    "ig": "Ka anyị mụọ ya nke ọma ọnụ"
  },
  "Listen": {
    "yo": "Fetí sílẹ̀",
    "ha": "Saurara",
    "ig": "Gee ntị"
  },
  "Load text first. Download audio and video only when you choose.": {
    "yo": "Ẹ kọ́kọ́ ṣí ọ̀rọ̀ náà. Ẹ ṣe ìgbàsílẹ̀ ohùn àti fídíò nígbà tí ẹ bá yàn wọ́n nìkan.",
    "ha": "Ku loda rubutu da farko. Ku zazzage sauti da bidiyo ne kawai idan kun zaɓa.",
    "ig": "Buru ụzọ bunye ederede. Budata ọdịyo na vidio naanị mgbe ị họọrọ."
  },
  "Loading your conversation…": {
    "yo": "A ń ṣí ìjíròrò yín…",
    "ha": "Ana loda tattaunawarku…",
    "ig": "A na-ebunye mkparịta ụka gị…"
  },
  "Loading your learning…": {
    "yo": "A ń ṣí ẹ̀kọ́ yín…",
    "ha": "Ana loda abubuwan koyonku…",
    "ig": "A na-ebunye mmụta gị…"
  },
  "Loading your preferences": {
    "yo": "A ń ṣí àwọn ààyò yín",
    "ha": "Ana loda zaɓuɓɓukanku",
    "ig": "A na-ebunye ihe ndị masịrị gị"
  },
  "Main navigation": {
    "yo": "Ìtọ́sọ́nà pàtàkì",
    "ha": "Babban menu na kewayawa",
    "ig": "Menu bụ isi"
  },
  "Make a learning journey": {
    "yo": "Ṣẹ̀dá ìrìnàjò ẹ̀kọ́",
    "ha": "Ku ƙirƙiri tafiyar koyo",
    "ig": "Mepụta njem mmụta"
  },
  "Make learning yours.": {
    "yo": "Jẹ́ kí ẹ̀kọ́ bá ọ mu.",
    "ha": "Ku mai da koyo naku.",
    "ig": "Mee ka mmụta bụrụ nke gị."
  },
  "Mobile navigation": {
    "yo": "Ìtọ́sọ́nà lórí fóònù alágbèéká",
    "ha": "Kewayawa ta wayar hannu",
    "ig": "Nnyagharị ekwentị"
  },
  "Next idea to work on:": {
    "yo": "Èrò tó kàn láti ṣiṣẹ́ lé lórí:",
    "ha": "Ra’ayi na gaba da za ku yi aiki a kai:",
    "ig": "Echiche ọzọ ị ga-arụ ọrụ na ya:"
  },
  "Next practice": {
    "yo": "Ìdánrawò tó kàn",
    "ha": "Atisaye na gaba",
    "ig": "Mmega ọzọ"
  },
  "Next question": {
    "yo": "Ìbéèrè tó kàn",
    "ha": "Tambaya ta gaba",
    "ig": "Ajụjụ ọzọ"
  },
  "Open concept": {
    "yo": "Ṣí èrò náà",
    "ha": "Buɗe ra’ayi",
    "ig": "Mepee echiche"
  },
  "Please try again.": {
    "yo": "Jọ̀wọ́, tún gbìyànjú.",
    "ha": "Da fatan za ku sake gwadawa.",
    "ig": "Biko nwaa ọzọ."
  },
  "Practice {current} of {total}. An answer helps us see what to work on next.": {
    "yo": "Ìdánrawò {current} nínú {total}. Ìdáhùn rẹ yóò ràn wá lọ́wọ́ láti mọ ohun tó yẹ ká ṣiṣẹ́ lé lórí lẹ́yìn náà.",
    "ha": "Atisaye {current} cikin {total}. Amsarku za ta taimaka mana mu san abin da za mu yi aiki a kai na gaba.",
    "ig": "Mmega {current} n'ime {total}. Azịza gị ga-enyere anyị aka ịhụ ihe ị ga-arụ ọrụ na ya ọzọ."
  },
  "Preferences could not load": {
    "yo": "A kò lè ṣí àwọn ààyò rẹ.",
    "ha": "Ba a iya loda zaɓuɓɓuka ba",
    "ig": "Enweghị ike ibunye ntọala gị"
  },
  "Preferences saved.": {
    "yo": "A ti fi àwọn ààyò pamọ́.",
    "ha": "An adana zaɓuɓɓukan.",
    "ig": "Echekwara ntọala gị."
  },
  "Preferred format": {
    "yo": "Ọ̀nà tí o fẹ́ràn",
    "ha": "Tsarin da aka fi so",
    "ig": "Ụdị masịrị gị"
  },
  "Preparation paused": {
    "yo": "A dá ìmúrasílẹ̀ dúró",
    "ha": "An dakatar da shiri",
    "ig": "A kwụsịtụrụ nkwadebe"
  },
  "Preparation resumed after a server restart.": {
    "yo": "Ìmúrasílẹ̀ tún bẹ̀rẹ̀ lẹ́yìn tí a tún olupin bẹ̀rẹ̀.",
    "ha": "An ci gaba da shiri bayan an sake kunna sabar.",
    "ig": "A maliteghachiri nkwadebe mgbe ihe nkesa malitegharịrị."
  },
  "Preparation was interrupted. Retrying shortly.": {
    "yo": "Ìmúrasílẹ̀ dáwọ́ dúró. A ó tún gbìyànjú láìpẹ́.",
    "ha": "An katse shirin. Za a sake gwadawa nan ba da daɗewa ba.",
    "ig": "A kwụsịrị nkwadebe n'etiti. A ga-anwale ọzọ n'oge na-adịghị anya."
  },
  "Preparing your language version": {
    "yo": "A ń mú ẹ̀dà èdè rẹ sílẹ̀",
    "ha": "Ana shirya sigar harshenku",
    "ig": "A na-akwadebe ụdị asụsụ gị"
  },
  "Preparing your learning": {
    "yo": "A ń mú ẹ̀kọ́ rẹ sílẹ̀",
    "ha": "Ana shirya karatunku",
    "ig": "A na-akwadebe mmụta gị"
  },
  "Preparing your learning…": {
    "yo": "A ń mú ẹ̀kọ́ rẹ sílẹ̀…",
    "ha": "Ana shirya karatunku…",
    "ig": "A na-akwadebe mmụta gị…"
  },
  "Previous": {
    "yo": "Tẹ́lẹ̀",
    "ha": "Na baya",
    "ig": "Nke gara aga"
  },
  "Progress": {
    "yo": "Ìlọsíwájú",
    "ha": "Ci gaba",
    "ig": "Ọganihu"
  },
  "Question {current} of {total}": {
    "yo": "Ìbéèrè {current} nínú {total}",
    "ha": "Tambaya {current} cikin {total}",
    "ig": "Ajụjụ {current} n'ime {total}"
  },
  "Read": {
    "yo": "Kà",
    "ha": "Karanta",
    "ig": "Gụọ"
  },
  "Read an available lesson before explaining it back.": {
    "yo": "Kà ẹ̀kọ́ tó wà nílẹ̀ kí o tó ṣàlàyé rẹ̀ padà.",
    "ha": "Ku karanta darasin da yake samuwa kafin ku yi bayani a kansa.",
    "ig": "Gụọ ihe ọmụmụ dị tupu ị kọwaa ya n'onwe gị."
  },
  "Read your feedback and try the fresh application.": {
    "yo": "Kà èsì rẹ, kí o sì gbìyànjú ìlò tuntun.",
    "ha": "Ku karanta ra’ayoyin da aka ba ku, sannan ku gwada sabon aikin amfani da ilimi.",
    "ig": "Gụọ nzaghachi gị ma nwalee itinye ihe ị mụtara n'ọrụ ọzọ."
  },
  "Reading support": {
    "yo": "Àtìlẹ́yìn fún kíkà",
    "ha": "Taimakon karatu",
    "ig": "Nkwado n'ịgụ akwụkwọ"
  },
  "Reading your explanation and checking the evidence.": {
    "yo": "A ń ka àlàyé rẹ, a sì ń ṣàyẹ̀wò ẹ̀rí.",
    "ha": "Ana karanta bayaninku tare da duba hujjojin.",
    "ig": "A na-agụ nkọwa gị ma na-enyocha ihe akaebe."
  },
  "Reply stopped. Your question is saved.": {
    "yo": "Ìdáhùn dáwọ́ dúró. A ti fi ìbéèrè rẹ pamọ́.",
    "ha": "An dakatar da amsa. An adana tambayarku.",
    "ig": "Azịza akwụsịla. Echekwara ajụjụ gị."
  },
  "Replying…": {
    "yo": "A ń dáhùn…",
    "ha": "Ana ba da amsa…",
    "ig": "A na-aza…"
  },
  "Resume this concept": {
    "yo": "Tẹ̀síwájú pẹ̀lú kókó yìí.",
    "ha": "Ci gaba da wannan batu",
    "ig": "Gaa n’ihu n’echiche a"
  },
  "Retry preparation": {
    "yo": "Tun ìmúrasílẹ̀ ṣe.",
    "ha": "Sake gwada shiri",
    "ig": "Nwaa nkwadebe ọzọ"
  },
  "Retry reply": {
    "yo": "Tun ìdáhùn gbìyànjú.",
    "ha": "Sake gwada amsa",
    "ig": "Nwaa azịza ọzọ"
  },
  "Revisit this concept or continue your pathway.": {
    "yo": "Ṣe àtúnyẹ̀wò kókó yìí tàbí tẹ̀síwájú ní ipa ẹ̀kọ́ rẹ.",
    "ha": "Ka sake duba wannan batu ko ka ci gaba da tafiyarka ta koyo.",
    "ig": "Laghachi n’echiche a ma ọ bụ gaa n’ihu n’ụzọ mmụta gị."
  },
  "Rubric version {version}. Saved {date}.": {
    "yo": "Ẹ̀dà ìlànà ìṣàyẹ̀wò {version}. A fi pamọ́ ní {date}.",
    "ha": "Sigar ma’aunin kimantawa {version}. An adana {date}.",
    "ig": "Ụdị usoro ntule {version}. Echekwara ya {date}."
  },
  "Save answer": {
    "yo": "Fi ìdáhùn pamọ́",
    "ha": "Ajiye amsa",
    "ig": "Chekwaa azịza"
  },
  "Save explanation": {
    "yo": "Fi àlàyé pamọ́",
    "ha": "Ajiye bayani",
    "ig": "Chekwaa nkọwa"
  },
  "Save starting point": {
    "yo": "Fi ibi ìbẹ̀rẹ̀ pamọ́",
    "ha": "Ajiye wurin farawa",
    "ig": "Chekwaa ebe mmalite"
  },
  "Saved in {language}": {
    "yo": "A ti fi pamọ́ ní {language}.",
    "ha": "An adana a {language}",
    "ig": "Echekwara ya n’asụsụ {language}"
  },
  "Saved practice is separate from demonstrating understanding in your own words.": {
    "yo": "Ìdánrawò tí a fi pamọ́ yàtọ̀ sí fífi òye hàn ní ọ̀rọ̀ tirẹ.",
    "ha": "Atisayen da aka adana ya bambanta da nuna fahimta da kalmominka.",
    "ig": "Ihe omume e chekwara dị iche na igosi nghọta gị n’okwu nke gị."
  },
  "Saving your preferences…": {
    "yo": "A ń fi àwọn ààyò rẹ pamọ́…",
    "ha": "Ana adana zaɓuɓɓukanka…",
    "ig": "A na-echekwa nhọrọ gị…"
  },
  "See what you understand.": {
    "yo": "Wo ohun tí o lóye.",
    "ha": "Duba abin da ka fahimta.",
    "ig": "Lee ihe ị ghọtara."
  },
  "Send question": {
    "yo": "Fi ìbéèrè ránṣẹ́",
    "ha": "Aika tambaya",
    "ig": "Zipụ ajụjụ"
  },
  "Shorter sentences and simpler words": {
    "yo": "Àwọn gbólóhùn kúkúrú sí i àti àwọn ọ̀rọ̀ rọrùn sí i",
    "ha": "Gajerun jimloli da kalmomi mafi sauƙi",
    "ig": "Ahịrịokwu ndị dị mkpụmkpụ na okwu ndị dị mfe karị"
  },
  "Six preparations are already saved. Wait for one to finish before starting another.": {
    "yo": "A ti fi ìmúrasílẹ̀ mẹ́fà pamọ́. Dúró kí ọ̀kan parí kí o tó bẹ̀rẹ̀ òmíràn.",
    "ha": "An riga an adana shirye-shirye shida. Jira ɗaya ya kammala kafin ka fara wani.",
    "ig": "Echekwara nkwadebe isii ugbu a. Chere ka otu gwụ tupu ịmalite nke ọzọ."
  },
  "Skip and start with the basics": {
    "yo": "Foju kọ́ èyí, kí o sì bẹ̀rẹ̀ pẹ̀lú àwọn ìpìlẹ̀.",
    "ha": "Tsallake wannan ka fara da abubuwan asali",
    "ig": "Mafee ma malite n’ihe ndị bụ isi"
  },
  "Skip to content": {
    "yo": "Fo sí àkóónú",
    "ha": "Tsallaka zuwa abun ciki",
    "ig": "Mafee gaa n’ọdịnaya"
  },
  "Something went wrong": {
    "yo": "Ohun kan kò lọ dáadáa.",
    "ha": "Wani abu ya sami matsala",
    "ig": "Ihe adịghị aga nke ọma"
  },
  "Sources for this lesson": {
    "yo": "Àwọn orísun fún ẹ̀kọ́ yìí",
    "ha": "Majiyoyin wannan darasi",
    "ig": "Isi mmalite maka ihe mmụta a"
  },
  "Sources:": {
    "yo": "Àwọn orísun:",
    "ha": "Majiyoyi:",
    "ig": "Isi mmalite:"
  },
  "Standard explanations": {
    "yo": "Àwọn àlàyé boṣewa",
    "ha": "Bayani na yau da kullum",
    "ig": "Nkọwa ndị nkịtị"
  },
  "Start a learning journey to see your progress.": {
    "yo": "Bẹ̀rẹ̀ ìrìnàjò ẹ̀kọ́ láti rí ìlọsíwájú rẹ.",
    "ha": "Fara tafiyar koyo don ganin ci gabanka.",
    "ig": "Malite njem mmụta ka ị hụ ọganihu gị."
  },
  "Start learning": {
    "yo": "Bẹ̀rẹ̀ ẹ̀kọ́",
    "ha": "Fara koyo",
    "ig": "Malite ịmụ ihe"
  },
  "Starting questions": {
    "yo": "Àwọn ìbéèrè ìbẹ̀rẹ̀",
    "ha": "Tambayoyin farawa",
    "ig": "Ajụjụ mmalite"
  },
  "Stop reply": {
    "yo": "Dá ìdáhùn dúró",
    "ha": "Dakatar da amsa",
    "ig": "Kwụsị azịza"
  },
  "Streaming is unavailable.": {
    "yo": "Ìṣàn ìdáhùn kò sí.",
    "ha": "Ba a samun isar da amsa kai tsaye.",
    "ig": "Ịnata azịza nwayọọ nwayọọ adịghị."
  },
  "Supported by the saved learner response.": {
    "yo": "Ó dá lórí ìdáhùn akẹ́kọ̀ọ́ tí a fi pamọ́.",
    "ha": "An dogara da amsar mai koyo da aka adana.",
    "ig": "Ihe onye mmụta zara ma chekwaa na-akwado ya."
  },
  "Teach me photosynthesis": {
    "yo": "Kọ́ mi nípa ìṣẹ̀dá oúnjẹ nípasẹ̀ ìmọ́lẹ̀.",
    "ha": "Koya mini yadda tsirrai ke samar da abinci ta amfani da hasken rana.",
    "ig": "Kụziere m usoro osisi si emepụta nri site n’ìhè anyanwụ"
  },
  "That is correct": {
    "yo": "Èyí tọ́.",
    "ha": "Daidai ne.",
    "ig": "Nke ahụ ziri ezi."
  },
  "The follow-up questions are complete.": {
    "yo": "Àwọn ìbéèrè àfikún ti parí.",
    "ha": "An kammala tambayoyin biyo baya.",
    "ig": "Ajụjụ ndị na-esochi emechala."
  },
  "The learning provider is not configured yet.": {
    "yo": "A kò tíì ṣètò olùpèsè ẹ̀kọ́.",
    "ha": "Ba a saita mai ba da sabis na koyo ba tukuna.",
    "ig": "Ahazibeghị onye na-enye ọrụ mmụta."
  },
  "The reply could not be completed.": {
    "yo": "A kò lè parí ìdáhùn náà.",
    "ha": "Ba a iya kammala amsar ba.",
    "ig": "Enweghị ike imecha nzaghachi ahụ."
  },
  "The reply did not finish.": {
    "yo": "Ìdáhùn náà kò parí.",
    "ha": "Amsar ba ta kammala ba.",
    "ig": "Nzaghachi ahụ emechaghị."
  },
  "The reply was interrupted. You can retry it.": {
    "yo": "A dá ìdáhùn náà dúró. O lè tún gbìyànjú.",
    "ha": "An katse amsar. Za ka iya sake gwadawa.",
    "ig": "A kwụsịrị nzaghachi ahụ. Ị nwere ike ịnwale ọzọ."
  },
  "The tutor provider is not configured.": {
    "yo": "A kò tíì ṣètò olùpèsè olùkọ́.",
    "ha": "Ba a saita mai ba da sabis na koyarwa ba.",
    "ig": "Ahazibeghị onye na-enye ọrụ nkuzi."
  },
  "Thinking…": {
    "yo": "Mo ń ronú…",
    "ha": "Ana tunani…",
    "ig": "Na-eche echiche…"
  },
  "This assessment has already been saved.": {
    "yo": "A ti fipamọ́ àyẹ̀wò yìí tẹ́lẹ̀.",
    "ha": "An riga an adana wannan tantancewar.",
    "ig": "Echekwara nyocha a ugbua."
  },
  "This concept could not be found.": {
    "yo": "A kò rí èrò yìí.",
    "ha": "Ba a sami wannan ra’ayi ba.",
    "ig": "A chọtaghị echiche a."
  },
  "This concept reached the demo limit of 100 explanations.": {
    "yo": "Èrò yìí ti dé ààlà àpẹẹrẹ ti àwọn àlàyé ọgọ́rùn-ún.",
    "ha": "Wannan ra’ayi ya kai iyakar bayanai 100 na gwaji.",
    "ig": "Echiche a eruola oke ngosi nke nkọwa 100."
  },
  "This conversation could not be found.": {
    "yo": "A kò rí ìjíròrò yìí.",
    "ha": "Ba a sami wannan tattaunawar ba.",
    "ig": "A chọtaghị mkparịta ụka a."
  },
  "This demo conversation reached 100 turns. Start a new conversation.": {
    "yo": "Ìjíròrò àpẹẹrẹ yìí ti dé ìyípo 100. Bẹ̀rẹ̀ ìjíròrò tuntun.",
    "ha": "Wannan tattaunawar gwaji ta kai zagaye 100. Fara sabuwar tattaunawa.",
    "ig": "Mkparịta ụka ngosi a eruola ugboro 100 nke ikwu okwu. Bido mkparịta ụka ọhụrụ."
  },
  "This demo has no account. You can return to your learning on this browser while your session is retained.": {
    "yo": "Àpẹẹrẹ yìí kò ní àkáǹtì. O lè padà sí ẹ̀kọ́ rẹ lórí ẹ̀rọ aṣàwákiri yìí níwọ̀n ìgbà tí ìgbà ìlò rẹ ṣì ń ṣiṣẹ́.",
    "ha": "Wannan gwajin ba shi da asusu. Za ka iya ci gaba da koyo a wannan burauzar muddin zaman ka yana nan.",
    "ig": "Ihe ngosi a enweghị akaụntụ. Ị nwere ike ịlaghachi n'ọmụmụ gị na ihe nchọgharị a ma ọ bụrụ na nnọkọ gị ka dị."
  },
  "This explanation could not be found.": {
    "yo": "A kò rí àlàyé yìí.",
    "ha": "Ba a sami wannan bayanin ba.",
    "ig": "A chọtaghị nkọwa a."
  },
  "This fixed example checks the assessment flow. Start a live journey for a sourced lesson.": {
    "yo": "Àpẹẹrẹ tí a ti ṣètò yìí ń dán ìṣàn àyẹ̀wò wò. Bẹ̀rẹ̀ ìrìnàjò ẹ̀kọ́ gidi fún ẹ̀kọ́ tó ní orísun.",
    "ha": "Wannan misali da aka riga aka ƙayyade yana gwada tsarin tantancewa. Fara tafiyar koyo ta kai tsaye don samun darasi daga tushe.",
    "ig": "Ihe atụ a edobere na-enyocha usoro nyocha. Bido njem dị ndụ iji nweta nkuzi nwere isi mmalite."
  },
  "This is a fixed English assessment for checking the learning flow. It is not live AI output. Understanding stays unknown until you provide independent evidence.": {
    "yo": "Èyí jẹ́ àyẹ̀wò èdè Gẹ̀ẹ́sì tí a ti ṣètò fún ṣíṣàyẹ̀wò ìṣàn ẹ̀kọ́. Kì í ṣe àbájáde ọgbọ́n àtọwọ́dá tó ń ṣiṣẹ́ ní àkókò gidi. Ìpele òye rẹ yóò ṣì jẹ́ àìmọ̀ títí o fi pèsè ẹ̀rí olómìnira.",
    "ha": "Wannan tantancewar Turanci ce da aka riga aka ƙayyade don gwada tsarin koyo. Ba amsar AI ta kai tsaye ba ce. Ba a san matakin fahimta ba sai ka bayar da shaida mai zaman kanta.",
    "ig": "Nke a bụ nyocha Bekee edobere iji nyochaa usoro mmụta. Ọ bụghị nzaghachi AI dị ndụ. Ọkwa nghọta ka bụ nke amaghị ruo mgbe ị nyere ihe akaebe nke onwe gị."
  },
  "This learning journey could not be found.": {
    "yo": "A kò rí ìrìnàjò ẹ̀kọ́ yìí.",
    "ha": "Ba a sami wannan tafiyar koyo ba.",
    "ig": "A chọtaghị njem mmụta a."
  },
  "This lesson could not be found.": {
    "yo": "A kò rí ẹ̀kọ́ yìí.",
    "ha": "Ba a sami wannan darasin ba.",
    "ig": "A chọtaghị nkuzi a."
  },
  "This lesson needs a valid assessment rubric.": {
    "yo": "Ẹ̀kọ́ yìí nílò ìlànà ìṣàyẹ̀wò tó péye.",
    "ha": "Wannan darasi yana buƙatar ingantattun ƙa’idojin tantancewa.",
    "ig": "Nkuzi a chọrọ usoro njirisi nyocha ziri ezi."
  },
  "This page could not load.": {
    "yo": "A kò lè ṣí ojú ìwé yìí.",
    "ha": "Ba a iya loda wannan shafin ba.",
    "ig": "Enweghị ike imepe ibe a."
  },
  "This preparation request could not be found.": {
    "yo": "A kò rí ìbéèrè ìmúrasílẹ̀ yìí.",
    "ha": "Ba a sami wannan buƙatar shiri ba.",
    "ig": "A chọtaghị arịrịọ nkwadebe a."
  },
  "This question has changed. Refresh your saved explanation.": {
    "yo": "Ìbéèrè yìí ti yípadà. Tun àlàyé tí o fipamọ́ ṣe.",
    "ha": "Wannan tambayar ta canza. Sabunta bayanin da ka adana.",
    "ig": "Ajụjụ a agbanweela. Melite nkọwa ị chekwara."
  },
  "This removes your saved journeys, conversations, preferences, and downloaded lessons from this demo. You will start fresh.": {
    "yo": "Èyí yóò pa àwọn ìrìnàjò, ìjíròrò, ààyò, àti ẹ̀kọ́ tí o gba sílẹ̀ sínú àpẹẹrẹ yìí rẹ́. O máa bẹ̀rẹ̀ láti ìbẹ̀rẹ̀.",
    "ha": "Wannan zai cire tafiyoyin koyo, tattaunawa, abubuwan da ka fi so, da darussan da ka sauke daga wannan gwaji. Za ka fara sabo.",
    "ig": "Nke a ga-ewepụ njem, mkparịta ụka, mmasị gị na nkuzi ndị ị budatara ma chekwaa na ngosi a. Ị ga-amalite ọhụrụ."
  },
  "This reply could not be started.": {
    "yo": "A kò lè bẹ̀rẹ̀ ìdáhùn yìí.",
    "ha": "Ba a iya fara wannan amsar ba.",
    "ig": "Enweghị ike ịmalite nzaghachi a."
  },
  "This request could not be completed. Please try again.": {
    "yo": "A kò lè parí ìbéèrè yìí. Jọ̀wọ́ tún gbìyànjú.",
    "ha": "Ba a iya kammala wannan buƙatar ba. Ka sake gwadawa.",
    "ig": "Enweghị ike imecha arịrịọ a. Biko nwaa ọzọ."
  },
  "This request could not be read.": {
    "yo": "A kò lè ka ìbéèrè yìí.",
    "ha": "Ba a iya karanta wannan buƙatar ba.",
    "ig": "Enweghị ike ịgụ arịrịọ a."
  },
  "This request is too large.": {
    "yo": "Ìbéèrè yìí tóbi jù.",
    "ha": "Wannan buƙatar ta yi girma sosai.",
    "ig": "Arịrịọ a karịrị akarị."
  },
  "This request must come from òye.": {
    "yo": "Ìbéèrè yìí gbọ́dọ̀ wá láti òye.",
    "ha": "Dole ne buƙatar ta fito daga òye.",
    "ig": "Arịrịọ a ga-esirịrị na òye."
  },
  "This request reached its retry limit. Please start a new objective.": {
    "yo": "Ìbéèrè yìí ti dé ààlà ìgbìyànjú túnṣe. Jọ̀wọ́ bẹ̀rẹ̀ ìfojúsùn tuntun.",
    "ha": "An kai iyakar sake gwada wannan buƙatar. Ku fara wata sabuwar manufa.",
    "ig": "Arịrịọ a eruola oke mbọ ọzọ. Biko malite ebumnuche ọhụrụ."
  },
  "This resource could not be found.": {
    "yo": "A kò rí ohun èlò yìí.",
    "ha": "Ba a sami wannan kayan koyo ba.",
    "ig": "Achọtaghị akụrụngwa a."
  },
  "This review reached its retry limit. Please start another explanation.": {
    "yo": "Àtúnyẹ̀wò yìí ti dé ààlà ìgbìyànjú túnṣe. Jọ̀wọ́ bẹ̀rẹ̀ àlàyé mìíràn.",
    "ha": "An kai iyakar sake gwada wannan bitar. Ku fara wani bayani.",
    "ig": "Ntụleghachi a eruola oke mbọ ọzọ. Biko malite nkọwa ọzọ."
  },
  "This saved answer belongs to a different question. Please try again.": {
    "yo": "Ìdáhùn tí a fipamọ́ yìí jẹ́ ti ìbéèrè mìíràn. Jọ̀wọ́ tún gbìyànjú.",
    "ha": "Wannan amsar da aka adana ta shafi wata tambaya dabam. Ku sake gwadawa.",
    "ig": "Azịza echekwara a bụ nke ajụjụ dị iche. Biko nwaa ọzọ."
  },
  "This saved explanation belongs to a different attempt.": {
    "yo": "Àlàyé tí a fipamọ́ yìí jẹ́ ti ìgbìyànjú mìíràn.",
    "ha": "Wannan bayanin da aka adana na wani yunƙuri ne dabam.",
    "ig": "Nkọwa echekwara a bụ nke mbọ dị iche."
  },
  "This saved response contains a different answer.": {
    "yo": "Ìdáhùn tí a fipamọ́ yìí ní ìdáhùn mìíràn nínú.",
    "ha": "Wannan martanin da aka adana ya ƙunshi amsa dabam.",
    "ig": "Nzaghachi echekwara a nwere azịza dị iche."
  },
  "This saved turn contains a different question.": {
    "yo": "Ìpele ìjíròrò tí a fipamọ́ yìí ní ìbéèrè mìíràn nínú.",
    "ha": "Wannan saƙon da aka adana ya ƙunshi wata tambaya dabam.",
    "ig": "Ozi mkparịta ụka echekwara a nwere ajụjụ dị iche."
  },
  "This turn reached its retry limit. Start a new question.": {
    "yo": "Ìpele ìjíròrò yìí ti dé ààlà ìgbìyànjú túnṣe. Bẹ̀rẹ̀ ìbéèrè tuntun.",
    "ha": "An kai iyakar sake gwada wannan saƙon. Ku fara da sabuwar tambaya.",
    "ig": "Ozi mkparịta ụka a eruola oke mbọ ọzọ. Malite ajụjụ ọhụrụ."
  },
  "Time for a session": {
    "yo": "Àkókò fún ìgbà ẹ̀kọ́",
    "ha": "Lokacin zaman koyo",
    "ig": "Oge nnọkọ"
  },
  "Translation is unavailable.": {
    "yo": "Kò sí ìtumọ̀ tó wà.",
    "ha": "Ba a samun fassara.",
    "ig": "Nsụgharị adịghị."
  },
  "Try a fresh example": {
    "yo": "Gbìyànjú àpẹẹrẹ tuntun",
    "ha": "Gwada wani sabon misali",
    "ig": "Nwaa ihe atụ ọhụrụ"
  },
  "Try again": {
    "yo": "Tún gbìyànjú",
    "ha": "Sake gwadawa",
    "ig": "Nwaa ọzọ"
  },
  "Try again, or return to your learning.": {
    "yo": "Tún gbìyànjú, tàbí padà sí ẹ̀kọ́ rẹ.",
    "ha": "Ku sake gwadawa ko ku koma ga karatunku.",
    "ig": "Nwaa ọzọ, ma ọ bụ laghachi n'ọmụmụ ihe gị."
  },
  "Try it yourself": {
    "yo": "Gbìyànjú fúnra rẹ",
    "ha": "Ku gwada da kanku",
    "ig": "Gbalịa ya n'onwe gị"
  },
  "Tutor": {
    "yo": "Olùkọ́ni",
    "ha": "Mai koyarwa",
    "ig": "Onye nkuzi"
  },
  "Tutor conversation": {
    "yo": "Ìjíròrò pẹ̀lú olùkọ́ni",
    "ha": "Tattaunawa da mai koyarwa",
    "ig": "Mkparịta ụka gị na onye nkuzi"
  },
  "Understanding demonstrated": {
    "yo": "O ti fi òye rẹ hàn",
    "ha": "An nuna fahimta",
    "ig": "Ị gosila na ị ghọtara."
  },
  "Use a fixed development example": {
    "yo": "Lo àpẹẹrẹ ìdàgbàsókè tí a ti pinnu",
    "ha": "Yi amfani da misalin ci gaba da aka kayyade",
    "ig": "Jiri ihe atụ mmepe a kapịrị ọnụ"
  },
  "Use less data": {
    "yo": "Lo dátà tó kéré sí i",
    "ha": "Rage amfani da bayanai",
    "ig": "Jiri data dị nta"
  },
  "Use the feedback, then explain the idea again. Earlier attempts stay saved.": {
    "yo": "Lo àlàyé àtúnṣe náà, kí o sì tún ṣàlàyé èrò náà. Àwọn ìgbìyànjú àtẹ̀yìnwá ṣì wà ní ìpamọ́.",
    "ha": "Ku yi amfani da wannan martani, sannan ku sake bayyana ra'ayin. Yunƙurin baya za su ci gaba da kasancewa a ajiye.",
    "ig": "Jiri nzaghachi ahụ, kọwaa echiche ahụ ọzọ. A ka na-echekwa mbọ ndị gara aga."
  },
  "Use the focused repair, then explain the idea again.": {
    "yo": "Lo àtúnṣe tó dojú kọ ohun pàtó náà, kí o sì tún ṣàlàyé èrò náà.",
    "ha": "Ku yi amfani da wannan gyara na musamman, sannan ku sake bayyana ra'ayin.",
    "ig": "Jiri mmezi e lekwasịrị anya ahụ, kọwaa echiche ahụ ọzọ."
  },
  "Wait for a saved preparation to finish before starting another.": {
    "yo": "Dúró kí ìmúrasílẹ̀ tí a fipamọ́ parí kí o tó bẹ̀rẹ̀ òmíràn.",
    "ha": "Ku jira shirin da aka adana ya ƙare kafin ku fara wani.",
    "ig": "Chere ka nkwadebe echekwara rụchaa tupu ịmalite nke ọzọ."
  },
  "Wait for your current reply or stop it first.": {
    "yo": "Dúró de ìdáhùn tó ń lọ lọ́wọ́, tàbí dá a dúró kọ́kọ́.",
    "ha": "Ku jira amsar da kuke jira a yanzu, ko ku dakatar da ita da farko.",
    "ig": "Chere nzaghachi ị na-echere ugbu a, ma ọ bụ kwụsị ya tupu ịga n'ihu."
  },
  "Want to build on this question?": {
    "yo": "Ṣé o fẹ́ tẹ̀ síwájú lórí ìbéèrè yìí?",
    "ha": "Kuna son ƙara zurfafa kan wannan tambayar?",
    "ig": "Ị chọrọ ịga n'ihu site n'ajụjụ a?"
  },
  "Watch": {
    "yo": "Wo",
    "ha": "Kalli",
    "ig": "Lelee"
  },
  "We could not prepare supported learning content. Please retry or try a more specific objective.": {
    "yo": "A kò lè pèsè àkóónú ẹ̀kọ́ tó bá àtìlẹ́yìn mu. Jọ̀wọ́ tún gbìyànjú tàbí yan ìfojúsùn tó ṣe kedere sí i.",
    "ha": "Ba mu iya shirya kayan koyo da ake tallafawa ba. Ku sake gwadawa ko ku zaɓi manufa mafi takamaimai.",
    "ig": "Anyị enweghị ike ịkwadebe ọdịnaya mmụta a na-akwado. Biko nwaa ọzọ ma ọ bụ nwaa ebumnuche akọwapụtara nke ọma."
  },
  "We couldn't find this page.": {
    "yo": "A kò rí ojú-ewé yìí.",
    "ha": "Ba mu sami wannan shafin ba.",
    "ig": "Anyị ahụghị ibe a."
  },
  "We will start with the basics. Your understanding is still unknown.": {
    "yo": "A ó bẹ̀rẹ̀ pẹ̀lú àwọn ìpìlẹ̀. A kò tíì mọ ìwọ̀n òye rẹ.",
    "ha": "Za mu fara da muhimman abubuwa. Har yanzu ba a tantance fahimtarka ba.",
    "ig": "Anyị ga-amalite na ntọala. Amabeghị otú i si ghọta ya."
  },
  "What would help you understand?": {
    "yo": "Kí ni yóò ràn ọ́ lọ́wọ́ láti lóye?",
    "ha": "Me zai taimaka maka ka fahimta?",
    "ig": "Gịnị ga-enyere gị aka ịghọta?"
  },
  "What would you like to learn?": {
    "yo": "Kí ni o fẹ́ kọ́?",
    "ha": "Me kake so ka koya?",
    "ig": "Gịnị ka ị ga-achọ ịmụ?"
  },
  "What would you like to understand?": {
    "yo": "Kí ni o fẹ́ lóye?",
    "ha": "Me kake so ka fahimta?",
    "ig": "Gịnị ka ị ga-achọ ịghọta?"
  },
  "What your explanation shows": {
    "yo": "Ohun tí àlàyé rẹ fi hàn",
    "ha": "Abin da bayaninka ya nuna",
    "ig": "Ihe nkọwa gị gosiri"
  },
  "Words to know": {
    "yo": "Àwọn ọ̀rọ̀ láti mọ̀",
    "ha": "Kalmomin da ya kamata ka sani",
    "ig": "Okwu ndị ị kwesịrị ịma"
  },
  "Writing a lesson that builds on your starting answers.": {
    "yo": "A ń ṣe àgbékalẹ̀ ẹ̀kọ́ kan tó dá lórí àwọn ìdáhùn ìbẹ̀rẹ̀ rẹ.",
    "ha": "Ana rubuta darasi bisa amsoshinka na farko.",
    "ig": "A na-ede nkuzi ga-adabere n’azịza mmalite gị."
  },
  "You": {
    "yo": "Ìwọ",
    "ha": "Kai",
    "ig": "Gị"
  },
  "You can change this during a lesson.": {
    "yo": "O lè yí èyí padà nígbà ẹ̀kọ́.",
    "ha": "Za ka iya canza wannan yayin darasi.",
    "ig": "Ị nwere ike ịgbanwe nke a mgbe ị na-amụ ihe."
  },
  "You can leave this page and return. Your request is saved.": {
    "yo": "O lè kúrò ní ojú ìwé yìí kí o sì padà. A ti fipamọ́ ìbéèrè rẹ.",
    "ha": "Za ka iya barin wannan shafi ka dawo. An adana buƙatarka.",
    "ig": "Ị nwere ike ịhapụ ibe a ma laghachi. Echekwara arịrịọ gị."
  },
  "You have reached the demo limit of 50 journeys. Clear history to start again.": {
    "yo": "O ti dé ààlà ìrìn-àjò 50 ti àfihàn. Pa ìtàn rẹ rẹ́ láti tún bẹ̀rẹ̀.",
    "ha": "Ka kai iyakar gwajin tafiyoyin koyo 50. Goge tarihin don sake farawa.",
    "ig": "Ị eruola oke ngosi nke njem mmụta 50. Hichapụ akụkọ ihe mere eme ka ịmalite ọzọ."
  },
  "Your answers and progress stay saved while we prepare this language.": {
    "yo": "A ó máa fipamọ́ àwọn ìdáhùn àti ìlọsíwájú rẹ nígbà tí a ń mú èdè yìí sílẹ̀.",
    "ha": "Ana adana amsoshinka da ci gabanka yayin da muke shirya wannan harshe.",
    "ig": "A ga-echekwa azịza gị na ọganihu gị mgbe anyị na-akwadebe asụsụ a."
  },
  "Your application answer": {
    "yo": "Ìdáhùn ìmúlò rẹ",
    "ha": "Amsarka ta amfani da abin da ka koya",
    "ig": "Azịza gị gbasara itinye ihe ị mụtara n’ọrụ"
  },
  "Your completed conversation is saved.": {
    "yo": "A ti fipamọ́ ìjíròrò tí o parí.",
    "ha": "An adana tattaunawarka da ka kammala.",
    "ig": "Echekwara mkparịta ụka i mechara."
  },
  "Your evidence over time": {
    "yo": "Ẹ̀rí ìlọsíwájú rẹ bí àkókò ti ń lọ",
    "ha": "Shaidarka a tsawon lokaci",
    "ig": "Ihe akaebe nke nghọta gị ka oge na-aga"
  },
  "Your explanation": {
    "yo": "Àlàyé rẹ",
    "ha": "Bayaninka",
    "ig": "Nkọwa gị"
  },
  "Your explanation covered each essential idea and your fresh application was correct.": {
    "yo": "Àlàyé rẹ bo gbogbo èrò pàtàkì, ìlò tuntun rẹ sì tọ́.",
    "ha": "Bayaninka ya ƙunshi kowane muhimmin ra'ayi, kuma ka yi amfani da abin da ka koya daidai a sabon yanayi.",
    "ig": "Nkọwa gị metụrụ isi echiche niile dị mkpa aka, itinye ihe ị mụtara n’ọrụ n’ụzọ ọhụrụ gị ziri ezi."
  },
  "Your explanations and fresh applications show what to build on next. Reading a lesson does not establish understanding.": {
    "yo": "Àwọn àlàyé rẹ àti ìlò tuntun rẹ fi ohun tí a yẹ kí a kọ́ lé lórí ní ìgbà tó kàn hàn. Kíkà ẹ̀kọ́ kò fi hàn pé o ti lóye rẹ.",
    "ha": "Bayananka da yadda kake amfani da abin da ka koya a sababbin yanayi suna nuna abin da ya kamata a ci gaba da ginawa a kai. Karanta darasi kaɗai ba ya tabbatar da fahimta.",
    "ig": "Nkọwa gị na itinye ihe ị mụtara n’ọrụ n’ụzọ ọhụrụ na-egosi ihe ị ga-amụkwu. Ịgụ nkuzi apụtaghị na ị ghọtara ya."
  },
  "Your follow-up answer": {
    "yo": "Ìdáhùn ìtẹ̀lé rẹ",
    "ha": "Amsarka ga ƙarin tambaya",
    "ig": "Azịza gị n’ajụjụ sochirinụ"
  },
  "Your fresh application": {
    "yo": "Ìlò tuntun rẹ",
    "ha": "Sabon amfani da abin da ka koya",
    "ig": "Itinye ihe ị mụtara n’ọrụ n’ụzọ ọhụrụ"
  },
  "Your independent explanation": {
    "yo": "Àlàyé tí o ṣe fúnra rẹ",
    "ha": "Bayaninka ba tare da taimako ba",
    "ig": "Nkọwa nke aka gị"
  },
  "Your language, your pace, and the formats that work for you.": {
    "yo": "Èdè rẹ, ìyára rẹ, àti àwọn ọ̀nà ìkọ́ni tó bá ọ mu.",
    "ha": "Harshenka, saurin da ya dace da kai, da tsarin da ya fi maka aiki.",
    "ig": "Asụsụ gị, ọsọ gị, na ụdị mmụta ndị dabara gị."
  },
  "Your learning": {
    "yo": "Ìkẹ́kọ̀ọ́ rẹ",
    "ha": "Koyonka",
    "ig": "Mmụta gị"
  },
  "Your learning pathway": {
    "yo": "Ọ̀nà ìkẹ́kọ̀ọ́ rẹ",
    "ha": "Hanyar koyonka",
    "ig": "Ụzọ mmụta gị"
  },
  "Your next learning step": {
    "yo": "Ìgbésẹ̀ ìkẹ́kọ̀ọ́ tó kàn",
    "ha": "Mataki na gaba a koyonka",
    "ig": "Nzọụkwụ mmụta ọzọ gị"
  },
  "Your preferences are saved on this browser.": {
    "yo": "A ti fipamọ́ àwọn ààyò rẹ sínú ẹ̀rọ aṣàwárí yìí.",
    "ha": "An adana zaɓuɓɓukanka a wannan burauzar.",
    "ig": "Echekwara nhọrọ gị na ihe nchọgharị a."
  },
  "Your question": {
    "yo": "Ìbéèrè rẹ",
    "ha": "Tambayarka",
    "ig": "Ajụjụ gị"
  },
  "Your saved learning will appear here.": {
    "yo": "Ẹ̀kọ́ tí o ti fipamọ́ yóò hàn níbí.",
    "ha": "Abubuwan koyon da ka adana za su bayyana a nan.",
    "ig": "Ihe ọmụmụ i chekwara ga-apụta ebe a."
  },
  "Your starter pathway": {
    "yo": "Ọ̀nà ẹ̀kọ́ ìbẹ̀rẹ̀ rẹ",
    "ha": "Hanyar farawarka",
    "ig": "Ụzọ mmalite gị"
  },
  "Your starting answers are saved. Lessons will build on what you already know.": {
    "yo": "A ti fi àwọn ìdáhùn ìbẹ̀rẹ̀ rẹ pamọ́. Àwọn ẹ̀kọ́ yóò tẹ̀ lé ohun tí o ti mọ̀ tẹ́lẹ̀.",
    "ha": "An adana amsoshinka na farko. Darussa za su ginu bisa abin da ka riga ka sani.",
    "ig": "Echekwara azịza mmalite gị. Ihe ọmụmụ ga-agbakwụnye n’ihe ị marala."
  },
  "Your starting point is saved.": {
    "yo": "A ti fi ibi ìbẹ̀rẹ̀ rẹ pamọ́.",
    "ha": "An adana matakin farawarka.",
    "ig": "Echekwara ebe mmalite gị."
  },
  "Your starting questions are still being prepared.": {
    "yo": "A ṣì ń pèsè àwọn ìbéèrè ìbẹ̀rẹ̀ rẹ.",
    "ha": "Har yanzu ana shirya tambayoyin farawarka.",
    "ig": "A ka na-akwadebe ajụjụ mmalite gị."
  },
  "building": {
    "yo": "ìmọ̀ tó ń dàgbàsókè",
    "ha": "Fahimta na haɓaka",
    "ig": "na-etolite"
  },
  "concept": {
    "yo": "èrò",
    "ha": "Ra’ayi",
    "ig": "echiche"
  },
  "demonstrated": {
    "yo": "òye tí a ti fi hàn",
    "ha": "An nuna fahimta",
    "ig": "egosila nghọta"
  },
  "goal": {
    "yo": "àfojúsùn",
    "ha": "Buri",
    "ig": "ebumnuche"
  },
  "met": {
    "yo": "ti ṣẹ",
    "ha": "An cimma",
    "ig": "emezuola"
  },
  "misconception": {
    "yo": "èrò tí kò tọ́",
    "ha": "Kuskuren fahimta",
    "ig": "echiche na-ezighị ezi"
  },
  "missing": {
    "yo": "àìsí",
    "ha": "Babu",
    "ig": "efu"
  },
  "needs practice": {
    "yo": "ó nílò ìdánrawò sí i",
    "ha": "Ana buƙatar ƙarin atisaye",
    "ig": "chọrọ mgbatị"
  },
  "topic": {
    "yo": "kókó ọ̀rọ̀",
    "ha": "Maudu’i",
    "ig": "isiokwu"
  },
  "uncertain": {
    "yo": "kò dájú",
    "ha": "Ba a sani da tabbaci ba",
    "ig": "ejighị n’aka"
  },
  "unknown": {
    "yo": "àìmọ̀",
    "ha": "Ba a sani ba",
    "ig": "amaghị"
  },
  "{practice} confirmed practice attempts. {explanations} saved explanations.": {
    "yo": "Àwọn ìgbìyànjú ìdánrawò {practice} ni a ti fìdí múlẹ̀. Àwọn àlàyé {explanations} ni a ti fi pamọ́.",
    "ha": "An tabbatar da {practice} yunƙurin atisaye. An adana {explanations} bayanai.",
    "ig": "Ekwenyela {practice} mgbalị omume. Echekwara nkọwa {explanations}."
  },
  "òye. home": {
    "yo": "òye. ojú ìbẹ̀rẹ̀",
    "ha": "òye. Gida",
    "ig": "òye. Ụlọ"
  }
};
export function translate(language: Language, text: string, values: Record<string, string | number> = {}) {
  const key = text.trim().replace(/\s+/g, ' ');
  const entry = language === 'en' ? null : messages[key]?.[language];
  const translated = entry ? `${/^\s/.test(text) ? ' ' : ''}${entry}${/\s$/.test(text) ? ' ' : ''}` : text;
  return translated.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match));
}
