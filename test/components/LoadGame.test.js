import assert from 'assert';
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import {
  find, sel, selectByText, clickOnElement, triggerChange, createAlertSpy,
} from '../test-utils';
import LoadGame from '../../src/components/LoadGame.vue';

Vue.config.productionTip = false;
Vue.config.silent = true;

describe('Load component', () => {
  let app;
  let gameState;
  let click;
  let propsData;

  beforeEach(() => {
    window.alert = createAlertSpy();
    click = clickOnElement.bind(null, window);
    propsData = {
      handleLoadGameClick: () => {},
    };

    mount(LoadGame, {
      attachToDocument: true,
      propsData,
    });
    app = sel(document, 'loadGame');
    gameState = {};
  });

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('textarea with exported state is hidden initially', () => {
    assertTextareaIsHidden(app);
  });

  it('should not render a "Close" button before textarea is displayed', () => {
    assert.strictEqual(selectByText(app, 'button', 'Close'), null);
  });

  describe('click on load button', () => {
    it('should display a textarea', () => {
      assert.strictEqual(typeof getTextArea(app), 'undefined', 'textarea should not render before the click');

      click(selectByText(app, 'button', 'Load'));

      const textarea = getTextArea(app);
      assert.ok(textarea, 'textarea not found');
      assert.deepEqual(textarea, find(app, 'importGameTextarea'), 'textarea should be for importing another game');
    });

    it.skip('should hide save game textarea', () => {
      gameState.fruit = ['apples', 'oranges'];
      click(selectByText(app, 'button', 'Save'));

      click(selectByText(app, 'button', 'Load'));

      const textarea = getTextArea(app);
      assert.strictEqual(find(app, 'exportGameTextarea'), null, 'textarea for exporting the game should not render');
      assert.deepEqual(textarea, find(app, 'importGameTextarea'), 'textarea should be for importing another game');
    });

    it('should display "Load game" button when Load button is clicked', () => {
      assert.strictEqual(selectByText(app, 'button', 'Load game'), null);
      click(selectByText(app, 'button', 'Load'));
      assert.ok(selectByText(app, 'button', 'Load game'), '"Load game" button not found');
    });

    it('should hide textarea, "Load game" and Close button when Close button is clicked', () => {
      click(selectByText(app, 'button', 'Load'));
      click(selectByText(app, 'button', 'Close'));
      assertLoadGameDialogRemoved();
    });

    it('should parse textarea content as JSON and send it to callback function', () => {
      document.getElementsByTagName('html')[0].innerHTML = '';
      const promise = new Promise((resolve) => {
        propsData = {
          handleLoadGameClick: resolve,
        };
      });
      mount(LoadGame, {
        attachToDocument: true,
        propsData,
      });
      app = sel(document, 'loadGame');

      click(selectByText(app, 'button', 'Load'));
      sel(app, 'importGameTextarea').value = '{ "aProperty": "foo", "aList": ["foo", "bar"] }';
      triggerChange(sel(app, 'importGameTextarea'));

      return Vue.nextTick()
        .then(() => {
          click(selectByText(app, 'button', 'Load game'));
          return Vue.nextTick();
        })
        .then(() => promise)
        .then(state => assert.deepEqual(state, { aProperty: 'foo', aList: ['foo', 'bar'] }));
    });

    it('should close load game dialog after game loaded', () => {
      click(selectByText(app, 'button', 'Load'));

      sel(app, 'importGameTextarea').value = '{ "aProperty": "not important" }';
      triggerChange(sel(app, 'importGameTextarea'));
      click(selectByText(app, 'button', 'Load game'));

      assertLoadGameDialogRemoved();
    });

    it('should alert the user when textarea content is not a valid JSON object', () => {
      click(selectByText(app, 'button', 'Load'));

      sel(app, 'importGameTextarea').value = 'notValidJson{}';
      triggerChange(sel(app, 'importGameTextarea'));
      assert.equal(window.alert.getMessageLog().length, 0, 'No alerts on textarea change event');
      click(selectByText(app, 'button', 'Load game'));

      assert.equal(window.alert.getMessageLog()[0], 'Invalid save game JSON');

      assert.notDeepEqual(find(app, 'importGameTextarea'), undefined, 'textarea should still be present');
    });
  });

  function assertLoadGameDialogRemoved() {
    assertNoImportGameTextarea();
    assert.strictEqual(selectByText(app, 'button', 'Load game'), null, '"Load game" button should not render');
  }

  function assertNoImportGameTextarea() {
    assert.strictEqual(find(app, 'importGameTextarea'), null, 'textarea for importing a game should not render');
  }

  function assertTextareaIsHidden(appElement) {
    assert.strictEqual(getTextArea(appElement), undefined, 'textarea should not render');
  }
});

function getTextArea(app) {
  return app.getElementsByTagName('textarea')[0];
}
