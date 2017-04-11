//Include Libraries
var SerialPort = require('serialport');
var portName = '/dev/ttyUSB0';
var schedule = require('node-schedule');
var tracery = require('tracery-grammar');
var Twit = require('twit');

//Define Vars
var TWITTER_CONSUMER_KEY = "mdY78PHGe1Zg0BhRb4Lyf2Dp9";
var TWITTER_CONSUMER_SECRET = "i71PsG4dGqflCVKtJnPUXH6cPcdlUvU37PLQbHAqErIpghmD00";
var TWITTER_ACCESS_TOKEN = "824713951288102912-npbR2WkazKkGTJsGSkzZSkh7JIsASPD";
var TWITTER_ACCESS_TOKEN_SECRET = "jcuwqQ40WncRB3dyaNV8zXF3SN8AsHP01u96eBIKalgar";
var T = new Twit(
{
    consumer_key:         TWITTER_CONSUMER_KEY
  , consumer_secret:      TWITTER_CONSUMER_SECRET
  , access_token:         TWITTER_ACCESS_TOKEN
  , access_token_secret:  TWITTER_ACCESS_TOKEN_SECRET
}
);
var moistcheck = 0;
var moistThreshold = 770;

//Set cron job
var j = schedule.scheduleJob("50 * * * *", testHumidity);


//Set Serial comm port
var sp = new SerialPort(portName, {
   baudRate: 9600,
   dataBits: 8,
   parity: 'none',
   stopBits: 1,
   flowControl: false,
   parser: SerialPort.parsers.readline()
});


//Serial comm events
sp.on("open", function () {
     console.log ("comm port ready!");
});

sp.on("data", function (d) {
     var processedMsg = parseInt(d);
     setMoist(processedMsg);
});

//Define grammar
var rawGrammar = 
{
	"origin":
	[
		"#greeting# Hope #awfulThing# isn't treating you too #badly#!",
		"#greeting# I miss your #jekaAttribute#.",
		"I just ate #food# and thought of you.",
		"#greeting# @jekagames give #lovedOne# #affectionateGesture.a# for me.",
		"If I could #doSomethingNice#\, I would, but #unfortunately#\, I am a plant.",
		"Wow! That was #plantFeeling#! I #plantAction#!",
		"#greeting# Did you know that #plantFact#?",
		"#gratitude# That water was especially #delicious# today!",
		"Your #jekaAttribute# is #plantFeeling#.",
		"#greeting# If #awfulThing# has got you down, ask #lovedOne# to #doSomethingNice#",
		"#greeting# being freshly watered feels just like getting #affectionateGesture.a#",
		"#gratitude# Getting watered is just like going for #food#",
		"#gratitude# I wish I could #doSomethingNice# but instead I #plantAction#",
		"Remember: #awfulThing# won\'t last forever!",
		"#greeting# #greeting# I #plantAction#"
	],
	"greeting":
	[
	    "Hey!",
	    "Hey there!",
	    "Yo!",
	    "What's up?",
	    "Salutations!",
	    "Meow!",
	    "Bonjour!",
	    "G'day.",
	    "Arr, matey!",
	    "Good dawning to thee, friend!",
	    "Ahoy-hoy!",
	    "Psst!",
	    "Peace, ho!",
	    "Hidley ho!",
	    "Helloka!",
	    "Morning, sunshine!",
	    "'Ello guv",
	    "OHAI!"
	],
	"doSomethingNice":
	[
	    "perform emotional labour for you",
	    "rub your feet",
	    "tell you a funny joke",
	    "dismantle the kyriarchy"
	],
	"awfulThing":
	[
	    "Fort Mac",
	    "Fort McMoney",
	    "fascism",
	    "the weather",
	    "Donald Trump's ugly face",
	    "the news",
	    "being in the middle of nowhere",
	    "existing"
	],
	"badly":
	[
	    "badly",
	    "horribly",
	    "terribly",
	    "abysmally"
	],
	"jekaAttribute":
	[
	    "curly hair",
	    "fashion sense",
	    "handwriting",
	    "tendency to gesticulate",
	    "ability to reach things on high shelves",
	    "amicable disposition",
	    "willingness to go out for #food#",
	    "cooking",
	    "sushi-making skill",
	    "organizational skill",
	    "anime boyfriend face",
	    "huggability",
	    "animal-handling skill",
	    "luck with rolling dice",
	    "ability to remember important dates"
	],
	"affectionateGesture":
	[
	    "hug",
	    "cuddle",
	    "pet",
	    "head scratch",
	    "head butt",
	    "kiss",
	    "high five",
	    "fist bump",
	    "dramatic reading of bad poetry",
	    "tasty snack",
	    "back rub",
	    "belly rub"
	],
	"food":
	[
	    "all-you-can-eat sushi",
	    "all-you-can-eat Korean BBQ",
	    "dumplings",
	    "Banh-Mi",
	    "Ice cream"
	],
	"lovedOne":
	[
	    "Tom",
	    "Guybrush",
	    "your hot mountie spouse",
	    "your adorable tuxedo cat",
	    "Toma",
	    "Brush",
	    "the faceless old woman who lives in your house",
	    "Satan",
	    "the ghost of Paul Newman"
	    
	],
	"unfortunately":
	[
	    "alas",
	    "unfortunately",
	    "sadly",
	    "regrettably",
	    "inconveniently"
	],
	"plantAction":
	[
	    "made some air",
	    "grew a little",
	    "expanded my roots",
	    "fixed a little bit of CO2",
	    "turned sunlight into energy",
	    "photosynthesized",
	    "tweeted"
	],
	"plantFeeling":
	[
	    "refreshing",
	    "satiating",
	    "wet",
	    "envigorating",
	    "quenching",
	    "cool",
	    "hydrating",
	    "fortifying",
	    "moist"
	],
	"plantFact":
	[
	    "plants are green",
	    "there are more than 80,000 species of edible plant",
	    "angiosperm is the scientific name for flowering plants",
	    "plants can recognize their siblings, and give them preferntial treatment",
	    "the smell of fresh cut grass is actually the grass screaming in pain",
	    "the heaviest plant in the world weighs 6,000,000 Kg",
	    "there are over 50 species in the genus Pothos",
	    "a typical houseplant leaf produces about 5 ml of oxygen per hour",
	    "Pothos' are also called Devil'sIvyy",
	    "Pothos' are objectively the best houseplant",
	    "nobody likes spider plants",
	    "despite their stocky shape and short legs Hippopotamus' can run at 30 km/h over short distances",
	    "plants have excellent spelling abilities",
	    "venus flytraps are total jerks",
	    "the socratea exorrhiza or 'walking palm' can move itself 20m per year",
	    "Pothos is also the name of the Greek god of sexual longing, yearning and desire."
	    
	],
	"gratitude":
	[
	    "Thanks!",
	    "Merci!",
	    "Gracias!",
	    "Much obliged.",
	    "Thank you!",
	    "OMG thanks!"
	],
	"delicious":
	[
	    "delicious",
	    "scrumptious",
        "delish",
	    "tasty",
	    "nutritious",
	    "yummy"
	]
	
}
var processedGrammar = tracery.createGrammar(rawGrammar);
processedGrammar.addModifiers(tracery.baseEngModifiers); 

//Functions
function setMoist(data){
	if(data > moistThreshold){
	 moistcheck = 1;
	}else{
	 moistcheck = 0;
	}
}


function tweet(){
	var tweet = processedGrammar.flatten("#origin#");
	console.log("Tweeting: "+tweet);
	T.post('statuses/update', { status: tweet }, function(err, data, response) {
	  //console.log(data)
	})
}

function testHumidity(){
    console.log('Am I moist enough to speak?');
    console.log(moistcheck);
    if(moistcheck == 1){
	console.log("yes!");
	//Do twitter thing
	tweet();
    }else{
	console.log("nope");
    }
}
