import crypto from "crypto";

/**
 * ~1000 common English words for the typing challenge.
 * Short, typeable, and unambiguous.
 */
const WORD_LIST = [
  "apple","table","river","cloud","stone","light","music","water","earth","dream",
  "house","bread","plant","chair","clock","train","beach","brain","dance","field",
  "grass","heart","honey","juice","knife","lemon","maple","night","ocean","paint",
  "queen","radio","sugar","tiger","under","voice","watch","youth","angel","black",
  "candy","depth","eagle","flame","grape","hotel","ivory","jolly","kneel","lunar",
  "magic","noble","olive","pearl","quiet","rapid","solar","tower","ultra","vivid",
  "whale","album","boxer","chess","drift","elbow","frost","globe","happy","input",
  "jewel","karma","laser","medal","nerve","orbit","pixel","quest","robin","steam",
  "truth","unite","vault","wings","xenon","yacht","zebra","adapt","bloom","craft",
  "delta","ember","flora","giant","haven","image","joint","kiosk","lever","minor",
  "north","omega","piano","quilt","relay","spine","trend","urban","vigor","world",
  "acorn","blend","cargo","dodge","extra","fetch","grasp","haste","index","jumbo",
  "kayak","logic","mango","ninja","optic","plumb","quote","rider","swamp","thumb",
  "usage","valor","wrist","yield","blaze","crane","dwarf","event","fable","glide",
  "humid","irony","joker","knack","llama","moose","nasal","onset","proud","quirk",
  "realm","shelf","toxic","unity","verse","wound","amber","bison","cliff","diary",
  "essay","flint","grove","hatch","inlet","jerky","koala","lodge","marsh","novel",
  "oxide","patch","ranch","scale","thief","upper","vinyl","wheat","oxide","brave",
  "comet","drone","exile","forge","glyph","heron","ivory","judge","knelt","latch",
  "mercy","nexus","ozone","prism","ridge","slope","trout","usher","venom","woven",
  "aside","boost","chase","decoy","expel","focus","grand","hover","issue","leapt",
  "motor","nudge","onset","plaza","reign","storm","tunic","utter","vapor","wedge",
  "about","bring","clean","dance","early","faith","green","horse","inner","joust",
  "known","large","march","needy","offer","power","rough","shift","toast","until",
  "voice","where","young","alert","brush","crush","drawn","enter","flash","grain",
  "human","ideal","joint","knock","lemon","model","north","other","prime","round",
  "sharp","throw","union","value","worth","above","basic","cover","drive","equal",
  "frame","group","hence","issue","judge","later","month","never","order","place",
  "right","solid","taken","urban","valid","whole","audio","bound","court","depth",
  "exact","floor","grown","heavy","ivory","jolly","kiosk","limit","metal","noted",
  "outer","press","raise","shape","title","usual","vital","wider","young","arose",
  "block","crash","dense","error","final","glass","hoped","ivory","jewel","karma",
  "level","mount","nerve","often","panel","quest","rural","sight","track","unite",
  "visit","waste","yield","beach","chief","doubt","eight","filed","ghost","hasty",
  "imply","knack","labor","major","naked","occur","phase","range","scene","thick",
  "usage","vivid","worst","admit","blunt","civil","draft","ended","fault","grade",
  "humor","inner","knife","lodge","minor","naval","opera","plain","rapid","sixth",
  "tower","upset","virus","wrote","alike","bound","cling","drape","elope","fiery",
  "grasp","hence","icing","jolts","knobs","lofty","mourn","nerve","ought","plead",
  "quote","rigid","sworn","trait","under","vigor","wrath","bonus","chalk","depth",
  "erase","flute","grill","hotel","ivory","jelly","knelt","linen","moody","nylon",
  "onion","pixel","risky","siren","truce","usher","vowel","wheat","acrid","birch",
  "coral","ditch","evade","fungi","gloom","hippo","igloo","jazzy","kiwis","lilac",
  "melon","notch","plank","quail","roast","skull","talon","umbra","viola","waltz",
  "alarm","berry","cedar","daisy","elder","ferry","goose","hazel","ivory","junco",
  "kudos","larch","mirth","nutty","otter","peach","robin","stork","tulip","umber",
  "viper","weasel","finch","gecko","hound","ibis","llama","moose","newts","owlet",
  "panda","raven","shark","thorn","unlit","veins","weary","azure","batch","cliff",
  "debut","elbow","foggy","gleam","hyper","ivory","jaunt","kebab","lusty","mango",
  "nifty","outdo","pluck","quota","rumba","spicy","taboo","unzip","vault","whisk",
  "blank","crest","denim","epoch","forge","grout","haven","ivory","joust","knead",
  "lyric","midst","notch","oaken","perch","reign","stump","twang","uvula","vying",
  "whelk","xylem","yeast","zonal","abode","brisk","clamp","dowel","elfin","flank",
  "gripe","hedge","infer","jazzy","kiosk","lucid","mocha","niche","opium","poise",
  "qualm","roost","shawl","tidal","ulcer","vault","wield","yearn","zilch","ankle",
  "brawl","creep","ditto","ethic","frail","guise","hyena","ivory","jumpy","kayak",
  "lucky","mumps","newts","orbit","prawn","quest","rugby","silky","tryst","usurp",
  "verge","waltz","yodel","abbot","blimp","cloak","dwelt","exult","fizzy","grimy",
  "husky","ivory","jiffy","khaki","llama","mogul","nervy","oxide","psalm","quake",
  "rogue","snowy","tulip","upset","vixen","whirl","yacht","zebra","agile","bliss",
  "cider","dusty","eclat","fudge","guava","hitch","ivory","jests","kneel","lushy",
  "melee","nudge","oasis","pylon","raspy","swirl","taunt","ultra","vivid","waltz",
  "angel","frost","lemon","peach","solid","tower","blaze","craft","drift","ember",
  "flint","globe","haven","ivory","karma","laser","medal","north","omega","prism",
  "ridge","storm","trout","vigor","whale","knack","plumb","quest","spine","trend",
  "urban","vapor","wings","youth","album","berry","chase","delta","expel","flora",
  "grasp","haste","image","joint","lever","moose","nerve","olive","piano","relay",
  "sugar","thumb","usage","vault","world","amber","bloom","comet","dwarf","event",
];

/**
 * Picks a random word from the word list.
 */
export function getRandomWord(): string {
  const index = crypto.randomInt(0, WORD_LIST.length);
  return WORD_LIST[index];
}

/**
 * Returns the total number of words available.
 */
export function wordCount(): number {
  return WORD_LIST.length;
}
