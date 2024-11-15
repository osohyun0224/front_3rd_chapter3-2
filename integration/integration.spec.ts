/* eslint-disable no-unused-vars */
import { exec } from 'child_process';
import { promisify } from 'util';

import { test, expect } from '@playwright/test';
import waitOn from 'wait-on';

const waitOnPromise = promisify(waitOn);

let serverProcess;
let clientProcess;

test.describe.serial('통합 테스트', () => {
  test.beforeAll(async () => {
    // 먼저 서버를 실행하도록 함
    serverProcess = exec('npx nodemon server.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Server error: ${error.message}`);
      }
      if (stderr) {
        console.error(`Server stderr: ${stderr}`);
      }
      console.log(`Server stdout: ${stdout}`);
    });

    // 그 다음 클라이언트를 실행하도록 함
    clientProcess = exec('pnpm dev', (error, stdout, stderr) => {
      if (error) {
        console.error(`Client error: ${error.message}`);
      }
      if (stderr) {
        console.error(`Client stderr: ${stderr}`);
      }
      console.log(`Client stdout: ${stdout}`);
    });

    // 클라이언트가 준비될 때까지 대기
    await waitOnPromise({
      resources: ['http://localhost:5173'],
      timeout: 10000,
    });
  });

  test.describe('반복 일정 등록', () => {
    test('1. 반복 일정을 등록할 때, 유저가 설정한 올바른 반복 주기로 등록되어야한다.', async ({
      page,
    }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 반복 일정 등록하기 */
      }
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('정원이랑 경복궁 야간개장');
      await page.getByLabel('날짜').fill('2024-11-13');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('13:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('22:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('경복궁에서 야간개장 데이트하기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('경복궁');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.locator('span').first().click();
      await page.getByLabel('반복 유형').selectOption('monthly');
      await page.getByTestId('event-submit-button').click();

      {
        /* 반복 일정이 내가 원하는 주기대로 제대로 등록되었는지 확인하기 */
      }
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '정원이랑 경복궁 야간개장2024-11-1213:00' })
        .nth(1)
        .click();
    });

    test('2. 반복 유형을 매일로 선택하면, 매일 반복되는 일정이 생성되어야한다.', async ({
      page,
    }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 반복 유형을 매일로 하는 일정 등록 */
      }
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('매일 생성되는 일정');
      await page.getByLabel('날짜').fill('2024-11-15');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('01:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('13:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('매일매일 일정이 있다니?!');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('우리집');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.locator('span').first().click();

      {
        /* 반복 유형을 매일로 선택 */
      }
      await page.getByLabel('반복 유형').selectOption('daily');
      await page.getByLabel('반복 간격').fill('1');
      await page.getByTestId('event-submit-button').click();

      {
        /* 24년 11월 15일부터 계속 매일매일 일정이 존재함 */
      }
      await page.getByRole('cell', { name: '15 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '16 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '17 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '18 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '19 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '20 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '21 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '22 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '23 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '24 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '25 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '26 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '27 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '28 매일 생성되는 일정' }).click();
      await page.getByRole('cell', { name: '29 매일 생성되는 일정' }).click();
    });

    test('3. 반복 유형을 매주로 선택하면, 매주 반복되는 일정이 생성되어야한다.', async ({
      page,
    }) => {
      test.setTimeout(100000);
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 반복 유형을 매주로 하는 일정 등록 */
      }
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('매주 반복되는 일정');
      await page.getByLabel('날짜').fill('2024-11-15');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('01:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('13:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('매주 반복되는 일정이라고!~??');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('우리집');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.locator('span').first().click();

      {
        /* 반복 유형을 매주로 선택 */
      }
      await page.getByLabel('반복 유형').selectOption('weekly');
      await page.getByTestId('event-submit-button').click();

      {
        /* 24년 11월 14일부터 계속 매주 반복되는 일정이 존재함 */
      }
      await page.getByRole('cell', { name: '14 매주 반복되는 일정' }).click();
      await page.getByRole('cell', { name: '21 매주 반복되는 일정' }).click();
      await page.getByRole('cell', { name: '28 매주 반복되는 일정' }).click();
    });

    test('4. 반복 유형을 매월로 선택하면, 매월 반복되는 일정이 생성되어야한다.', async ({
      page,
    }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 반복 유형을 매월로 하는 일정 등록 */
      }
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('매월 반복되는 일정');
      await page.getByLabel('날짜').fill('2024-11-15');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('01:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('02:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('매월 반복되는 일정이라니....');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('우리집');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.getByText('반복 일정').click();

      {
        /* 반복 유형을 매월로 선택 */
      }
      await page.getByLabel('반복 유형').selectOption('monthly');
      await page.getByTestId('event-submit-button').click();

      {
        /* 24년 11월 15일부터 계속 매월 반복되는 일정이 존재함 */
      }
      await page.getByRole('heading', { name: '년 11월' }).click();
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매월 반복되는 일정2024-11-1401:00 -' })
        .nth(1)
        .click();
      await page.getByLabel('Next').click();
      await page.getByRole('heading', { name: '년 12월' }).click();
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매월 반복되는 일정2024-12-1401:00 -' })
        .nth(1)
        .click();
      await page.getByLabel('Next').click();
      await page.getByRole('heading', { name: '년 1월' }).click();
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매월 반복되는 일정2025-01-1401:00 -' })
        .nth(1)
        .click();
    });

    test('5. 반복 유형을 매년로 선택하면, 매년 반복되는 일정이 생성되어야한다.', async ({
      page,
    }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('매년 반복되는 우리의 기념일 일정');
      await page.getByLabel('날짜').fill('2023-03-29');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('01:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').press('ArrowLeft');
      await page.getByLabel('종료 시간').press('ArrowLeft');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').press('ArrowLeft');
      await page.getByLabel('종료 시간').fill('12:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('기념일 세기!');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('우리집');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.locator('span').first().click();

      {
        /* 반복 유형을 매년로 선택 */
      }
      await page.getByLabel('반복 유형').selectOption('yearly');
      await page.getByTestId('event-submit-button').click();

      {
        /* 23년 3월 29일부터 계속 매년 반복되는 일정이 존재함 */
      }
      {
        /* 현재는 24-11이므로, 23년 3월로 이동 */
      }
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();
      await page.getByLabel('Previous').click();

      {
        /* 23년 3월 28일에 일정이 존재함 */
      }
      await page.getByTestId('month-view').getByText('28').click();
      await page.getByRole('cell', { name: '매년 반복되는 우리의 기념일 일정' }).click();
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매년 반복되는 우리의 기념일 일정2023-03-' })
        .nth(1)
        .click();

      {
        /* 24년 3월 28일에 일정이 존재함 */
      }
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();

      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매년 반복되는 우리의 기념일 일정2024-03-' })
        .first()
        .click();

      {
        /* 25년 3월 28일에 일정이 존재함 */
      }
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByRole('cell', { name: '매년 반복되는 우리의 기념일 일정' }).click();
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매년 반복되는 우리의 기념일 일정2025-03-' })
        .first()
        .click();
    });
  });

  test.describe('반복 일정 삭제', () => {
    test('1. 반복 일정 중 특정 하루의 일정을 삭제하면 단일 일정만 삭제된다.', async ({ page }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 반복 일정 등록하기 */
      }
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('매일매일 코드리뷰');
      await page.getByLabel('날짜').fill('2024-11-15');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('18:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('20:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('코드리뷰 매일매일 해보자');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('빗버킷');
      await page.getByLabel('카테고리').selectOption('업무');
      await page.locator('span').first().click();
      await page.getByTestId('event-submit-button').click();

      {
        /* 반복 일정이 제대로 등록되었는지 확인하기 14, 15, 16일 모두 확인됨 */
      }
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매일매일 코드리뷰2024-11-1418:00 - 20' })
        .first()
        .click();
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매일매일 코드리뷰2024-11-1518:00 - 20' })
        .first()
        .click();
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매일매일 코드리뷰2024-11-1618:00 - 20' })
        .first()
        .click();

      {
        /* 반복 일정이 15일 일정만 삭제하기 */
      }
      await page.locator('div:nth-child(3) > div > div:nth-child(2) > button:nth-child(2)').click();

      {
        /* 15일 일정만 삭제 되었는지 확인하기 (14, 16일 일정이 남아있음) */
      }
      await page.getByRole('cell', { name: '14 매일매일 코드리뷰' }).click();
      await page.getByRole('cell', { name: '15' }).click();
      await page.getByRole('cell', { name: '16 매일매일 코드리뷰' }).click();
    });

    test('2. 반복 일정을 포함한 여러 일정들이 존재할 때, 모든 일정을 삭제할 수 있어야 한다.', async ({
      page,
    }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 첫 번째 해리와 과제하기 일정 추가 */
      }
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('해리와 과제하기');
      await page.getByLabel('날짜').fill('2024-11-14');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('11:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowLeft');
      await page.getByLabel('종료 시간').fill('13:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('해리와 항해 과제하기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('스파크플러스');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.getByText('반복 일정').click();
      await page.getByLabel('반복 종료일').fill('2024-11-15');
      await page.getByTestId('event-submit-button').click();

      {
        /* 두 번째 해리와 점심 일정 추가 */
      }
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('해리와 점심');
      await page.getByLabel('날짜').fill('2024-11-14');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowLeft');
      await page.getByLabel('시작 시간').press('ArrowLeft');
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('13:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowLeft');
      await page.getByLabel('종료 시간').press('ArrowLeft');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('14:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('아웃백가기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('코엑스');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.getByTestId('event-submit-button').click();

      {
        /* 모든 일정 삭제하기 버튼 클릭 */
      }
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 정상적으로 삭제되어 검색 결과가 없습니다 텍스트가 노출됨 */
      }
      await page.getByText('검색 결과가 없습니다').click();
    });
  });

  test.describe('반복 일정 관리', () => {
    test('1. 반복 일정 중에 특정 하루의 일정만 반복을 해제하면 단일 일정으로 남아있어야한다.', async ({
      page,
    }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 반복 일정 등록하기 */
      }
      await page.getByLabel('제목').fill('매일 정원이랑 운동하기');
      await page.getByLabel('날짜').fill('2024-11-15');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('18:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('20:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('매일 광나루한강공원에서 운동하기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('광나루한강공원');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.locator('span').first().click();
      await page.getByTestId('event-submit-button').click();

      {
        /* 반복 일정 (매일 운동하기)이 제대로 등록되었는지 확인하기 14, 15, 16일 모두 확인됨 */
      }
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매일 정원이랑 운동하기2024-11-1418:00' })
        .first()
        .click();
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매일 정원이랑 운동하기2024-11-1518:00' })
        .first()
        .click();
      await page
        .getByTestId('event-list')
        .locator('div')
        .filter({ hasText: '매일 정원이랑 운동하기2024-11-1618:00' })
        .first()
        .click();

      {
        /* 15일날에는 운동을 안하고 데이트 하기로 일정을 수정하기 */
      }
      await page.locator('div:nth-child(3) > div > div:nth-child(2) > button').first().click();
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('정원이랑 데이트하기');
      await page.getByLabel('설명').fill('잠실에서 영화보기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('롯데월드몰');
      await page.locator('label').filter({ hasText: '반복 일정' }).locator('svg').click();
      await page.getByTestId('event-submit-button').click();

      {
        /* 15일은 단일일정으로, 14, 16일은 반복일정으로 남아있는지 확인하기 */
      }
      await page.getByRole('cell', { name: '14 매일 정원이랑 운동하기' }).click();
      await page.getByRole('cell', { name: '15 정원이랑 데이트하기' }).click();
      await page.getByRole('cell', { name: '16 매일 정원이랑 운동하기' }).click();
    });

    test('2. 반복 일정에는 반복 아이콘이 표시되어야한다.', async ({ page }) => {
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 반복 일정 등록하기 */
      }
      await page.getByLabel('제목').fill('반복 일정');
      await page.getByLabel('날짜').fill('2024-11-15');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('01:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('22:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('반복 일정이면 아이콘이 뜰까요?');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('내집');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.locator('label').filter({ hasText: '반복 일정' }).click();
      await page.getByLabel('반복 유형').selectOption('daily');
      await page.getByTestId('event-submit-button').click();

      {
        /* 반복 일정에 반복 아이콘이 표시되는지 확인하기 */
      }
      await page.locator('.chakra-stack > .chakra-stack > .chakra-icon').first().click();
    });
  });

  test.describe('반복 일정 종료', () => {
    test('1. 반복 종료일이 시작일보다 앞선 날이면 일정이 등록되지 않아야한다.', async ({
      page,
    }) => {
      test.setTimeout(100000);
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 일정 등록하기 시작은 24년 11월 22일 */
      }
      await page.getByLabel('제목').fill('종료가 시작보다 앞설때');
      await page.getByLabel('날짜').press('ArrowUp');
      await page.getByLabel('날짜').press('ArrowRight');
      await page.getByLabel('날짜').fill('2024-11-22');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('01:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('02:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('끝내긴 아쉬운걸');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('시작이 반이다!');
      await page.getByLabel('카테고리').selectOption('업무');
      await page.locator('span').first().click();

      {
        /* 반복 종료일을 24년 8월 8일로 설정하기 */
      }
      await page.getByLabel('반복 종료일').fill('2024-08-08');
      await page.getByTestId('event-submit-button').click();

      {
        /* 일정이 등록되지 않았다는 것을 확인하기 */
      }
      await page.getByText('검색 결과가 없습니다').click();
    });

    test('2. 반복 종료일을 지정한 이벤트에 대해서 반복 시작일부터 종료일까지 캘린더에 모두 일정이 존재해야한다.', async ({
      page,
    }) => {
      test.setTimeout(60000);
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 정원이랑 데이트하는 일정 추가 */
      }
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('정원이랑 데이트');
      await page.getByLabel('날짜').fill('2024-11-15');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('18:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('22:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('책 읽고 밥 먹기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('성수');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.locator('span').first().click();

      {
        /* 이 일정에 대해 반복 종료일을 추가 */
      }
      await page.getByLabel('반복 종료일').fill('2024-11-20');
      await page.getByTestId('event-submit-button').click();

      {
        /* 반복 종료일을 지정한 일정에 대해 반복 시작일부터 종료일까지 모두 일정이 존재함 */
      }
      await page.getByRole('cell', { name: '15 정원이랑 데이트' }).locator('div').first().click();
      await page.getByRole('cell', { name: '16 정원이랑 데이트' }).locator('div').first().click();
      await page.getByRole('cell', { name: '17 정원이랑 데이트' }).locator('div').first().click();
      await page.getByRole('cell', { name: '18 정원이랑 데이트' }).locator('div').first().click();
      await page.getByRole('cell', { name: '19 정원이랑 데이트' }).locator('div').first().click();
      await page.getByRole('cell', { name: '20 정원이랑 데이트' }).locator('div').first().click();
    });

    test('3. 반복 종료일을 지정한 이벤트에 대해서 반복 종료일 이후에는 일정이 존재하지 않아야한다.', async ({
      page,
    }) => {
      test.setTimeout(60000);
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 정원이랑 카페가기 일정 추가 */
      }
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('정원이랑 카페가기');
      await page.getByLabel('날짜').fill('2024-11-14');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('18:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('22:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('씨엘트리');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('송리단길');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.locator('span').first().click();
      await page.getByLabel('반복 종료일').fill('2024-11-19');
      await page.getByTestId('event-submit-button').click();

      {
        /* 반복 종료일을 지정한 일정에 대해 반복 시작일부터 종료일까지 모두 일정이 존재함 */
      }
      await page.getByRole('cell', { name: '14 정원이랑 카페가기' }).locator('div').first().click();
      await page.getByRole('cell', { name: '15 정원이랑 카페가기' }).locator('div').first().click();
      await page.getByRole('cell', { name: '16 정원이랑 카페가기' }).locator('div').first().click();
      await page.getByRole('cell', { name: '17 정원이랑 카페가기' }).locator('div').first().click();
      await page.getByRole('cell', { name: '18 정원이랑 카페가기' }).locator('div').first().click();
      await page.getByRole('cell', { name: '19 정원이랑 카페가기' }).locator('div').first().click();

      {
        /* 반복 종료일 이후에는 일정이 존재하지 않아야함 */
      }
      await page.getByRole('cell', { name: '20' }).click();
    });

    test('4. 반복 종료일을 지정하지 않고 반복 일정을 추가하면 모든 일정이 반복되어야 한다.', async ({
      page,
    }) => {
      test.setTimeout(60000);
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 정원이랑 데이트하기 매일 반복 일정 추가 */
      }
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('정원이랑 데이트하기');
      await page.getByLabel('날짜').fill('2024-11-14');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('20:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('22:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('매일매일 만나서 운동하기');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('광나루 한강공원');
      await page.getByLabel('카테고리').selectOption('개인');
      await page.locator('span').first().click();
      await page.getByTestId('event-submit-button').click();

      {
        /* 예시로 25년 6월로 이동 */
      }
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();

      {
        /* 25년 6월 30일에도 일정이 존재함 */
      }
      await page
        .getByRole('row', { name: '정원이랑 데이트하기 30' })
        .locator('div')
        .first()
        .click();
    });

    test('5. 반복 종료일을 지정하지 않았을 경우에는 25년 6월까지의 일정만 생성되고, 그 이후로는 생성되지 않는다.', async ({
      page,
    }) => {
      test.setTimeout(100000);
      await page.goto('http://localhost:5173/');
      await page.getByRole('button', { name: '모든 일정 삭제' }).click();
      await page.reload();

      {
        /* 반복 종료일이 없는 일정 등록 */
      }
      await page.getByLabel('제목').click();
      await page.getByLabel('제목').fill('종료일 없는 반복일정');
      await page.getByLabel('날짜').fill('2024-11-15');
      await page.getByLabel('시작 시간').click();
      await page.getByLabel('시작 시간').press('ArrowUp');
      await page.getByLabel('시작 시간').press('ArrowRight');
      await page.getByLabel('시작 시간').fill('01:00');
      await page.getByLabel('종료 시간').click();
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').press('ArrowLeft');
      await page.getByLabel('종료 시간').press('ArrowUp');
      await page.getByLabel('종료 시간').press('ArrowRight');
      await page.getByLabel('종료 시간').fill('22:00');
      await page.getByLabel('설명').click();
      await page.getByLabel('설명').fill('종료가 없다!');
      await page.getByLabel('위치').click();
      await page.getByLabel('위치').fill('우리집');
      await page.getByLabel('카테고리').selectOption('업무');
      await page.locator('span').first().click();
      await page.getByTestId('event-submit-button').click();

      {
        /* 25년 7월로 이동하기 */
      }
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();
      await page.getByLabel('Next').click();

      {
        /* 25년 7월에 일정이 없어야함 */
      }
      await page.getByRole('cell', { name: '1', exact: true }).click();
      await page.getByTestId('event-list').click();
      await page.getByText('검색 결과가 없습니다').click();

      {
        /* 25년 6월로 이동하기 */
      }
      await page.getByLabel('Previous').click();

      {
        /* 25년 6월에 일정이 존재함 */
      }
      await page.getByRole('cell', { name: '26 종료일 없는 반복일정' }).click();
      await page.getByRole('cell', { name: '27 종료일 없는 반복일정' }).click();
      await page.getByRole('cell', { name: '28 종료일 없는 반복일정' }).click();
      await page.getByRole('cell', { name: '29 종료일 없는 반복일정' }).click();
    });
  });

  test.afterAll(() => {
    // 프로세스 종료
    if (serverProcess) {
      serverProcess.kill();
    }
    if (clientProcess) {
      clientProcess.kill();
    }
  });
});
