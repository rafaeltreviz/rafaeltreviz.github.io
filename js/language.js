(function () {
    'use strict';

    var translations = window.portfolioEnglish;
    var entries = [];
    var walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            return node.parentElement.closest('script, style, .language-toolbar')
                ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
    });
    var node;
    while ((node = walker.nextNode())) {
        var original = node.nodeValue;
        var key = original.trim();
        if (Object.prototype.hasOwnProperty.call(translations, key)) {
            entries.push({ node: node, original: original, english: original.replace(key, translations[key]) });
        }
    }

    var attributes = [];
    document.querySelectorAll('[placeholder], [aria-label], img[alt]').forEach(function (element) {
        ['placeholder', 'aria-label', 'alt'].forEach(function (name) {
            var value = element.getAttribute(name);
            if (value && translations[value]) {
                attributes.push({ element: element, name: name, original: value, english: translations[value] });
            }
        });
    });

    function setLanguage(language) {
        var english = language === 'en';
        document.documentElement.lang = english ? 'en' : 'pt-BR';
        entries.forEach(function (entry) {
            entry.node.nodeValue = english ? entry.english : entry.original;
        });
        attributes.forEach(function (entry) {
            entry.element.setAttribute(entry.name, english ? entry.english : entry.original);
        });
        document.getElementById('language-label').textContent = english ? 'Site language' : 'Idioma do site';
        document.querySelectorAll('input[name="language"]').forEach(function (input) {
            input.checked = input.value === language;
        });
        document.dispatchEvent(new CustomEvent('languagechange'));
        // Storage may be unavailable in private browsing or local file previews.
        try { localStorage.setItem('portfolio-language', language); } catch (error) {}
    }

    document.querySelectorAll('input[name="language"]').forEach(function (input) {
        input.addEventListener('change', function () { setLanguage(input.value); });
    });
    var savedLanguage;
    try { savedLanguage = localStorage.getItem('portfolio-language'); } catch (error) {}
    setLanguage(savedLanguage === 'en' ? 'en' : 'pt-BR');
})();
