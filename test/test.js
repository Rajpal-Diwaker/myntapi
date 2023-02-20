// // let encText = "6e0febd7320f98ea8c646427edbbe95600fdc15eb83fced5bb1417ff14422b8f";
// // let workingKey = "A4AAC647548C8134E7326F4C212852FC";
// // let crypto = require('crypto');
// // function Decrypt(encText, workingKey) {
// //     var m = crypto.createHash('md5');
// //     m.update(workingKey)
// //     var key = m.digest();
// //     var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
// //     var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
// //     var decoded = decipher.update(encText, 'hex', 'utf8');
// //     decoded += decipher.final('utf8');
// //     return decoded;
// // }
// // console.log("==========>>",Decrypt(encText, workingKey));
// // console.log(JSON.stringify( {"name":"anand"}));

// let crypto = require("crypto");
// function Decrypt(encText, workingKey) {
//     var m = crypto.createHash('md5');
//     m.update(workingKey)
//     var key = m.digest();
//     var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
//     var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
//     var decoded = decipher.update(encText, 'hex', 'utf8');
//     decoded += decipher.final('utf8');
//     console.log("====", decoded);
    
//     return decoded;
// };
// let txt = 'fb63bce2c981e86b70751ecfea8393b4d9a9be3003f8f2fce4f7a5619eeeb7479c64c5ed20a9152bcd82d9d85e062edb9edff9b44d965056bb8ed2b7f9672f135bbca25caf5cf713c36a3ef7fc4ea1f564c28c5d58bd76e6d1e17c4ad9e12af9efe97a8abb80bcf905b8d4f223d9403f7d39ca6c6cbea4b416719ab7ab3983ba52939ca9433a954d1c471b638a4f06fb8c989dd6833a6bf06ee45a066a717ff6d361263a5d97f4a2353fb1f05434f2adfcb64e3a16fd0fdfb9649834323111da58e6c647bc3731e1b259ab283f17f3ee1571b3d70a85477df83a86339406d318e655faa36fdb2c37655a0c5f71261c71f9cc47aeac772baa833389b717224fb5220f28d2e149b6e18bc3157f613a2e01b016ed6088224f1a6588e0ce6d81322bc617439a2b6551d3a9c52a32654f970f07c4edc4714896c3f829fece494b60dd2de22bffcd4ff3537e1614fc5a8069f6aeacc2ddfed787cf36dee27f73b23eaa510f0f3334174c298df816b7a2faf08ac8e3c1b2f5ded4cf1d7315c141292c524ebed83bdbf54b0dcba7628be8bcf2aca61362e27a9f0729eec1b9c72e8546d42e2994f7b723af89a41d224aef72a66062eb705fd31e8dc7f0d4be9cd5179b7f072a822c4f32978c9685b03d0652a9eb4dff7e5d5e41801687e3cc95770efad73d2dc9367c972cae57b6ff58b9ed101c6467c961b9d54c26515d97bc805209029e79bb78219bee28a32974556c48bb6580af26667942da8d397ebd712a4afff82ad056d467fa6f127c2dc2e173a251d012de66e664c9ed4907e6ad42a040ae95a0362ef553015511810cec75486ea7156803ba7ea53e0186efdfdce7dcd02c9cd554c9f183f2bdc90ddae9e960f4431c914d6c4892fd1d07271b2cce7210beccac5c4c229b43df753c8c558df6f794c5e0b63a513bbaf7f85bde3e8d48c1d051b9c9bf9837aeb4ff36f0268626c4406cbe2c32ba5f38457e2fc01d761b9eabe57872446cea98bc2e0fbe54019eafb8b4352a23ebc4b436b0341a032e5d22528254ffca29179dbf745c61cf99db440ed450bd8f6386ef3d874f73c7d9d9149a0d34b539bb290283ea6ad62e00190a73f4366dbdb80b0bd199e070871051485b03265059e44bdf3cd270b9f2608260a307b725042741218ee38621fafd8679073133ca048974a447346b16f85f015cbfd850c024bec48c840852731d097e24bebae1e65aeba1576636e82f54ce2ee152ea37d8e106684c29fa00b5b49a3230d462fc51207142da550ac5cfce2a0c0fa97d9579a17221f8e279814a52cf31bbe4973c129cec7b3b9fabba555a749cfa4f83f7badd6a517f059fdb24db31b842f9d6'
// Decrypt(txt, "A4AAC647548C8134E7326F4C212852FC");
