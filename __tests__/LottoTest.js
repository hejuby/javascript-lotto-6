import Lotto from "../src/Lotto.js";

describe("로또 클래스 테스트", () => {
  test("로또 번호의 개수가 6개가 넘어가면 예외가 발생한다.", () => {
    expect(() => {
      new Lotto([1, 2, 3, 4, 5, 6, 7]);
    }).toThrow("[ERROR]");
  });

  // TODO: 이 테스트가 통과할 수 있게 구현 코드 작성
  test("로또 번호에 중복된 숫자가 있으면 예외가 발생한다.", () => {
    expect(() => {
      new Lotto([1, 2, 3, 4, 5, 5]);
    }).toThrow("[ERROR]");
  });

  // 아래에 추가 테스트 작성 가능
  test("번호 5개를 맞춘 경우", () => {
    const lotto = new Lotto([1, 2, 3, 4, 5, 6]);
    const result = lotto.compareTo(new Lotto([1, 2, 3, 4, 5, 7]), 45);
    expect(result).toEqual(5);
  });

  test("번호 5개와 보너스 번호를 맞춘 경우", () => {
    const lotto = new Lotto([1, 2, 3, 4, 5, 6]);
    const result = lotto.compareTo(new Lotto([1, 2, 3, 4, 5, 7]), 7);
    expect(result).toEqual(7);
  });
});
