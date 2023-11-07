import { Console, Random } from '@woowacourse/mission-utils';
import { MESSAGE, UNIT, NEW_LINE, RANGE_START, RANGE_END, BALL_NUMBERS, SPLIT_SEPARATOR, INITIAL_RESULT_VALUE, PERCENT, PRECISION_POINT, RESULT } from './constant/Constant.js';
import Validation from './validation/Validation.js';
import Lotto from './Lotto.js';

class Game {
  #pricePaid;
  #boughtLottos;
  #winningNumbers;
  #bonusNumber;
  #gameResult;

  async play() {
    this.#pricePaid = await this.#setPrice();
    this.#setLottos();
    this.printLottos();
    this.#winningNumbers = await this.#setWinningNumbers();
    this.#bonusNumber = await this.#setBonusNumber();
    this.#gameResult = this.#setGameResult();
    this.printResult();
  }

  async #setPrice() {
    while (true) {
      try {
        const input = await Console.readLineAsync(MESSAGE.PRICE_INPUT);
        const price = Number(input);
        this.#validatePrice(price);
        return price;
      } catch(e) {
        Console.print(e);
      }
    }
  }

  #setLottos() {
    this.#boughtLottos = [];
    Array.from({ length: this.#pricePaid/UNIT }).forEach(() => {
      this.#boughtLottos.push(this.#generateRandomLotto());
    });
  }

  async #setWinningNumbers() {
    while (true) {
      try {
        const input = await Console.readLineAsync(MESSAGE.LOTTO_INPUT);
        const lotto = new Lotto(input.split(SPLIT_SEPARATOR).map((number) => Number(number)).sort((a, b) => a - b));
        return lotto;
      } catch(e) {
        Console.print(e);
      }
    }
  }

  async #setBonusNumber() {
    while (true) {
      try {
        const input = await Console.readLineAsync(MESSAGE.BONUS_INPUT);
        const bonusNumber = Number(input);
        this.#validateBonusNumber(bonusNumber);
        return bonusNumber;
      } catch(e) {
        Console.print(e);
      }
    }
  }

  #setGameResult() {
    const result = {
      three: INITIAL_RESULT_VALUE,
      four: INITIAL_RESULT_VALUE,
      five: INITIAL_RESULT_VALUE,
      bonus: INITIAL_RESULT_VALUE,
      six: INITIAL_RESULT_VALUE
    };
    this.#boughtLottos.forEach((lotto) => {
      const draw = lotto.compareTo(this.#winningNumbers, this.#bonusNumber);
      if (draw === RESULT.THREE) result.three++;
      if (draw === RESULT.FOUR) result.four++;
      if (draw === RESULT.FIVE) result.five++;
      if (draw === RESULT.BONUS) result.bonus++;
      if (draw === RESULT.SIX) result.six++;
    })
    return result;
  }

  printLottos() {
    Console.print(`${NEW_LINE}${this.#boughtLottos.length}${MESSAGE.BOUGHT_LOTTOS}`);
    this.#boughtLottos.forEach((lotto) => {
      lotto.printLotto();
    });
  }

  printResult() {
    Console.print(MESSAGE.LOTTO_RESULT_PREFIX);
    Console.print(`${MESSAGE.LOTTO_RESULT_THREE}${this.#gameResult.three}${MESSAGE.LOTTO_RESULT_SUFFIX}`);
    Console.print(`${MESSAGE.LOTTO_RESULT_FOUR}${this.#gameResult.four}${MESSAGE.LOTTO_RESULT_SUFFIX}`);
    Console.print(`${MESSAGE.LOTTO_RESULT_FIVE}${this.#gameResult.five}${MESSAGE.LOTTO_RESULT_SUFFIX}`);
    Console.print(`${MESSAGE.LOTTO_RESULT_BONUS}${this.#gameResult.bonus}${MESSAGE.LOTTO_RESULT_SUFFIX}`);
    Console.print(`${MESSAGE.LOTTO_RESULT_SIX}${this.#gameResult.six}${MESSAGE.LOTTO_RESULT_SUFFIX}`);
    Console.print(`${MESSAGE.EARNING_RATE_PREFIX}${this.#calculateEarningRate()}${MESSAGE.EARNING_RATE_SUFFIX}`);
  }

  #validatePrice(price) {
    Validation.isPriceNull(price);
    Validation.isPriceNotNumber(price);
    Validation.isPriceBadUnit(price);
  }

  #validateBonusNumber(bonusNumber) {
    Validation.isBonusNotNumber(bonusNumber);
    Validation.isBonusBadRange(bonusNumber);
  }

  #generateRandomLotto() {
    return new Lotto(Random.pickUniqueNumbersInRange(RANGE_START, RANGE_END, BALL_NUMBERS).sort((a, b) => a - b));
  }

  #calculateEarningRate() {
    const wholePrizeAmount = this.#gameResult.three * MATCH.THREE + 
      this.#gameResult.four * MATCH.FOUR + 
      this.#gameResult.five * MATCH.FIVE + 
      this.#gameResult.bonus * MATCH.BONUS + 
      this.#gameResult.six * MATCH.SIX;
    return (wholePrizeAmount*PERCENT/this.#pricePaid).toFixed(PRECISION_POINT);
  }
};

export default Game;