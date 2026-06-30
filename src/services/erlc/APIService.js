class APIService {

    async runCommand(guildId, command) {

        console.log("==============");
        console.log("Guild:", guildId);
        console.log("ERLC Command:", command);
        console.log("==============");

        return true;

    }

}

module.exports = APIService;
