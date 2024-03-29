/**
 * @module Discord
 * @description This module handle the send of Discord webhooks has setup in the config.js
 * @example <caption>Use this module from another file.</caption>
 * const discord = require('./discord')
*/
const WebhookImage = "https://cdn.discordapp.com/attachments/1055105517967638528/1080925572403822693/OVL_Logo.png" // https://cdn-icons-png.flaticon.com/512/3075/3075782.png
const config = require('./config')
const { Webhook, MessageBuilder  } = require('discord-webhook-node')
const hook = new Webhook({url: config.Discord.WebhookURL,throwErrors: false,retryOnLimit: true})
hook.setUsername('Open Vehicle Locator | Alert System');
function SendInfoWebhook(Head,Title,Content) {
    if(config.Discord.Enabled) {
        const embed = new MessageBuilder()
        .setTitle('ℹ️ '+Head+' ℹ️')
        .setAuthor('Open Vehicle Locator | Alert System', WebhookImage, config.AdministrationURL)
        .setURL(config.AdministrationURL)
        .addField('**'+Title+'**', Content, true)
        .setColor('#00b0f4')
        .setThumbnail(WebhookImage)
        .setFooter('Made by Tech-User 42 with ❤️ for the open-source project Open Vehicle Locator', WebhookImage)
        .setTimestamp();
    hook.send(embed);
    }
}

function SendSucesssWebhook(Head,Title,Content) {
    if(config.Discord.Enabled) {
        const embed = new MessageBuilder()
            .setTitle('✅ '+Head+' ✅')
            .setAuthor('Open Vehicle Locator | Alert System', WebhookImage, config.AdministrationURL)
            .setURL(config.AdministrationURL)
            .addField('**'+Title+'**', Content, true)
            .setColor('#28c93b')
            .setThumbnail(WebhookImage)
            .setFooter('Made by Tech-User 42 with ❤️ for the open-source project Open Vehicle Locator', WebhookImage)
            .setTimestamp();
        hook.send(embed);
    }
}

function SendWarningWebhook(Head,Title,Content) {
    if(config.Discord.Enabled) {
        const embed = new MessageBuilder()
            .setTitle('⚠️ '+Head+' ⚠️')
            .setAuthor('Open Vehicle Locator | Alert System', WebhookImage, config.AdministrationURL)
            .setURL(config.AdministrationURL)
            .addField('**'+Title+'**', Content, true)
            .setColor('#d13e08')
            .setThumbnail(WebhookImage)
            .setFooter('Made by Tech-User 42 with ❤️ for the open-source project Open Vehicle Locator', WebhookImage)
            .setTimestamp();
        hook.send(embed);
    }
}

function SendErrorWebhook(Head,Title,Content) {
    if(config.Discord.Enabled) {
        const embed = new MessageBuilder()
            .setTitle('❌ '+Head+' ❌')
            .setAuthor('Open Vehicle Locator | Alert System', WebhookImage, config.AdministrationURL)
            .setURL(config.AdministrationURL)
            .addField('**'+Title+'**', Content, true)
            .setColor('#ff0000')
            .setThumbnail(WebhookImage)
            .setFooter('Made by Tech-User 42 with ❤️ for the open-source project Open Vehicle Locator', WebhookImage)
            .setTimestamp();
        hook.send(embed);
    }
}

module.exports = {
    /**
    * Send an Info WebHook to Discord Server setup in `config.js`.
    * @param {(String)} Head - Title of the Webhook.
    * @param {(String)} Title - Title of the Field.
    * @param {(String)} Content - RContent of the Field.
    */
    SendInfoWebhook: function(Head,Title,Content) {
        SendInfoWebhook(Head,Title,Content)
    },
    /**
    * Send an Sucess WebHook to Discord Server setup in `config.js`.
    * @param {(String)} Head - Title of the Webhook.
    * @param {(String)} Title - Title of the Field.
    * @param {(String)} Content - RContent of the Field.
    */
    SendSucesssWebhook: function(Head,Title,Content) {
        SendSucesssWebhook(Head,Title,Content)
    },
    /**
    * Send an Warning WebHook to Discord Server setup in `config.js`.
    * @param {(String)} Head - Title of the Webhook.
    * @param {(String)} Title - Title of the Field.
    * @param {(String)} Content - RContent of the Field.
    */
    SendWarningWebhook: function(Head,Title,Content) {
        SendWarningWebhook(Head,Title,Content)
    },
    /**
    * Send an Error WebHook to Discord Server setup in `config.js`.
    * @param {(String)} Head - Title of the Webhook.
    * @param {(String)} Title - Title of the Field.
    * @param {(String)} Content - RContent of the Field.
    */
    SendErrorWebhook: function(Head,Title,Content) {
        SendErrorWebhook(Head,Title,Content)
    }
}