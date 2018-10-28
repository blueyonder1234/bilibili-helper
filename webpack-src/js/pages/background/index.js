/**
 * Author: Ruo
 * Create: 2018-06-12
 * Description: 扩展守护脚本
 */
import 'babel-polyfill';
import {createTab, hasNewVersion, getOption, version} from 'Utils';
import {FeatureManager} from 'Modules/FeatureManager';

/**
 * ------------------------------------------------------------------------------------------
 * 事件绑定
 * ------------------------------------------------------------------------------------------
 */
// 安装完成后事件
chrome.runtime.onInstalled.addListener(function(details) {
    const {reason, previousVersion} = details;
    if (reason === 'install') { // 安装成功后默认打开设置页面
        createTab(chrome.extension.getURL('options.html?mod=install'));
    } else if (reason === 'update' && !hasNewVersion(previousVersion)) {
        chrome.notifications.create('bilibili-helper-update', {
            type: 'basic',
            iconUrl: 'statics/imgs/icon-256.png',
            title: chrome.i18n.getMessage('notificationTitle'),
            message: chrome.i18n.getMessage('notificationExtensionUpdate').replace('%v', version),
        });
    }
});

/**
 * ------------------------------------------------------------------------------------------
 * 载入后台任务
 * ------------------------------------------------------------------------------------------
 */

/*
 * 卸载成功后自动跳到助手官网页面
 */
if (typeof (chrome.runtime.setUninstallURL) === 'function') {
    chrome.runtime.setUninstallURL('https://extlabs.io/analytics/uninstall/?uid=178&pid=264&finish_url=https%3A%2F%2Fbilihelper.guguke.net%2F%3Funinstall%26version%3D' + chrome.runtime.getManifest().version);
}

window.FeatureManager = new FeatureManager(); // 创建统一模块管理对象

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.commend === 'bilibili-helper-ga') {
        ga('send', {
            hitType: 'event',
            eventCategory: version,
            eventAction: 'init',
            eventLabel: 'test',
            nonInteraction: true,
        });
    }
})