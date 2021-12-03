#include "config.h"

void init(){
	RCC->AHB1ENR=0x87;
}

int main(void) {
	init();

	//BAUD, OVER8, USART_NUN
	setSerial(9600, 0, 2);

	//PAYLOAD, PAYLOAD_CHAR_LENGTH, TX_DELAY
	sendSerial("Lucas", sizeof("Lucas") - 1, 10000);

	while(1) {}
}
