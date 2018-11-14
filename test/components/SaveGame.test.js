import assert from 'assert';
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import {
  find, sel, selectByText, clickOnElement,
} from '../test-utils';
import SaveGame from '../../src/components/SaveGame.vue';

Vue.config.productionTip = false;
Vue.config.silent = true;

describe('Load component', () => {
  let app;
  let click;

  beforeEach(() => {
    click = clickOnElement.bind(null, window);
  });

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('should not render a "Close" button before textarea is displayed', () => {
    renderSaveGameWithState({ gameState: null });
    app = sel(document, 'saveGame');
    assert.strictEqual(selectByText(app, 'button', 'Close'), null);
  });

  describe('click on "Save" button', () => {
    it('should not display the textarea element if gameState is empty', () => {
      renderSaveGameWithState({ gameState: null });
      app = sel(document, 'saveGame');
      const exportButton = selectByText(app, 'button', 'Save');
      click(exportButton);

      assertTextareaIsHidden(app);
    });

    it('should JSON stringify and display the gameState data in the textarea element', () => {
      renderSaveGameWithState({ gameState: { fruit: ['apples', 'oranges'] } });
      app = sel(document, 'saveGame');
      const exportButton = selectByText(app, 'button', 'Save');
      assertTextareaIsHidden(app);

      click(exportButton);

      assert.equal(getTextArea(app).value, '{"fruit":["apples","oranges"]}');
    });

    it('should display textarea element if gameState is not empty', () => {
      renderSaveGameWithState({ gameState: { fruit: ['apples', 'oranges'] } });
      app = sel(document, 'saveGame');
      const exportButton = selectByText(app, 'button', 'Save');
      assertTextareaIsHidden(app);

      click(exportButton);

      assert.equal(getTextArea(app).style.display, '');
    });

    it('should display "Close" button to user after export button is clicked', () => {
      renderSaveGameWithState({ gameState: { fruit: ['apples', 'oranges'] } });
      app = sel(document, 'saveGame');

      click(selectByText(app, 'button', 'Save'));

      assert.ok(selectByText(app, 'button', 'Close'));
    });

    it('should hide textarea and "Close" button if "Close" button is clicked', () => {
      renderSaveGameWithState({ gameState: { fruit: ['apples', 'oranges'] } });
      app = sel(document, 'saveGame');

      click(selectByText(app, 'button', 'Save'));
      click(selectByText(app, 'button', 'Close'));
      
      assert.strictEqual(selectByText(app, 'button', 'Close'), null, 'close should not be displayed');
      assertTextareaIsHidden(app);
    });
  });

  function renderSaveGameWithState(propsData) {
    document.getElementsByTagName('html')[0].innerHTML = '';
    mount(SaveGame, {
      attachToDocument: true,
      propsData,
    });
  }

  function assertNoImportGameTextarea() {
    assert.strictEqual(find(app, 'importGameTextarea'), null, 'textarea for importing a game should not render');
  }

  function assertTextareaIsHidden(appElement) {
    assert.strictEqual(getTextArea(appElement), undefined, 'textarea should not render');
  }

  function createAppElement() {
    const appElement = document.createElement('div');
    document.body.appendChild(appElement);

    return appElement;
  }
});

function getTextArea(app) {
  return app.getElementsByTagName('textarea')[0];
}
