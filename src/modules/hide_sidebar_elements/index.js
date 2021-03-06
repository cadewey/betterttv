const $ = require('jquery');
const watcher = require('../../watcher');
const settings = require('../../settings');
const domObserver = require('../../observers/dom');

let removeFeaturedChannelsListener;
let removeSimilarChannelsListener;
let removeOfflineFollowedChannelsListener;

class HideSidebarElementsModule {
    constructor() {
        settings.add({
            id: 'hideFeaturedChannels',
            name: 'Hide Recommended Channels',
            defaultValue: true,
            description: 'Removes the recommended channels in the sidebar'
        });
        settings.add({
            id: 'hideSimilarChannels',
            name: 'Hide "Viewers Also Watch" Channels',
            defaultValue: true,
            description: 'Removes the "<X> Viewers Also Watch" channels in the sidebar'
        });
        settings.add({
            id: 'autoExpandChannels',
            name: 'Auto Expand Followed Channels List',
            defaultValue: false,
            description: 'Clicks the "Load More" followed channels button in the sidebar for you'
        });
        settings.add({
            id: 'hideRecommendedFriends',
            name: 'Hide Recommended Friends',
            defaultValue: false,
            description: 'Removes the recommended friends section in the sidebar'
        });
        settings.add({
            id: 'hideOfflineFollowedChannels',
            name: 'Hide Offline Followed Channels',
            defaultValue: false,
            description: 'Removes offline followed channels in the sidebar'
        });
        settings.on('changed.hideFeaturedChannels', () => this.toggleFeaturedChannels());
        settings.on('changed.hideSimilarChannels', () => this.toggleSimilarChannels());
        settings.on('changed.autoExpandChannels', () => this.toggleAutoExpandChannels());
        settings.on('changed.hideRecommendedFriends', () => this.toggleRecommendedFriends());
        settings.on('changed.hideOfflineFollowedChannels', () => this.toggleOfflineFollowedChannels());
        watcher.on('load', () => {
            this.toggleFeaturedChannels();
            this.toggleSimilarChannels();
            this.toggleAutoExpandChannels();
            this.toggleRecommendedFriends();
            this.toggleOfflineFollowedChannels();
        });
    }

    toggleFeaturedChannels() {
        if (settings.get('hideFeaturedChannels')) {
            if (removeFeaturedChannelsListener) return;

            removeFeaturedChannelsListener = domObserver.on('.side-nav-section a[data-test-selector="recommended-channel"]', (node, isConnected) => {
                if (!isConnected) return;
                $(node).addClass('bttv-hide-featured-channels');
            }, {useParentNode: true});
            return;
        }

        if (!removeFeaturedChannelsListener) return;

        removeFeaturedChannelsListener();
        removeFeaturedChannelsListener = undefined;
        $('.side-nav-section').removeClass('bttv-hide-featured-channels');
    }

    toggleSimilarChannels() {
        if (settings.get('hideSimilarChannels')) {
            if (removeSimilarChannelsListener) return;

            removeSimilarChannelsListener = domObserver.on('.side-nav-section a[data-test-selector="similarity-channel"]', (node, isConnected) => {
                if (!isConnected) return;
                $(node).addClass('bttv-hide-similar-channels');
            }, {useParentNode: true});
            return;
        }

        if (!removeSimilarChannelsListener) return;

        removeSimilarChannelsListener();
        removeSimilarChannelsListener = undefined;
        $('.side-nav-section').removeClass('bttv-hide-similar-channels');
    }

    toggleAutoExpandChannels() {
        if (!settings.get('autoExpandChannels')) return;
        setTimeout(() => {
            const $firstChannelLink = $('a.side-nav-card__link[data-a-id="followed-channel-0"]');
            if ($firstChannelLink.length === 0) return;
            $('.side-nav button[data-a-target="side-nav-show-more-button"]').first().trigger('click');
        }, 1000);
    }

    toggleRecommendedFriends() {
        $('body').toggleClass('bttv-hide-recommended-friends', settings.get('hideRecommendedFriends'));
    }

    toggleOfflineFollowedChannels() {
        if (settings.get('hideOfflineFollowedChannels')) {
            if (removeOfflineFollowedChannelsListener) return;

            removeOfflineFollowedChannelsListener = domObserver.on('.side-nav-card .side-nav-card__avatar--offline', (node, isConnected) => {
                if (!isConnected) return;
                $(node).addClass('bttv-hide-followed-offline');
            }, {useParentNode: true});
            return;
        }

        if (!removeOfflineFollowedChannelsListener) return;

        removeOfflineFollowedChannelsListener();
        removeOfflineFollowedChannelsListener = undefined;
        $('.side-nav-card').removeClass('bttv-hide-followed-offline');
    }
}

module.exports = new HideSidebarElementsModule();
