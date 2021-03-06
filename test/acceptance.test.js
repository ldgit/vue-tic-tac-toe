/* eslint max-len: ['warn', 160, 2] */
import assert from 'assert';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import Game from '../src/components/Game.vue';
import UltimateGame from '../src/components/UltimateGame.vue';
import {
  sel, clickOnElement, selectByText, triggerChange,
} from './test-utils';

Vue.config.productionTip = false;
Vue.config.silent = true;
Vue.config.async = false;

describe('Tic-tac-toe game', () => {
  let app;
  let click;

  beforeEach(() => {
    click = clickOnElement.bind(null, window);
  });

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  describe('standard tic-tac-toe', () => {
    beforeEach(() => {
      mount(Game, {
        attachToDocument: true,
        sync: true,
      });
      app = document.querySelector('.game');
    });

    test('clicking on already played square does nothing', () => {
      clickEmptySquare(sel(app, 'centerMiddleSquare'));

      click(sel(app, 'centerMiddleSquare'));

      assertGameStatus('Next player', 'O');
      assert.equal(sel(app, 'centerMiddleSquare').textContent, 'X');
    });

    test('play a game where X wins', () => {
      // Final board
      // X O O
      // O X
      // X   X
      clickEmptySquare(sel(app, 'centerMiddleSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(app, 'topMiddleSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(app, 'bottomLeftSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(app, 'topRightSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(app, 'topLeftSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(app, 'centerLeftSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(app, 'bottomRightSquare')).assertIsFilledWith('X');
    });

    test('should update game status with next player info after each move', () => {
      assertGameStatus('Next player', 'X');
      clickEmptySquare(sel(app, 'centerMiddleSquare'));
      assertGameStatus('Next player', 'O');
      clickEmptySquare(sel(app, 'topRightSquare'));
      assertGameStatus('Next player', 'X');
    });

    test('horizontal O win', () => {
      // Final board
      // O O O
      //   X
      // X   X
      clickEmptySquare(sel(app, 'centerMiddleSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(app, 'topMiddleSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(app, 'bottomRightSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(app, 'topRightSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(app, 'bottomLeftSquare')).assertIsFilledWith('X');

      assertGameStatus('Next player', 'O');
      clickEmptySquare(sel(app, 'topLeftSquare')).assertIsFilledWith('O');
      assertGameStatus('Winner', 'O');
    });

    test('middle vertical X win', () => {
      playMiddleVerticalXWin();
      assertGameStatus('Winner', 'X');
    });

    test('clicking on empty square after winning move does nothing', () => {
      // Final board
      // O O O
      //   X
      // X   X
      clickEmptySquare(sel(app, 'centerMiddleSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(app, 'topMiddleSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(app, 'bottomRightSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(app, 'topRightSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(app, 'bottomLeftSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(app, 'topLeftSquare')).assertIsFilledWith('O');

      clickEmptySquare(sel(app, 'centerLeftSquare')).assertIsFilledWith('');
      clickEmptySquare(sel(app, 'bottomMiddleSquare')).assertIsFilledWith('');
    });


    test('time travel: highlight time travel button for current move', () => {
      expect(selectByText(app, 'button', 'Go to game start').className).to.have.string('current-move-button');
      clickEmptySquare(sel(app, 'centerMiddleSquare')).assertIsFilledWith('X');

      expect(selectByText(app, 'button', 'Go to game start').className).to.not.have.string('current-move-button');
      expect(selectByText(app, 'button', 'Go to move 1').className).to.have.string('current-move-button');

      click(selectByText(app, 'button', 'Go to game start'));
      expect(selectByText(app, 'button', 'Go to game start').className).to.have.string('current-move-button');
      expect(selectByText(app, 'button', 'Go to move 1').className).to.not.have.string('current-move-button');
    });

    test(
      'time travel: X wins, then time travel two moves back, then O wins',
      () => {
        playMiddleVerticalXWin();
        assertGameStatus('Winner', 'X');

        click(selectByText(app, 'button', 'Go to move 3'));

        assertGameStatus('Next player', 'O');
        // Board now:
        // O X
        //   X
        //
        clickEmptySquare(sel(app, 'centerLeftSquare')).assertIsFilledWith('O');
        clickEmptySquare(sel(app, 'topRightSquare')).assertIsFilledWith('X');
        clickEmptySquare(sel(app, 'bottomLeftSquare')).assertIsFilledWith('O');
        assertGameStatus('Winner', 'O');
      },
    );

    test('time travel: correctly determine next player when time traveling', () => {
      clickEmptySquare(sel(app, 'centerMiddleSquare')).assertIsFilledWith('X');
      click(selectByText(app, 'button', 'Go to game start'));
      assertGameStatus('Next player', 'X');
    });

    function playMiddleVerticalXWin() {
      // Final board
      // O X
      //   X
      // O X
      clickEmptySquare(sel(app, 'centerMiddleSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(app, 'topLeftSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(app, 'topMiddleSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(app, 'bottomLeftSquare')).assertIsFilledWith('O');

      assertGameStatus('Next player', 'X');
      clickEmptySquare(sel(app, 'bottomMiddleSquare')).assertIsFilledWith('X');
    }
  });

  describe('ultimate tic-tac-toe', () => {
    beforeEach(() => {
      mount(UltimateGame, {
        attachToDocument: true,
        sync: true,
      });
      app = document.querySelector('.ultimate-game');
    });

    test('player can\'t play on already played square', () => {
      const centerMiddleBoard = sel(app, 'centerMiddleBoard');
      clickEmptySquare(sel(centerMiddleBoard, 'centerMiddleSquare')).assertIsFilledWith('X');
      clickSquare(sel(centerMiddleBoard, 'centerMiddleSquare')).assertIsNotFilledWith('O');
      clickSquare(sel(centerMiddleBoard, 'centerMiddleSquare')).assertIsNotFilledWith('');
    });

    getAllBoardTestIds().forEach(({ boardTestId }) => {
      test(
        `player O has to play in top left board if player X played in top left square of ${boardTestId} board`,
        () => {
          const boardToPlay = sel(app, boardTestId);
          clickEmptySquare(sel(boardToPlay, 'topLeftSquare')).assertIsFilledWith('X');

          selectAllBoardsExcept(['topLeftBoard'])
            .map(board => clickEmptySquare(sel(board, 'bottomLeftSquare')).assertIsFilledWith(''));
        },
      );
    });

    getAllBoardTestIds().forEach(({ boardTestId }) => {
      test(
        `player O has to play in center middle board if player X played in center middle square of ${boardTestId} board`,
        () => {
          const boardToPlay = sel(app, boardTestId);
          clickEmptySquare(sel(boardToPlay, 'centerMiddleSquare')).assertIsFilledWith('X');

          selectAllBoardsExcept(['centerMiddleBoard'])
            .map(board => clickEmptySquare(sel(board, 'topLeftSquare')).assertIsFilledWith(''));

          const centerMiddleBoard = sel(app, 'centerMiddleBoard');
          clickEmptySquare(sel(centerMiddleBoard, 'bottomRightSquare')).assertIsFilledWith('O');
        },
      );
    });

    [
      { squareTestId: 'topLeftSquare', boardOPlayerMustPlay: 'topLeftBoard' },
      { squareTestId: 'topMiddleSquare', boardOPlayerMustPlay: 'topMiddleBoard' },
      { squareTestId: 'topRightSquare', boardOPlayerMustPlay: 'topRightBoard' },
      { squareTestId: 'centerLeftSquare', boardOPlayerMustPlay: 'centerLeftBoard' },
      { squareTestId: 'centerMiddleSquare', boardOPlayerMustPlay: 'centerMiddleBoard' },
      { squareTestId: 'centerRightSquare', boardOPlayerMustPlay: 'centerRightBoard' },
      { squareTestId: 'bottomLeftSquare', boardOPlayerMustPlay: 'bottomLeftBoard' },
      { squareTestId: 'bottomMiddleSquare', boardOPlayerMustPlay: 'bottomMiddleBoard' },
      { squareTestId: 'bottomRightSquare', boardOPlayerMustPlay: 'bottomRightBoard' },
    ].forEach(({ squareTestId, boardOPlayerMustPlay }) => {
      test(
        `player X has to play in bottom right board if player O played in bottom right square of ${boardOPlayerMustPlay} board
          (first played square ${squareTestId} of centerMiddleBoard)`,
        () => {
          const boardToPlay = sel(app, 'centerMiddleBoard');
          clickEmptySquare(sel(boardToPlay, squareTestId)).assertIsFilledWith('X');

          selectAllBoardsExcept([boardOPlayerMustPlay])
            .map(board => clickSquare(sel(board, 'bottomRightSquare')).assertIsNotFilledWith('O'));
          clickEmptySquare(sel(sel(app, boardOPlayerMustPlay), 'bottomRightSquare')).assertIsFilledWith('O');

          selectAllBoardsExcept(squareTestId !== 'bottomRightSquare' ? ['bottomRightBoard'] : ['bottomRightBoard', 'centerMiddleBoard'])
            .map(board => clickSquare(sel(board, 'bottomRightSquare')).assertIsNotFilledWith('X'));
          clickEmptySquare(sel(sel(app, 'bottomRightBoard'), 'centerLeftSquare')).assertIsFilledWith('X');
        },
      );
    });

    test('play a game, X wins', () => {
      playGameWherePlayerOneWins({});
    });

    test('Allow no more play after someone wins', () => {
      playGameWherePlayerOneWins({});
      clickEmptySquare(sel(sel(app, 'topMiddleBoard'), 'topLeftSquare')).assertIsFilledWith('');
    });

    test('when a local board is won, disable further input on it', () => {
      const topLeftBoard = sel(app, 'topLeftBoard');
      const topMiddleBoard = sel(app, 'topMiddleBoard');
      const topRightBoard = sel(app, 'topRightBoard');
      const centerLeftBoard = sel(app, 'centerLeftBoard');

      // X wins top left board (top horizontal) so that O is sent to that board
      clickEmptySquare(sel(topLeftBoard, 'topMiddleSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(topMiddleBoard, 'topLeftSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(topLeftBoard, 'topRightSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(topRightBoard, 'topLeftSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(topLeftBoard, 'topLeftSquare')).assertIsFilledWith('X');

      // O can't play top left board anymore
      clickEmptySquare(sel(topLeftBoard, 'centerLeftSquare')).assertIsFilledWith('');
      clickEmptySquare(sel(topLeftBoard, 'centerMiddleSquare')).assertIsFilledWith('');

      clickEmptySquare(sel(centerLeftBoard, 'topLeftSquare')).assertIsFilledWith('O');

      // X can't play top left board anymore
      clickEmptySquare(sel(topLeftBoard, 'centerLeftSquare')).assertIsFilledWith('');
      clickEmptySquare(sel(topLeftBoard, 'centerMiddleSquare')).assertIsFilledWith('');
    });

    getAllBoardTestIds()
      .filter(({ boardTestId }) => boardTestId !== 'topLeftBoard')
      .forEach(({ boardTestId }) => {
        test(
          `when a board is won and next player is sent to that board, that player can play any board except the won one (played ${boardTestId})`,
          () => {
            const topLeftBoard = sel(app, 'topLeftBoard');
            const topMiddleBoard = sel(app, 'topMiddleBoard');
            const topRightBoard = sel(app, 'topRightBoard');

            // X wins top left board (top horizontal) so that O is sent to that board
            clickEmptySquare(sel(topLeftBoard, 'topMiddleSquare')).assertIsFilledWith('X');
            clickEmptySquare(sel(topMiddleBoard, 'topLeftSquare')).assertIsFilledWith('O');
            clickEmptySquare(sel(topLeftBoard, 'topRightSquare')).assertIsFilledWith('X');
            clickEmptySquare(sel(topRightBoard, 'topLeftSquare')).assertIsFilledWith('O');
            clickEmptySquare(sel(topLeftBoard, 'topLeftSquare')).assertIsFilledWith('X');

            const anyBoardButTopLeft = sel(app, boardTestId);
            clickEmptySquare(sel(anyBoardButTopLeft, 'centerMiddleSquare')).assertIsFilledWith('O');
          },
        );
      });

    test(
      'when sent to board that was already won, that player can play any other board',
      () => {
        const topLeftBoard = sel(app, 'topLeftBoard');
        const topMiddleBoard = sel(app, 'topMiddleBoard');
        const topRightBoard = sel(app, 'topRightBoard');
        const centerMiddleBoard = sel(app, 'centerMiddleBoard');
        const centerLeftBoard = sel(app, 'centerLeftBoard');
        const bottomLeftBoard = sel(app, 'bottomLeftBoard');

        // X wins top left board (top horizontal) so that O is sent to that board
        clickEmptySquare(sel(topLeftBoard, 'topMiddleSquare')).assertIsFilledWith('X');
        clickEmptySquare(sel(topMiddleBoard, 'topLeftSquare')).assertIsFilledWith('O');
        clickEmptySquare(sel(topLeftBoard, 'topRightSquare')).assertIsFilledWith('X');
        clickEmptySquare(sel(topRightBoard, 'topLeftSquare')).assertIsFilledWith('O');
        clickEmptySquare(sel(topLeftBoard, 'topLeftSquare')).assertIsFilledWith('X');
        clickEmptySquare(sel(centerLeftBoard, 'bottomLeftSquare')).assertIsFilledWith('O');
        clickEmptySquare(sel(bottomLeftBoard, 'topLeftSquare')).assertIsFilledWith('X');

        // Top left board was already won, so O can play any other board
        clickEmptySquare(sel(centerMiddleBoard, 'bottomRightSquare')).assertIsFilledWith('O');
      },
    );

    test(
      'should color all non-playable boards light red, all won boards o-won-board or x-won-board class, and playable boards white',
      () => {
        const allBoards = getAllBoardTestIds().map(data => sel(app, data.boardTestId));
        allBoards.forEach(assertBoardIsWhite);

        const centerMiddleBoard = sel(app, 'centerMiddleBoard');
        const topMiddleBoard = sel(app, 'topMiddleBoard');
        const bottomMiddleBoard = sel(app, 'bottomMiddleBoard');
        clickEmptySquare(sel(centerMiddleBoard, 'topMiddleSquare')).assertIsFilledWith('X');

        selectAllBoardsExcept(['topMiddleBoard']).forEach(assertBoardIsRed);
        assertBoardIsWhite(topMiddleBoard);

        clickEmptySquare(sel(topMiddleBoard, 'centerMiddleSquare')).assertIsFilledWith('O');
        clickEmptySquare(sel(centerMiddleBoard, 'bottomMiddleSquare')).assertIsFilledWith('X');
        clickEmptySquare(sel(bottomMiddleBoard, 'centerMiddleSquare')).assertIsFilledWith('O');
        clickEmptySquare(sel(centerMiddleBoard, 'centerMiddleSquare')).assertIsFilledWith('X');

        selectAllBoardsExcept(['centerMiddleBoard']).forEach(assertBoardIsWhite);
        assertBoardHasWonClass(centerMiddleBoard);
      },
    );

    test(
      'simple time travel: play one move, then go to game start, then play a different move',
      () => {
        const topLeftBoard = sel(app, 'topLeftBoard');
        clickEmptySquare(sel(topLeftBoard, 'bottomRightSquare'));
        click(selectByText(app, 'button', 'Go to game start'));
        clickEmptySquare(sel(topLeftBoard, 'bottomRightSquare')).assertIsFilledWith('X');
      },
    );

    test(
      'time travel: X wins, then back three turns, then continue playing',
      () => {
        const bottomLeftBoard = sel(app, 'bottomLeftBoard');
        const bottomRightBoard = sel(app, 'bottomRightBoard');
        const topRightBoard = sel(app, 'topRightBoard');
        const centerMiddleBoard = sel(app, 'centerMiddleBoard');
        const centerLeftBoard = sel(app, 'centerLeftBoard');

        XWinsIn23Moves();
        assertGameStatus('Winner', 'X');
        click(selectByText(app, 'button', 'Go to move 20')); // O has just won bottomLeftBoard by clicking on bottomRightSquare

        assert.strictEqual(sel(bottomLeftBoard, 'bottomRightSquare').textContent, 'O', 'Square filled in 20. move must still be filled');
        assert.strictEqual(sel(bottomRightBoard, 'centerMiddleSquare').textContent.trim(), '', 'Square filled in 23. move must not be filled');
        assert.strictEqual(sel(topRightBoard, 'bottomRightSquare').textContent.trim(), '', 'Square filled in 22. move must not be filled');
        assert.strictEqual(sel(bottomRightBoard, 'topRightSquare').textContent.trim(), '', 'Square filled in 21. move must not be filled');

        assertGameStatus('Next player', 'X');

        clickEmptySquare(sel(bottomRightBoard, 'centerMiddleSquare')).assertIsFilledWith('X');
        // Center middle board already won by X, so O can play any active board
        assertGameStatus('Next player', 'O');
        clickEmptySquare(sel(centerMiddleBoard, 'bottomRightSquare')).assertIsFilledWith('');
        assertGameStatus('Next player', 'O', 'Next player is still "O" because center middle board is won');
        clickEmptySquare(sel(centerLeftBoard, 'bottomRightSquare')).assertIsFilledWith('O');
      },
    );

    test(
      'time travel: X wins in 23. moves, go to game start, Y wins in 24 moves',
      () => {
        playGameWhereXWins();
        click(selectByText(app, 'button', 'Go to game start'));
        playGameWhereOWins();
      },
    );

    test(
      'time travel: all time travel buttons must be preserved after they are clicked until next move is played',
      () => {
        playGameWhereXWins();
        click(selectByText(app, 'button', 'Go to game start'));
        click(selectByText(app, 'button', 'Go to move 20'));
        click(selectByText(app, 'button', 'Go to move 18'));
        click(selectByText(app, 'button', 'Go to game start'));
        clickEmptySquare(sel(sel(app, 'centerMiddleBoard'), 'centerMiddleSquare')).assertIsFilledWith('X');
        assert.strictEqual(selectByText(app, 'button', 'Go to move 20'), null, 'Button "Go to move 20" should not render');
        assert.strictEqual(selectByText(app, 'button', 'Go to move 2'), null, 'Button "Go to move 2" should not render');
      },
    );

    test('time travel: highlight time travel button for current move', () => {
      const topMiddleBoard = sel(app, 'topMiddleBoard');
      expect(selectByText(app, 'button', 'Go to game start').className).to.have.string('current-move-button');
      clickEmptySquare(sel(topMiddleBoard, 'topMiddleSquare')).assertIsFilledWith('X');
      expect(selectByText(app, 'button', 'Go to game start').className).to.not.have.string('current-move-button');
      expect(selectByText(app, 'button', 'Go to move 1').className).to.have.string('current-move-button');

      click(selectByText(app, 'button', 'Go to game start'));

      expect(selectByText(app, 'button', 'Go to game start').className).to.have.string('current-move-button');
      expect(selectByText(app, 'button', 'Go to move 1').className).to.not.have.string('current-move-button');
    });

    test('when game is won, disable further inputs on all local boards', () => {
      playGameWherePlayerOneWins({});
      const topMiddleBoard = sel(app, 'topMiddleBoard');
      clickEmptySquare(sel(topMiddleBoard, 'topLeftSquare')).assertIsFilledWith('');
      assertGameStatus('Winner', 'X');
    });

    test('time travel re-enables previously won local-board', () => {
      const topLeftBoard = sel(app, 'topLeftBoard');
      const topMiddleBoard = sel(app, 'topMiddleBoard');
      const topRightBoard = sel(app, 'topRightBoard');

      // X wins top left board (top horizontal) so that O is sent to that board
      clickEmptySquare(sel(topLeftBoard, 'topMiddleSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(topMiddleBoard, 'topLeftSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(topLeftBoard, 'topRightSquare')).assertIsFilledWith('X');
      clickEmptySquare(sel(topRightBoard, 'topLeftSquare')).assertIsFilledWith('O');
      clickEmptySquare(sel(topLeftBoard, 'topLeftSquare')).assertIsFilledWith('X');

      click(selectByText(app, 'button', 'Go to move 4'));
      clickEmptySquare(sel(topLeftBoard, 'topLeftSquare')).assertIsFilledWith('X');

      click(selectByText(app, 'button', 'Go to game start'));
      clickEmptySquare(sel(topLeftBoard, 'topLeftSquare')).assertIsFilledWith('X');
    });

    test(
      'clicking on "Vue vs. React?" button toggles special mode on and off',
      () => {
        const specialModeToggle = selectByText(app, 'button', 'Vue vs. React?');
        const topMiddleBoardCenterMiddleSquare = sel(sel(app, 'topMiddleBoard'), 'centerMiddleSquare');
        const topMiddleBoardBottomMiddleSquare = sel(sel(app, 'centerMiddleBoard'), 'bottomMiddleSquare');
        const unoccupiedSquare = sel(sel(app, 'bottomMiddleBoard'), 'centerMiddleSquare');
        clickEmptySquare(topMiddleBoardCenterMiddleSquare).assertIsFilledWith('X');

        click(specialModeToggle);
        assertCorrectIconInGameStatus('react-icon');
        click(specialModeToggle);

        clickEmptySquare(topMiddleBoardBottomMiddleSquare).assertIsFilledWith('O');
        assertSpecialModeNotToggled(topMiddleBoardCenterMiddleSquare, topMiddleBoardBottomMiddleSquare, unoccupiedSquare);

        click(specialModeToggle);
        assertSpecialModeToggled(topMiddleBoardCenterMiddleSquare, topMiddleBoardBottomMiddleSquare, unoccupiedSquare);

        click(specialModeToggle);
        assertSpecialModeNotToggled(topMiddleBoardCenterMiddleSquare, topMiddleBoardBottomMiddleSquare, unoccupiedSquare);
      },
    );

    describe('save and load functionality', () => {
      test('can export current game state', () => {
        const topLeftBoard = sel(app, 'topLeftBoard');
        const topMiddleBoard = sel(app, 'topMiddleBoard');
        const topRightBoard = sel(app, 'topRightBoard');
        clickEmptySquare(sel(topLeftBoard, 'topMiddleSquare')).assertIsFilledWith('X');
        clickEmptySquare(sel(topMiddleBoard, 'topRightSquare')).assertIsFilledWith('O');
        clickEmptySquare(sel(topRightBoard, 'topMiddleSquare')).assertIsFilledWith('X');

        click(selectByText(app, 'button', 'Save'));

        const exportedState = JSON.parse(sel(app, 'exportGameTextarea').value);
        assert.equal(exportedState.history[3].boards[2].squares[1], 'X', 'incorrect topRightBoard topMiddleSquare value');
        assert.equal(exportedState.history[2].boards[1].squares[2], 'O', 'incorrect topMiddleBoard topRightSquare value');
        assert.equal(exportedState.history[3].boards[0].squares[1], 'X', 'incorrect topRightBoard topMiddleSquare value');
      });

      test('can load a game state', () => {
        const topLeftBoard = sel(app, 'topLeftBoard');
        const topMiddleBoard = sel(app, 'topMiddleBoard');
        const topRightBoard = sel(app, 'topRightBoard');
        click(selectByText(app, 'button', 'Load'));
        sel(app, 'importGameTextarea').value = fs.readFileSync(path.join('test', 'exportedGame.json'));
        triggerChange(sel(app, 'importGameTextarea'));

        click(selectByText(app, 'button', 'Load game'));

        assert.equal(sel(topLeftBoard, 'topMiddleSquare').textContent, 'X');
        assert.equal(sel(topMiddleBoard, 'topRightSquare').textContent, 'O');
        assert.equal(sel(topRightBoard, 'topMiddleSquare').textContent, 'X');

        clickEmptySquare(sel(topMiddleBoard, 'topLeftSquare')).assertIsFilledWith('O');
        clickEmptySquare(sel(topLeftBoard, 'bottomLeftSquare')).assertIsFilledWith('X');
      });
    });
  });

  function assertSpecialModeNotToggled(
    topMiddleBoardCenterMiddleSquare, topMiddleBoardBottomMiddleSquare, unoccupiedSquare,
  ) {
    expect(topMiddleBoardCenterMiddleSquare.className).to.not.have.string('square-vue-icon', 'No icons shows up until user clicks "Vue vs. React?" button');
    expect(topMiddleBoardCenterMiddleSquare.className).to.not.have.string('square-react-icon', 'No icons shows up until user clicks "Vue vs. React?" button');
    expect(topMiddleBoardBottomMiddleSquare.className).to.not.have.string('square-vue-icon');
    expect(topMiddleBoardBottomMiddleSquare.className).to.not.have.string('square-react-icon');
    expect(unoccupiedSquare.className).to.not.have.string('square-vue-icon');
    expect(unoccupiedSquare.className).to.not.have.string('square-react-icon');
    assertCorrectIconInGameStatus('no-icon');
    assert.equal(sel(app, 'gameStatus').querySelectorAll('button.no-icon').length, 1, 'Expected to find one button element with no-icon class');
    assert.equal(sel(app, 'gameStatus').querySelectorAll('button.vue-icon').length, 0, 'Expected to find no button elements with vue-icon class');
    assert.equal(sel(app, 'gameStatus').querySelectorAll('button.react-icon').length, 0, 'Expected to find no button elements with react-icon class');
  }

  function assertSpecialModeToggled(topMiddleBoardCenterMiddleSquare, topMiddleBoardBottomMiddleSquare, unoccupiedSquare) {
    expect(topMiddleBoardCenterMiddleSquare.className).to.have.string('square-vue-icon', 'X player has Vue icon');
    expect(topMiddleBoardBottomMiddleSquare.className).to.have.string('square-react-icon', 'O player has React icon');
    expect(unoccupiedSquare.className).to.not.have.string('square-vue-icon');
    expect(unoccupiedSquare.className).to.not.have.string('square-react-icon');
    assertCorrectIconInGameStatus('vue-icon');
  }

  function assertCorrectIconInGameStatus(iconToExpect) {
    ['no-icon', 'vue-icon', 'react-icon'].filter(icon => iconToExpect !== icon).forEach((icon) => {
      assert.equal(sel(app, 'gameStatus').querySelectorAll(`button.${icon}`).length, 0, `Expected to find no button elements with ${icon} class`);
    });
    assert.equal(sel(app, 'gameStatus').querySelectorAll(`button.${iconToExpect}`).length, 1, `Expected to find one button element with ${iconToExpect} class`);
  }

  function XWinsIn23Moves() {
    playGameWherePlayerOneWins({});
  }

  function playGameWhereXWins() {
    playGameWherePlayerOneWins({ playerOne: 'X', playerTwo: 'O' });
  }

  function playGameWhereOWins() {
    const topMiddleBoard = sel(app, 'topMiddleBoard');
    clickEmptySquare(sel(topMiddleBoard, 'topLeftSquare')).assertIsFilledWith('X');

    playGameWherePlayerOneWins({ playerOne: 'O', playerTwo: 'X' });
  }

  function playGameWherePlayerOneWins({ playerOne = 'X', playerTwo = 'O' }) {
    const topLeftBoard = sel(app, 'topLeftBoard');
    const topMiddleBoard = sel(app, 'topMiddleBoard');
    const topRightBoard = sel(app, 'topRightBoard');
    const centerLeftBoard = sel(app, 'centerLeftBoard');
    const centerMiddleBoard = sel(app, 'centerMiddleBoard');
    const centerRightBoard = sel(app, 'centerRightBoard');
    const bottomLeftBoard = sel(app, 'bottomLeftBoard');
    const bottomMiddleBoard = sel(app, 'bottomMiddleBoard');
    const bottomRightBoard = sel(app, 'bottomRightBoard');

    // X wins top left board (top horizontal)
    clickEmptySquare(sel(topLeftBoard, 'topLeftSquare')).assertIsFilledWith(playerOne);
    clickEmptySquare(sel(topLeftBoard, 'centerLeftSquare')).assertIsFilledWith(playerTwo);
    clickEmptySquare(sel(centerLeftBoard, 'bottomLeftSquare')).assertIsFilledWith(playerOne);
    clickEmptySquare(sel(bottomLeftBoard, 'topLeftSquare')).assertIsFilledWith(playerTwo);
    clickEmptySquare(sel(topLeftBoard, 'topRightSquare')).assertIsFilledWith(playerOne);
    clickEmptySquare(sel(topRightBoard, 'topLeftSquare')).assertIsFilledWith(playerTwo);
    clickEmptySquare(sel(topLeftBoard, 'topMiddleSquare')).assertIsFilledWith(playerOne);

    // X wins center middle board (middle vertical)
    clickEmptySquare(sel(topMiddleBoard, 'centerMiddleSquare')).assertIsFilledWith(playerTwo);
    clickEmptySquare(sel(centerMiddleBoard, 'topMiddleSquare')).assertIsFilledWith(playerOne);
    clickEmptySquare(sel(topMiddleBoard, 'bottomMiddleSquare')).assertIsFilledWith(playerTwo);
    clickEmptySquare(sel(bottomMiddleBoard, 'bottomMiddleSquare')).assertIsFilledWith(playerOne);
    clickEmptySquare(sel(bottomMiddleBoard, 'centerMiddleSquare')).assertIsFilledWith(playerTwo);
    clickEmptySquare(sel(centerMiddleBoard, 'bottomMiddleSquare')).assertIsFilledWith(playerOne);
    clickEmptySquare(sel(bottomMiddleBoard, 'bottomLeftSquare')).assertIsFilledWith(playerTwo);
    clickEmptySquare(sel(bottomLeftBoard, 'bottomLeftSquare')).assertIsFilledWith(playerOne);
    clickEmptySquare(sel(bottomLeftBoard, 'centerMiddleSquare')).assertIsFilledWith(playerTwo);
    clickEmptySquare(sel(centerMiddleBoard, 'centerMiddleSquare')).assertIsFilledWith(playerOne);

    // X wins bottom right board (reverse diagonal) and the game
    clickEmptySquare(sel(centerRightBoard, 'bottomRightSquare')).assertIsFilledWith(playerTwo);
    clickEmptySquare(sel(bottomRightBoard, 'bottomLeftSquare')).assertIsFilledWith(playerOne);
    clickEmptySquare(sel(bottomLeftBoard, 'bottomRightSquare')).assertIsFilledWith(playerTwo); // 20. move
    // bottomLeftBoard is won by O, so X can play any board
    clickEmptySquare(sel(bottomRightBoard, 'topRightSquare')).assertIsFilledWith(playerOne);
    // centerMiddleBoard is won by X, so O can play any board
    assertGameStatus('Next player', playerTwo);
    clickEmptySquare(sel(topRightBoard, 'bottomRightSquare')).assertIsFilledWith(playerTwo);
    assertGameStatus('Next player', playerOne);
    clickEmptySquare(sel(bottomRightBoard, 'centerMiddleSquare')).assertIsFilledWith(playerOne);

    assertGameStatus('Winner', playerOne);
  }

  function clickEmptySquare(square) {
    assert.equal(square.textContent.trim(), '', 'square that should be empty is not');
    click(square);

    return {
      assertIsFilledWith: symbol => assert.equal(
        square.textContent, symbol, `square not filled with expected symbol "${symbol}"`,
      ),
    };
  }

  function clickSquare(square) {
    click(square);

    return {
      assertIsNotFilledWith: symbol => assert.notEqual(
        square.textContent, symbol, `square filled with unexpected symbol "${symbol}"`,
      ),
      assertIsFilledWith: symbol => assert.strictEqual(
        square.textContent, symbol, `square not filled with expected symbol "${symbol}"`,
      ),
    };
  }

  function selectAllBoardsExcept(boardTestIds) {
    return getAllBoardTestIds()
      .filter(data => !boardTestIds.includes(data.boardTestId))
      .map(data => sel(app, data.boardTestId));
  }

  function assertGameStatus(statusType, player) {
    expect(sel(app, 'gameStatus').textContent).to.have.string(statusType);
    expect(sel(app, 'gameStatus').querySelector('button').textContent).to.equal(player);
  }

  function assertBoardIsWhite(board) {
    assert.strictEqual(board.classList.contains('disabled-board'), false, `${board.dataset.testid} board should be white, not marked as disabled`);
    assert.strictEqual(board.classList.contains('x-won-board'), false, `${board.dataset.testid} board should be white, not x-won`);
    assert.strictEqual(board.classList.contains('o-won-board'), false, `${board.dataset.testid} board should be white, not o-won`);
  }

  function assertBoardIsRed(board) {
    assert.strictEqual(board.classList.contains('disabled-board'), true, `${board.dataset.testid} must contain disabled-board class`);
    assert.strictEqual(board.classList.contains('x-won-board'), false, `${board.dataset.testid}board should not be x-won`);
    assert.strictEqual(board.classList.contains('o-won-board'), false, `${board.dataset.testid}board should not be o-won`);
  }

  function assertBoardHasWonClass(board) {
    assert.strictEqual(
      board.classList.contains('o-won-board') || board.classList.contains('x-won-board'),
      true,
      `${board.dataset.testid} must contain x-won-board or o-won-board class`,
    );
    assert.strictEqual(board.classList.contains('disabled-board'), false, `${board.dataset.testid} board should not be marked as disabled`);
  }
});

function getAllBoardTestIds() {
  return [
    { boardTestId: 'topLeftBoard' },
    { boardTestId: 'topMiddleBoard' },
    { boardTestId: 'topRightBoard' },
    { boardTestId: 'centerLeftBoard' },
    { boardTestId: 'centerMiddleBoard' },
    { boardTestId: 'centerRightBoard' },
    { boardTestId: 'bottomLeftBoard' },
    { boardTestId: 'bottomMiddleBoard' },
    { boardTestId: 'bottomRightBoard' },
  ];
}
