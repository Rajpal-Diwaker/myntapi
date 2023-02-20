const { chai, server, should } = require("./testConfig");
const userModel = require("../models/userModel/userSchema");

/**
 * Test cases to test all userServices api's
 * (1) Resister
 */

 describe("userServices", ()=>{
    
    before((done)=>{
        userModel.deleteMany({}, (err)=>{
            done();
        })
    })

    /**
     * Testing POST register
     */
    describe("/post register", ()=>{
        it("It should have status 200", (done)=>{
            chai.request(server)
            .post("/api/user/v1/register")
            .send({
                "fullName": "ANAND",
                "email":"anand.yaaddaavv@Tteecchhuuggoo.ccoomm",
                "countryCode":"+91",
                "phone":1284895647,
                "usedReferralCode":"",
                "flatNo":"north wing",
                "landMark":"airport",
                "area":"5ea7ca6e5e283d680ca3175b",
                "city":"5ea7c9e25e283d680ca31758"  
            })
            .end((err, res)=>{
                res.should.have.status(200);
               // res.body.status.should.equal(200)
                done();
            })
        })
    })

    /**
     * Testing  POST login
     */
    describe("post /login", ()=>{
        it("It should have status code 200", (done)=>{
            chai.request(server)
            .post("/api/user/v1/login")
            .send({
                "phone":"1284895647"
            })
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.status.should.equal(200)
                done();
            })
        })
    })
 })