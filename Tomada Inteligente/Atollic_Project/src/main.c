#include "config.h"
#include <string.h>

void init(){
	RCC->AHB1ENR=0x87;
}

int main(void) {
	init();

	char flag = 0;
	char toSerial[1] = {};

	//BAUD, OVER8, USART_NUN
	setSerial(2400, 0, 2);

	//PAYLOAD, PAYLOAD_CHAR_LENGTH, TX_DELAY
	sendSerial("Lucas", sizeof("Lucas") - 1, 10000);

	while(1) {
		flag = getSerial();
		if(flag) {
			toSerial[0] = flag;
			sendSerial(toSerial, strlen(toSerial), 10000);
			flag = 0;
		}
	}
}

	while(1) {}
}
