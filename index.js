/**
 * Scripts should use these functions to populate the regex parameter
 * of the listen function in a standardized way.
 */
var _       = require('lodash');
var options = {
    prefix: '?',
    nickname  : 'Somebot'
};

// http://stackoverflow.com/a/6969486
function escapeRegExp(str)
{
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function ensureArray(stringOrArray)
{
    if(typeof stringOrArray === "string")
    {
        return [stringOrArray];
    }
    else
    {
        return stringOrArray;
    }
}

function makePrefix(prefixed)
{
    if(prefixed === false)
    {
        return "";
    }
    else
    {
        return "(?:"
            + escapeRegExp(nodebot_prefs.command_prefix) + " ?"
            + "|"
            + escapeRegExp(nodebot_prefs.nickname) + " *[:,]? +"
            + ")"
            + (prefixed === "optional" ? "?" : "");
    }
}

function matchAny(strings, escaped)
{
    return "(?:"
        + _.map(strings, function (s)
        {
            return (escaped === false) ? "(?:" + s + ")" : escapeRegExp(s);
        }).join("|")
        + ")";
}

exports.init = function (opts)
{
    options = _.defaults(opts, options);
    return this;
};

exports.password = function ()
{
    return new RegExp("^(PASS |PRIVMSG " + nodebot_prefs.nickserv_nickname + " :IDENTIFY )", "i");
};

exports.only = function (keywords, prefixed)
{
    keywords = ensureArray(keywords);

    return new RegExp("PRIVMSG [^ ]+ :" + makePrefix(prefixed) + matchAny(keywords) + "$", "i");
};

exports.startsWith = function (keywords, prefixed)
{
    keywords = ensureArray(keywords);
    return new RegExp("PRIVMSG [^ ]+ :" + makePrefix(prefixed) + matchAny(keywords) + "\\b ?(.*)$", "i");
};

exports.matches = function (regexStrings, prefixed, only)
{
    regexStrings = ensureArray(regexStrings);
    return new RegExp("PRIVMSG [^ ]+ :" + makePrefix(prefixed) + matchAny(regexStrings, false) + (only ? "$" : ""), "i");
};