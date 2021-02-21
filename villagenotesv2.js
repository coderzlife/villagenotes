/*
 * Script Name: Set/Get Village Notes
 * Version: v1.0
 * Last Updated: 2020-10-08
 * Author: RedAlert
 * Author URL: https://twscripts.ga/
 * Author Contact: RedAlert#9859 (Discord)
 * Approved: t14272680
 * Approved Date: 2020-10-08
 * Mod: JawJaw
 */

var scriptData = {
	name: 'Set/Get Village Notes',
	version: 'v1.0',
	author: 'RedAlert',
	authorUrl: 'https://twscripts.ga/',
	helpLink: 'https://forum.tribalwars.net/index.php?threads/set-get-village-note.286051/',
};

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Globals
var allowedScreens = ['report', 'info_command'];

// Translations
var translations = {
	en_DK: {
		'Set/Get Village Notes': 'Set/Get Village Notes',
		Help: 'Help',
		'Note added!': 'Note added!',
		'Note can not be added for this report!': 'Note can not be added for this report!',
		'Report Link': 'Report Link',
		'This script can be run only on single Report view or while tagging an Incoming!':
			'This script can be run only on single Report view or while tagging an Incoming!',
		'No notes found for this village!': 'No notes found for this village!',
		'This script requires Premium Account to be active!': 'This script requires Premium Account to be active!',
	},
	en_US: {
		'Set/Get Village Notes': 'Set/Get Village Notes',
		Help: 'Help',
		'Note added!': 'Note added!',
		'Note can not be added for this report!': 'Note can not be added for this report!',
		'Report Link': 'Report Link',
		'This script can be run only on single Report view or while tagging an Incoming!':
			'This script can be run only on single Report view or while tagging an Incoming!',
		'No notes found for this village!': 'No notes found for this village!',
		'This script requires Premium Account to be active!': 'This script requires Premium Account to be active!',
	},
};

// Init Debug
initDebug();

// Init Set Village Notes
function initSetVillageNote() {
	let noteText = '';
	let villageId;

	const reportTime = $('table#attack_info_def')[0].parentNode.parentNode.parentNode.rows[1].cells[1].textContent;
	const defenderPlayerName = $('table#attack_info_def')[0].rows[0].cells[1].textContent;

	const reportId = getParameterByName('view');
	const reportLink = buildReportLink(reportId);

	if (defenderPlayerName !== '---') {
		// Prepare note data
		if (defenderPlayerName == game_data.player.name) {
			villageId = $('table#attack_info_att')[0]
				.rows[1].cells[1].getElementsByTagName('span')[0]
				.getAttribute('data-id');
		} else {
			villageId = $('table#attack_info_def')[0]
				.rows[1].cells[1].getElementsByTagName('span')[0]
				.getAttribute('data-id');
		}

		noteText = '[b]' + reportTime + '[/b]';
		noteText += '\n' + $('#report_export_code')[0].innerHTML;
		

		// Add note on village
		TribalWars.post(
			'info_village',
			{
				ajaxaction: 'edit_notes',
				id: villageId,
			},
			{
				note: noteText,
			},
			function () {
				UI.SuccessMessage(tt('Note added!'), 2000);
			}
		);
	} else {
		UI.ErrorMessage(tt('Note can not be added for this report!'), 2000);
	}
}

// Init Get Village Notes
function initGetVillageNote() {
	$.get($('.village_anchor').first().find('a').first().attr('href'), function (html) {
		const note = jQuery(html).find('#own_village_note .village-note');
		if (note.length > 0) {
			const noteContent = `
                <div id="ra-village-notes" class="vis">
                    <div class="ra-village-notes-header">
                        <h3>${tt(scriptData.name)}</h3>
                    </div>
                    <div class="ra-village-notes-body">
                        ${note[0].children[1].innerHTML}
                    </div>
                    <div class="ra-village-notes-footer">
                        <small>
                            <strong>
                                ${tt(scriptData.name)} ${scriptData.version}
                            </strong> -
                            <a href="${scriptData.authorUrl}" target="_blank" rel="noreferrer noopener">
                                ${scriptData.author}
                            </a> -
                            <a href="${scriptData.helpLink}" target="_blank" rel="noreferrer noopener">
                                ${tt('Help')}
                            </a>
                        </small>
                    </div>
                </div>
                <style>
                    #ra-village-notes { position: relative; display: block; width: 100%; height: auto; clear: both; margin: 15px auto; padding: 10px; box-sizing: border-box; }
                    .ra-village-notes-footer { margin-top: 15px; }
                </style>
            `;
			jQuery('#content_value table:eq(0)').after(noteContent);
		}
	});
}

// Helper: Build Report Link
function buildReportLink(reportId) {
	const { origin } = window.location;
	return `${origin}/game.php?screen=report&mode=all&view=${reportId}`;
}

// Helper: Get parameter by name
function getParameterByName(name, url = window.location.href) {
	return new URL(url).searchParams.get(name);
}

// Helper: Generates script info
function scriptInfo() {
	return `[${scriptData.name} ${scriptData.version}]`;
}

// Helper: Prints universal debug information
function initDebug() {
	console.debug(`${scriptInfo()} It works ðŸš€!`);
	console.debug(`${scriptInfo()} HELP:`, scriptData.helpLink);
	if (DEBUG) {
		console.debug(`${scriptInfo()} Market:`, game_data.market);
		console.debug(`${scriptInfo()} World:`, game_data.world);
		console.debug(`${scriptInfo()} Screen:`, game_data.screen);
		console.debug(`${scriptInfo()} Game Version:`, game_data.majorVersion);
		console.debug(`${scriptInfo()} Game Build:`, game_data.version);
		console.debug(`${scriptInfo()} Locale:`, game_data.locale);
		console.debug(`${scriptInfo()} Premium:`, game_data.features.Premium.active);
	}
}

// Helper: Text Translator
function tt(string) {
	var gameLocale = game_data.locale;

	if (translations[gameLocale] !== undefined) {
		return translations[gameLocale][string];
	} else {
		return translations['en_DK'][string];
	}
}

(function () {
	const gameScreen = getParameterByName('screen');
	const gameView = getParameterByName('view');
	const commandId = getParameterByName('id');

	if (game_data.features.Premium.active) {
		if (allowedScreens.includes(gameScreen)) {
			if (gameScreen === 'report' && gameView !== null) {
				initSetVillageNote();
			} else if (gameScreen === 'info_command' && commandId !== null) {
				initGetVillageNote();
			} else {
				UI.ErrorMessage(
					tt('This script can be run only on single Report view or while tagging an Incoming!'),
					2000
				);
			}
		} else {
			UI.ErrorMessage(
				tt('This script can be run only on single Report view or while tagging an Incoming!'),
				2000
			);
		}
	} else {
		UI.ErrorMessage(tt('This script requires Premium Account to be active!'));
	}
})();