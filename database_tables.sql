
CREATE TABLE `hhh`.`users` ( `name` VARCHAR(40) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL , `user_id` INT NOT NULL AUTO_INCREMENT , `email` VARCHAR(45) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL , `password` VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_general_ci NULL , `phone` INT(10) NULL , PRIMARY KEY (`user_id`, `email`)) ENGINE = InnoDB;
CREATE TABLE `hhh`.`wallet` ( `wallet_id` INT NOT NULL AUTO_INCREMENT , `expiry` DATETIME NULL , `balance` INT NULL DEFAULT '1000' , `user_id` INT NOT NULL , PRIMARY KEY (`wallet_id`)) ENGINE = InnoDB;
/*SELECT * FROM `wallet`
SELECT * FROM `users`*/
alter table wallet add FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
SELECT * FROM `wallet`
CREATE TABLE `hhh`.`merch` ( `merch_id` INT NOT NULL AUTO_INCREMENT , `price` INT NOT NULL , `merch_limit` INT NOT NULL , `merch_name` VARCHAR(45) NOT NULL , `image_url` VARCHAR(90) NULL , `description` VARCHAR(255) NULL , PRIMARY KEY (`merch_id`)) ENGINE = InnoDB;
CREATE TABLE `hhh`.`merchandise_order` ( `order_id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , `quantity` INT NULL , `merch_id` INT NOT NULL , PRIMARY KEY (`order_id`)) ENGINE = InnoDB;
alter table merchandise_order add FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, add FOREIGN KEY (merch_id) REFERENCES merch(merch_id) ON DELETE CASCADE
CREATE TABLE `hhh`.`merchandise_cart` ( `cart_item_id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , `merch_id` INT NOT NULL , `quantity` INT NULL , PRIMARY KEY (`cart_item_id`)) ENGINE = InnoDB;
alter table merchandise_cart add FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, add FOREIGN KEY (merch_id) REFERENCES merch(merch_id) ON DELETE CASCADE
ALTER TABLE `merchandise_order` ADD `price` INT NULL ;
CREATE TABLE `hhh`.`tours` ( `tour_id` INT NOT NULL AUTO_INCREMENT , `tours_limit` INT NOT NULL , `price` INT NOT NULL , `location` VARCHAR(45) NOT NULL , `tour_name` VARCHAR(50) NULL , PRIMARY KEY (`tour_id`)) ENGINE = InnoDB;
CREATE TABLE `hhh`.`ticket_purchase` ( `user_id` INT NOT NULL , `ticket_quantity` INT NOT NULL , `ticket_id` INT NOT NULL AUTO_INCREMENT , `tour_id` INT NOT NULL , `price` INT NULL , PRIMARY KEY (`ticket_id`)) ENGINE = InnoDB;
alter table ticket_purchase add FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, add FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE CASCADE
ALTER TABLE `ticket_purchase` ADD `time_purchased` DATETIME NULL ;
ALTER TABLE `merchandise_order` ADD `time_purchased` DATETIME NULL ;
​