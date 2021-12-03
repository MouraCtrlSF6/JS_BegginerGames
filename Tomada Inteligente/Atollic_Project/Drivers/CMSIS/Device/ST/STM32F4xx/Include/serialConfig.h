/*
 * setSerial.h
 *
 *  Created on: 29 de nov de 2021
 *      Author: Lucas Moura da Silva
 */

#ifndef CMSIS_DEVICE_ST_SETSERIAL_H_
#define CMSIS_DEVICE_ST_SETSERIAL_H_

#endif /* CMSIS_DEVICE_ST_SETSERIAL_H_ */

#include "stm32f4xx.h"

float calcUsartDiv(int baud, int over8){
	const float fck = 16000000.0;
	return fck/(8.0 * (2.0 - over8) * baud);
}

int BRR_VALUE(float USART_DIV, int over8) {
	const int mantisa_part = USART_DIV;
	int fractional_part = 0;

	if(!over8) {
		fractional_part = (USART_DIV - mantisa_part) * 16;
	} else {
		fractional_part = (USART_DIV - mantisa_part) * 8;
	}

	return (mantisa_part << 4) + fractional_part;
}

void delay(int num) {
	for(int i = 0; i<num; i++);
}

void setUsart1Config(int BRR_VALUE){
	RCC->APB2ENR|=RCC_APB2ENR_USART1EN;
	GPIOA->MODER&=~(GPIO_MODER_MODER9_0|GPIO_MODER_MODER10_0);
	GPIOA->MODER|=(GPIO_MODER_MODER9_1|GPIO_MODER_MODER10_1);
	GPIOA->AFR[1]=0x770;

	USART1->CR1|=USART_CR1_UE;
	USART1->CR1|=USART_CR1_TE;
	USART1->CR1|=USART_CR1_RE;
	USART1->CR1|=USART_CR1_RXNEIE;
	USART1->CR2=0;
	USART1->CR3=0;

	USART1->BRR = BRR_VALUE;
}

void setUsart2Config(int BRR_VALUE){
	RCC->APB1ENR|=RCC_APB1ENR_USART2EN;
	GPIOA->MODER&=~(GPIO_MODER_MODER2_0|GPIO_MODER_MODER3_0);
	GPIOA->MODER|=(GPIO_MODER_MODER2_1|GPIO_MODER_MODER3_1);
	GPIOA->AFR[0]|=0x7700;

	USART2->CR1|=USART_CR1_UE;
	USART2->CR1|=USART_CR1_TE;
	USART2->CR1|=USART_CR1_RE;
	USART2->CR2|=0x00;
	USART2->CR3|=0x00;

	// USART2->BRR = BRR_VALUE;
	USART2->BRR|=104<<4;
}

void setSerial(int baud, int over8, int usart){
	const float USART_DIV = calcUsartDiv(baud, over8);
	const int brrValue = BRR_VALUE(USART_DIV, over8);

	switch(usart) {
		case 1:
			setUsart1Config(brrValue);
			break;
		case 2:
			setUsart2Config(brrValue);
			break;
	}
}

char getSerial(char command){
	if(USART2->SR&USART_SR_RXNE){
		command = USART2->DR;
	} else {
		//Não foi possível receber da serial
		command = 'N';
	}

	return command;
}

void sendSerial(char *payload, uint8_t len, int txDelay){
	while (!(USART2->SR & USART_SR_TXE)) {};

	for(uint8_t i = 0; i < len; i++){
		USART2->DR = *(payload + i);
		delay(txDelay);
	}
}
